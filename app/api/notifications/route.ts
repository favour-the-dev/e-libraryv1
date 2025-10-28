import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import BorrowRequest from "@/app/models/BorrowRequest";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const now = new Date();
    const notifications: Array<{
      id: string;
      type: "borrow" | "overdue" | "due_soon";
      message: string;
      time: string;
      read: boolean;
      priority: "high" | "medium" | "low";
    }> = [];

    // Get pending borrow requests (new borrows)
    const pendingRequests = await BorrowRequest.find({ status: "pending" })
      .populate("user", "name")
      .populate("book", "bookTitle")
      .sort({ requestDate: -1 })
      .limit(10);

    pendingRequests.forEach((request: any) => {
      notifications.push({
        id: request._id.toString(),
        type: "borrow",
        message: `${request.user.name} requested to borrow "${request.book.bookTitle}"`,
        time: getTimeAgo(request.requestDate),
        read: false,
        priority: "medium",
      });
    });

    // Get overdue books
    const overdueRequests = await BorrowRequest.find({
      status: "approved",
      dueDate: { $lt: now },
    })
      .populate("user", "name")
      .populate("book", "bookTitle")
      .sort({ dueDate: 1 });

    overdueRequests.forEach((request: any) => {
      const daysOverdue = Math.floor(
        (now.getTime() - new Date(request.dueDate!).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      notifications.push({
        id: request._id.toString(),
        type: "overdue",
        message: `${request.user.name} is ${daysOverdue} day${
          daysOverdue > 1 ? "s" : ""
        } overdue returning "${request.book.bookTitle}"`,
        time: getTimeAgo(request.dueDate!),
        read: false,
        priority: "high",
      });
    });

    // Get books due soon (within 3 days)
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const dueSoonRequests = await BorrowRequest.find({
      status: "approved",
      dueDate: { $gte: now, $lte: threeDaysFromNow },
    })
      .populate("user", "name")
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
        message: `"${request.book.bookTitle}" borrowed by ${
          request.user.name
        } is due in ${daysUntilDue} day${daysUntilDue > 1 ? "s" : ""}`,
        time: getTimeAgo(request.dueDate!),
        read: false,
        priority: "low",
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
          pending: pendingRequests.length,
          overdue: overdueRequests.length,
          dueSoon: dueSoonRequests.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
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
    return `in ${Math.floor(futureSeconds / 86400)} days`;
  }

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return `${Math.floor(seconds / 604800)} weeks ago`;
}
