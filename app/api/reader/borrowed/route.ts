import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import BorrowRequest from "@/app/models/BorrowRequest";
import Book from "@/app/models/Book";
import User from "@/app/models/User";

// GET borrowed books for current user
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

    // Get user by email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get all approved (borrowed) books
    const borrowedBooks = await BorrowRequest.find({
      user: user._id,
      status: "approved",
    })
      .populate("book")
      .sort({ approvedDate: -1 });

    return NextResponse.json({
      success: true,
      data: borrowedBooks,
    });
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch borrowed books" },
      { status: 500 }
    );
  }
}

// PUT - Return a book
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        { success: false, message: "Request ID is required" },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get borrow request
    const borrowRequest = await BorrowRequest.findById(requestId);

    if (!borrowRequest) {
      return NextResponse.json(
        { success: false, message: "Borrow request not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (borrowRequest.user.toString() !== (user._id as any).toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Calculate late fee and days late
    const actualReturnDate = new Date(); // Keep actual timestamp for returnedDate
    const returnDateForComparison = new Date();
    returnDateForComparison.setHours(0, 0, 0, 0); // For comparison only

    const dueDate = new Date(borrowRequest.dueDate!);
    const dueDateEndOfDay = new Date(borrowRequest.dueDate!);
    dueDateEndOfDay.setHours(23, 59, 59, 999);

    let daysLate = 0;
    let lateFee = 0;

    // Compare: if return date (start of day) is after due date (end of day), it's late
    if (returnDateForComparison > dueDateEndOfDay) {
      const dueDateStartOfDay = new Date(borrowRequest.dueDate!);
      dueDateStartOfDay.setHours(0, 0, 0, 0);

      const diffTime =
        returnDateForComparison.getTime() - dueDateStartOfDay.getTime();
      daysLate = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      lateFee = daysLate * 100; // ₦100 per day
    }

    // Update user points
    let pointsChange = 0;
    if (daysLate === 0) {
      pointsChange = 100; // +100 for on-time return
    } else {
      pointsChange = -10 * daysLate; // -10 per day late
    }

    // Ensure the user has a points field, then increment
    const userToUpdate = await User.findById(user._id);
    if (userToUpdate) {
      if (typeof userToUpdate.points !== "number") {
        userToUpdate.points = 0;
      }
      userToUpdate.points += pointsChange;
      await userToUpdate.save();
    }

    // Update borrow request with actual return timestamp
    borrowRequest.status = "returned";
    borrowRequest.returnedDate = actualReturnDate; // Store actual timestamp
    borrowRequest.daysLate = daysLate;
    borrowRequest.lateFee = lateFee;
    await borrowRequest.save();

    // Update book status to available
    await Book.findByIdAndUpdate(borrowRequest.book, {
      status: "available",
      $unset: { borrowedBy: "" },
    });

    return NextResponse.json({
      success: true,
      message: "Book returned successfully",
      data: {
        daysLate,
        lateFee,
        pointsChange,
        isOnTime: daysLate === 0,
      },
    });
  } catch (error) {
    console.error("Error returning book:", error);
    return NextResponse.json(
      { success: false, message: "Failed to return book" },
      { status: 500 }
    );
  }
}
