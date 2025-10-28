import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import BorrowRequest from "@/app/models/BorrowRequest";
import User from "@/app/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Get current user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const notifications: Array<{
      id: string;
      type: "overdue" | "due_soon" | "due_today";
      message: string;
      time: string;
      read: boolean;
      priority: "high" | "medium" | "low";
      bookTitle: string;
      dueDate: string;
    }> = [];

    // Get user's overdue books
    const overdueRequests = await BorrowRequest.find({
      user: user._id,
      status: "approved",
      dueDate: { $lt: now },
    })
      .populate("book", "bookTitle")
      .sort({ dueDate: 1 });

    overdueRequests.forEach((request: any) => {
      const daysOverdue = Math.floor(
        (now.getTime() - new Date(request.dueDate!).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const lateFee = daysOverdue * 100;
      notifications.push({
        id: request._id.toString(),
        type: "overdue",
        message: `"${request.book.bookTitle}" is ${daysOverdue} day${
          daysOverdue > 1 ? "s" : ""
        } overdue! Late fee: ₦${lateFee}`,
        time: `Due ${getTimeAgo(request.dueDate!)}`,
        read: false,
        priority: "high",
        bookTitle: request.book.bookTitle,
        dueDate: new Date(request.dueDate!).toLocaleDateString(),
      });
    });

    // Get books due today
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const dueTodayRequests = await BorrowRequest.find({
      user: user._id,
      status: "approved",
      dueDate: { $gte: startOfToday, $lte: endOfToday },
    })
      .populate("book", "bookTitle")
      .sort({ dueDate: 1 });

    dueTodayRequests.forEach((request: any) => {
      notifications.push({
        id: request._id.toString(),
        type: "due_today",
        message: `"${request.book.bookTitle}" is due today! Return it to avoid late fees.`,
        time: "Today",
        read: false,
        priority: "high",
        bookTitle: request.book.bookTitle,
        dueDate: new Date(request.dueDate!).toLocaleDateString(),
      });
    });

    // Get books due soon (within next 3 days, excluding today)
    const tomorrow = new Date(endOfToday);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const dueSoonRequests = await BorrowRequest.find({
      user: user._id,
      status: "approved",
      dueDate: { $gte: tomorrow, $lte: threeDaysFromNow },
    })
      .populate("book", "bookTitle")
      .sort({ dueDate: 1 });

    dueSoonRequests.forEach((request: any) => {
      const daysUntilDue = Math.ceil(
        (new Date(request.dueDate!).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      notifications.push({
        id: request._id.toString(),
        type: "due_soon",
        message: `"${request.book.bookTitle}" is due in ${daysUntilDue} day${
          daysUntilDue > 1 ? "s" : ""
        }`,
        time: `Due ${getTimeAgo(request.dueDate!)}`,
        read: false,
        priority: daysUntilDue === 1 ? "medium" : "low",
        bookTitle: request.book.bookTitle,
        dueDate: new Date(request.dueDate!).toLocaleDateString(),
      });
    });

    // Sort notifications by priority (high, medium, low) and time
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    notifications.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount: notifications.length,
        summary: {
          overdue: overdueRequests.length,
          dueToday: dueTodayRequests.length,
          dueSoon: dueSoonRequests.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching reader notifications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (seconds < 0) {
    // Future date
    const futureSeconds = Math.abs(seconds);
    if (futureSeconds < 60) return "in a few seconds";
    if (futureSeconds < 3600)
      return `in ${Math.floor(futureSeconds / 60)} minutes`;
    if (futureSeconds < 86400)
      return `in ${Math.floor(futureSeconds / 3600)} hours`;
    if (futureSeconds < 604800)
      return `in ${Math.floor(futureSeconds / 86400)} days`;
    return `in ${Math.floor(futureSeconds / 604800)} weeks`;
  }

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return `${Math.floor(seconds / 604800)} weeks ago`;
}
