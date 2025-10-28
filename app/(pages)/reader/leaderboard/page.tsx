"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp, Award, Loader2, Crown } from "lucide-react";
import { useSession } from "next-auth/react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  email: string;
  points: number;
  totalBorrows: number;
  onTimeReturns: number;
  lateReturns: number;
}

function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] =
    useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/reader/leaderboard");
      const data = await response.json();

      if (data.success) {
        setLeaderboard(data.data);

        // Find current user's rank
        if (session?.user?.email) {
          const userEntry = data.data.find(
            (entry: LeaderboardEntry) => entry.email === session.user?.email
          );
          setCurrentUserRank(userEntry || null);
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto p-6 space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Top readers ranked by points. Earn +100 points for on-time returns,
            lose -10 points per day late.
          </p>
        </motion.div>

        {/* Current User Rank Card */}
        {!isLoading && currentUserRank && (
          <motion.div
            // variants={itemVariants}
            className="bg-gradient-to-r from-deepSkyBlue to-blue-600 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Your Rank</p>
                <h2 className="text-4xl font-bold">#{currentUserRank.rank}</h2>
              </div>
              <div className="text-right">
                <p className="text-blue-100 mb-1">Your Points</p>
                <div className="flex items-center gap-2">
                  <Award className="w-8 h-8" />
                  <h2 className="text-4xl font-bold">
                    {currentUserRank.points}
                  </h2>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-400">
              <div>
                <p className="text-blue-100 text-sm">Total Borrows</p>
                <p className="text-xl font-semibold">
                  {currentUserRank.totalBorrows}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">On-Time Returns</p>
                <p className="text-xl font-semibold">
                  {currentUserRank.onTimeReturns}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Late Returns</p>
                <p className="text-xl font-semibold">
                  {currentUserRank.lateReturns}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        {!isLoading && leaderboard.length >= 3 && (
          <motion.div
            // variants={itemVariants}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white font-bold text-2xl mb-3">
                  {leaderboard[1].name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-corbeau rounded-full p-1">
                  <Medal className="w-6 h-6 text-gray-400" />
                </div>
              </div>
              <h3 className="font-bold text-center line-clamp-1">
                {leaderboard[1].name}
              </h3>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">{leaderboard[1].points}</span>
              </div>
              <div className="w-full bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-lg mt-4 h-24 flex items-center justify-center text-white font-bold text-3xl">
                2
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-3xl mb-3 shadow-lg">
                  {leaderboard[0].name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-corbeau rounded-full p-1">
                  <Crown className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <h3 className="font-bold text-lg text-center line-clamp-1">
                {leaderboard[0].name}
              </h3>
              <div className="flex items-center gap-1 text-yellow-600">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold text-lg">
                  {leaderboard[0].points}
                </span>
              </div>
              <div className="w-full bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t-lg mt-4 h-32 flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                1
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-12">
              <div className="relative">
                <div className="w-18 h-18 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl mb-3">
                  {leaderboard[2].name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-corbeau rounded-full p-1">
                  <Medal className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="font-bold text-center line-clamp-1">
                {leaderboard[2].name}
              </h3>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">{leaderboard[2].points}</span>
              </div>
              <div className="w-full bg-gradient-to-t from-orange-400 to-orange-600 rounded-t-lg mt-4 h-20 flex items-center justify-center text-white font-bold text-2xl">
                3
              </div>
            </div>
          </motion.div>
        )}

        {/* Full Leaderboard */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-deepSkyBlue animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          <motion.div
            // variants={itemVariants}
            className="text-center py-20 bg-white dark:bg-corbeau rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No rankings yet
            </p>
          </motion.div>
        ) : (
          <motion.div
            // variants={itemVariants}
            className="bg-white dark:bg-corbeau rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-4">Reader</div>
              <div className="col-span-2 text-center">Points</div>
              <div className="col-span-2 text-center hidden sm:block">
                Borrows
              </div>
              <div className="col-span-2 text-center hidden md:block">
                On-Time
              </div>
              <div className="col-span-1 text-center hidden lg:block">Late</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.email}
                  variants={itemVariants}
                  className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    entry.email === session?.user?.email
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-deepSkyBlue"
                      : ""
                  }`}
                >
                  <div className="col-span-1 flex items-center justify-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankBadgeColor(
                        entry.rank
                      )}`}
                    >
                      {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                    </div>
                  </div>

                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-deepSkyBlue/20 text-deepSkyBlue font-bold flex items-center justify-center flex-shrink-0">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{entry.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {entry.email}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-deepSkyBlue" />
                      <span className="font-bold text-lg">{entry.points}</span>
                    </div>
                  </div>

                  <div className="col-span-2 hidden sm:flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      {entry.totalBorrows}
                    </span>
                  </div>

                  <div className="col-span-2 hidden md:flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {entry.onTimeReturns}
                    </span>
                  </div>

                  <div className="col-span-1 hidden lg:flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      {entry.lateReturns}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default LeaderboardPage;
