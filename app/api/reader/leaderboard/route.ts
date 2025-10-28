import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/app/models/User";
import BorrowRequest from "@/app/models/BorrowRequest";

// GET leaderboard
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

    // Get all users (non-admin) sorted by points (descending)
    const users = await User.find({ role: "user" })
      .select("name email points")
      .sort({ points: -1, name: 1 }); // Sort by points desc, then name asc

    // Get borrow statistics for each user
    const leaderboard = await Promise.all(
      users.map(async (user, index) => {
        // Count all returned books
        const totalBorrows = await BorrowRequest.countDocuments({
          user: user._id,
          status: "returned",
        });

        // Count on-time returns (daysLate = 0 or null/undefined)
        const onTimeReturns = await BorrowRequest.countDocuments({
          user: user._id,
          status: "returned",
          $or: [{ daysLate: 0 }, { daysLate: { $exists: false } }],
        });

        // Count late returns (daysLate > 0)
        const lateReturns = await BorrowRequest.countDocuments({
          user: user._id,
          status: "returned",
          daysLate: { $gt: 0 },
        });

        return {
          rank: index + 1,
          name: user.name,
          email: user.email,
          points: user.points || 0, // Ensure points is never undefined
          totalBorrows,
          onTimeReturns,
          lateReturns,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
