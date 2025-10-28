import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import BorrowRequest from "@/app/models/BorrowRequest";
import User from "@/app/models/User";

// GET return history for current user
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

    // Get all returned books
    const returnHistory = await BorrowRequest.find({
      user: user._id,
      status: "returned",
    })
      .populate("book")
      .sort({ returnedDate: -1 });

    return NextResponse.json({
      success: true,
      data: returnHistory,
    });
  } catch (error) {
    console.error("Error fetching return history:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch return history" },
      { status: 500 }
    );
  }
}
