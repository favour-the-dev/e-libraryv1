import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Book from "@/app/models/Book";
import { getServerSession } from "next-auth";

// GET all books
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let query = {};
    if (search) {
      query = {
        $or: [
          { bookTitle: { $regex: search, $options: "i" } },
          { authors: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: books,
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

// POST create new book
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
    const {
      isbn,
      cover,
      coverId,
      bookTitle,
      authors,
      category,
      status,
      publishedDate,
    } = body;

    // Validate required fields
    if (!isbn || !bookTitle || !authors || !category || !publishedDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide all required fields",
        },
        { status: 400 }
      );
    }

    // Check if book with ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return NextResponse.json(
        {
          success: false,
          error: "Book with this ISBN already exists",
        },
        { status: 400 }
      );
    }

    const book = await Book.create({
      isbn,
      cover: cover || "/assets/book-placeholder.jpg",
      coverId,
      bookTitle,
      authors,
      category,
      status: status || "available",
      publishedDate,
    });

    return NextResponse.json(
      {
        success: true,
        data: book,
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

// PUT update book
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
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Book ID is required",
        },
        { status: 400 }
      );
    }

    const book = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return NextResponse.json(
        {
          success: false,
          error: "Book not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: book,
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

// DELETE book
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
          error: "Book ID is required",
        },
        { status: 400 }
      );
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return NextResponse.json(
        {
          success: false,
          error: "Book not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Book deleted successfully",
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
