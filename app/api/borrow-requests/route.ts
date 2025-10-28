import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BorrowRequest from "@/app/models/BorrowRequest";
import Book from "@/app/models/Book";
import { getServerSession } from "next-auth";

// GET all borrow requests
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = {};
    if (status) {
      query = { status };
    }

    const borrowRequests = await BorrowRequest.find(query)
      .populate("user", "name email")
      .populate("book", "bookTitle authors isbn cover")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: borrowRequests,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST create borrow request
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, bookId } = body;

    if (!userId || !bookId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID and Book ID are required",
        },
        { status: 400 }
      );
    }

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        {
          success: false,
          error: "Book not found",
        },
        { status: 404 }
      );
    }

    if (book.status === "borrowed") {
      return NextResponse.json(
        {
          success: false,
          error: "Book is already borrowed",
        },
        { status: 400 }
      );
    }

    const borrowRequest = await BorrowRequest.create({
      user: userId,
      book: bookId,
      status: "pending",
    });

    const populatedRequest = await BorrowRequest.findById(borrowRequest._id)
      .populate("user", "name email")
      .populate("book", "bookTitle authors isbn cover");

    return NextResponse.json(
      {
        success: true,
        data: populatedRequest,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT update borrow request (approve, reject, return)
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "Request ID and status are required",
        },
        { status: 400 }
      );
    }

    const borrowRequest = await BorrowRequest.findById(id);
    if (!borrowRequest) {
      return NextResponse.json(
        {
          success: false,
          error: "Borrow request not found",
        },
        { status: 404 }
      );
    }

    const updateData: any = { status };

    if (status === "approved") {
      updateData.approvedDate = new Date();
      // Set due date to 14 days from now at end of day (23:59:59)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      dueDate.setHours(23, 59, 59, 999);
      updateData.dueDate = dueDate;

      // Update book status
      await Book.findByIdAndUpdate(borrowRequest.book, {
        status: "borrowed",
        borrowedBy: borrowRequest.user,
        borrowedDate: new Date(),
        dueDate: dueDate,
      });
    } else if (status === "returned") {
      const actualReturnDate = new Date(); // Keep actual timestamp
      updateData.returnedDate = actualReturnDate;

      // Calculate late fee and days late
      const returnDateForComparison = new Date();
      returnDateForComparison.setHours(0, 0, 0, 0);

      const dueDate = new Date(borrowRequest.dueDate!);
      const dueDateEndOfDay = new Date(borrowRequest.dueDate!);
      dueDateEndOfDay.setHours(23, 59, 59, 999);

      let daysLate = 0;
      let lateFee = 0;

      if (returnDateForComparison > dueDateEndOfDay) {
        const dueDateStartOfDay = new Date(borrowRequest.dueDate!);
        dueDateStartOfDay.setHours(0, 0, 0, 0);

        const diffTime =
          returnDateForComparison.getTime() - dueDateStartOfDay.getTime();
        daysLate = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        lateFee = daysLate * 100;
      }

      updateData.daysLate = daysLate;
      updateData.lateFee = lateFee;

      // Update user points
      const User = (await import("@/app/models/User")).default;
      let pointsChange = 0;
      if (daysLate === 0) {
        pointsChange = 100; // +100 for on-time return
      } else {
        pointsChange = -10 * daysLate; // -10 per day late
      }

      // Ensure the user has a points field, then increment
      const userToUpdate = await User.findById(borrowRequest.user);
      if (userToUpdate) {
        if (typeof userToUpdate.points !== "number") {
          userToUpdate.points = 0;
        }
        userToUpdate.points += pointsChange;
        await userToUpdate.save();
      }

      // Update book status
      await Book.findByIdAndUpdate(borrowRequest.book, {
        status: "available",
        $unset: { borrowedBy: "", borrowedDate: "", dueDate: "" },
      });
    } else if (status === "rejected") {
      // Just update the status, book remains available
    }

    if (notes) {
      updateData.notes = notes;
    }

    const updatedRequest = await BorrowRequest.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "name email")
      .populate("book", "bookTitle authors isbn cover");

    return NextResponse.json(
      {
        success: true,
        data: updatedRequest,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE borrow request
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Request ID is required",
        },
        { status: 400 }
      );
    }

    const borrowRequest = await BorrowRequest.findByIdAndDelete(id);

    if (!borrowRequest) {
      return NextResponse.json(
        {
          success: false,
          error: "Borrow request not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Borrow request deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
