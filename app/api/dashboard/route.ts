import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Book from "@/app/models/Book";
import User from "@/app/models/User";
import BorrowRequest from "@/app/models/BorrowRequest";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get total books
    const totalBooks = await Book.countDocuments();

    // Get active users (users created in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get books borrowed (currently borrowed)
    const booksBorrowed = await Book.countDocuments({ status: "borrowed" });

    // Get overdue returns
    const now = new Date();
    const overdueReturns = await BorrowRequest.countDocuments({
      status: "approved",
      dueDate: { $lt: now },
    });

    // Get recent activity (last 5 borrow requests)
    const recentActivity = await BorrowRequest.find()
      .populate("user", "name")
      .populate("book", "bookTitle")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get popular books (most borrowed)
    const popularBooks = await BorrowRequest.aggregate([
      { $match: { status: { $in: ["approved", "returned"] } } },
      {
        $group: {
          _id: "$book",
          borrowCount: { $sum: 1 },
        },
      },
      { $sort: { borrowCount: -1 } },
      { $limit: 5 },
    ]);

    // Populate book details for popular books
    const popularBooksWithDetails = await Book.populate(popularBooks, {
      path: "_id",
      select: "bookTitle",
    });

    // Calculate available books for popular titles
    const popularBooksData = await Promise.all(
      popularBooksWithDetails.map(async (item: any) => {
        const totalCopies = await Book.countDocuments({
          bookTitle: item._id.bookTitle,
        });
        const borrowedCopies = await Book.countDocuments({
          bookTitle: item._id.bookTitle,
          status: "borrowed",
        });
        return {
          title: item._id.bookTitle,
          borrows: item.borrowCount,
          available: totalCopies - borrowedCopies,
        };
      })
    );

    // Previous month stats for comparison
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const previousMonthBooks = await Book.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    });
    const currentMonthBooks = await Book.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const booksChange =
      previousMonthBooks > 0
        ? (
            ((currentMonthBooks - previousMonthBooks) / previousMonthBooks) *
            100
          ).toFixed(0)
        : "0";

    const previousMonthUsers = await User.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    });
    const currentMonthUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const usersChange =
      previousMonthUsers > 0
        ? (
            ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) *
            100
          ).toFixed(0)
        : "0";

    return NextResponse.json(
      {
        success: true,
        data: {
          stats: {
            totalBooks,
            booksChange: `${booksChange >= "0" ? "+" : ""}${booksChange}%`,
            booksChangeDirection: booksChange >= "0" ? "up" : "down",
            activeUsers,
            usersChange: `${usersChange >= "0" ? "+" : ""}${usersChange}%`,
            usersChangeDirection: usersChange >= "0" ? "up" : "down",
            booksBorrowed,
            overdueReturns,
          },
          recentActivity: recentActivity.map((activity: any) => ({
            user: activity.user?.name || "Unknown User",
            action:
              activity.status === "returned"
                ? "returned"
                : activity.status === "approved"
                ? "borrowed"
                : "overdue",
            book: activity.book?.bookTitle || "Unknown Book",
            time: getTimeAgo(activity.createdAt),
            status:
              activity.status === "returned" || activity.status === "approved"
                ? "success"
                : "warning",
          })),
          popularBooks: popularBooksData,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to get time ago
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}
