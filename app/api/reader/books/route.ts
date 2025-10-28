import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Book from "@/app/models/Book";
import BorrowRequest from "@/app/models/BorrowRequest";

// GET all books with search (including borrowed ones)
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
    const User = (await import("@/app/models/User")).default;
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    let query: any = {};

    if (search) {
      query.$or = [
        { bookTitle: { $regex: search, $options: "i" } },
        { authors: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    // Check which books are borrowed by current user
    const borrowedBookIds = await BorrowRequest.find({
      user: currentUser._id,
      status: { $in: ["pending", "approved"] },
    }).distinct("book");

    // Add borrowedByCurrentUser flag to each book
    const booksWithBorrowStatus = books.map((book) => {
      const bookObj = book.toObject();
      const bookId = book._id as mongoose.Types.ObjectId;
      return {
        ...bookObj,
        borrowedByCurrentUser: borrowedBookIds.some(
          (id) => id.toString() === bookId.toString()
        ),
      };
    });

    return NextResponse.json({
      success: true,
      data: booksWithBorrowStatus,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// POST - Create borrow request
export async function POST(req: NextRequest) {
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
    const { bookId } = body;

    if (!bookId) {
      return NextResponse.json(
        { success: false, message: "Book ID is required" },
        { status: 400 }
      );
    }

    // Get user by email
    const User = (await import("@/app/models/User")).default;
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    if (book.status !== "available") {
      return NextResponse.json(
        { success: false, message: "Book is not available" },
        { status: 400 }
      );
    }

    // Check if user already has a pending or approved request for this book
    const existingRequest = await BorrowRequest.findOne({
      user: user._id,
      book: bookId,
      status: { $in: ["pending", "approved"] },
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have a request for this book",
        },
        { status: 400 }
      );
    }

    // Create borrow request
    const borrowRequest = await BorrowRequest.create({
      user: user._id,
      book: bookId,
      status: "pending",
      requestDate: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Borrow request submitted successfully",
      data: borrowRequest,
    });
  } catch (error) {
    console.error("Error creating borrow request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create borrow request" },
      { status: 500 }
    );
  }
}
