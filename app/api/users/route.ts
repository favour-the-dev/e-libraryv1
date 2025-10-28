import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/app/models/User";
import BorrowRequest from "@/app/models/BorrowRequest";
import { getServerSession } from "next-auth";

// GET all users
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
    const search = searchParams.get("search");

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    // Get borrow counts for each user
    const usersWithBorrowCount = await Promise.all(
      users.map(async (user) => {
        const activeBorrows = await BorrowRequest.countDocuments({
          user: user._id,
          status: "approved",
        });

        const totalBorrows = await BorrowRequest.countDocuments({
          user: user._id,
          status: { $in: ["approved", "returned"] },
        });

        return {
          ...user.toObject(),
          activeBorrows,
          totalBorrows,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: usersWithBorrowCount,
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

// PUT update user
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
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Don't allow password updates through this route
    delete updateData.password;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
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

// DELETE user
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
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Check if user has active borrows
    const activeBorrows = await BorrowRequest.countDocuments({
      user: id,
      status: "approved",
    });

    if (activeBorrows > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete user with active borrow requests",
        },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Delete all user's borrow request history
    await BorrowRequest.deleteMany({ user: id });

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
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
