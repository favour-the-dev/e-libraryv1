"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  History,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  BookOpen,
} from "lucide-react";

interface ReturnedBook {
  _id: string;
  book: {
    cover: string;
    bookTitle: string;
    authors: string;
    category: string;
  };
  approvedDate: string;
  dueDate: string;
  returnedDate: string;
  daysLate: number;
  lateFee: number;
}

function ReturnHistoryPage() {
  const [returnHistory, setReturnHistory] = useState<ReturnedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReturns: 0,
    onTimeReturns: 0,
    lateReturns: 0,
    totalLateFees: 0,
  });

  useEffect(() => {
    fetchReturnHistory();
  }, []);

  const fetchReturnHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/reader/history");
      const data = await response.json();

      if (data.success) {
        const history = data.data;
        setReturnHistory(history);

        // Calculate stats
        const totalReturns = history.length;
        const onTimeReturns = history.filter(
          (item: ReturnedBook) => item.daysLate === 0
        ).length;
        const lateReturns = totalReturns - onTimeReturns;
        const totalLateFees = history.reduce(
          (sum: number, item: ReturnedBook) => sum + (item.lateFee || 0),
          0
        );

        setStats({
          totalReturns,
          onTimeReturns,
          lateReturns,
          totalLateFees,
        });
      }
    } catch (error) {
      console.error("Error fetching return history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
          <h1 className="text-3xl font-bold mb-2">Return History</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your reading history and statistics
          </p>
        </motion.div>

        {/* Stats Cards */}
        {!isLoading && returnHistory.length > 0 && (
          <motion.div
            // variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Returns
                  </p>
                  <p className="text-2xl font-bold">{stats.totalReturns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    On-Time Returns
                  </p>
                  <p className="text-2xl font-bold">{stats.onTimeReturns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Late Returns
                  </p>
                  <p className="text-2xl font-bold">{stats.lateReturns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Late Fees
                  </p>
                  <p className="text-2xl font-bold">₦{stats.totalLateFees}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* History List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-deepSkyBlue animate-spin" />
          </div>
        ) : returnHistory.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-20 bg-white dark:bg-corbeau rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <History className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No return history yet
            </p>
            <a
              href="/reader/all-books"
              className="inline-block mt-4 text-deepSkyBlue hover:underline"
            >
              Start borrowing books
            </a>
          </motion.div>
        ) : (
          <motion.div
            //   variants={itemVariants}
            className="space-y-4"
          >
            {returnHistory.map((item) => {
              const isOnTime = item.daysLate === 0;

              return (
                <motion.div
                  key={item._id}
                  whileHover={{ x: 5 }}
                  className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* <img
                      src={item.book.cover}
                      alt={item.book.bookTitle}
                      className="w-32 h-44 object-cover rounded-lg flex-shrink-0"
                    /> */}
                    <div className="w-32 h-44 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-1">
                            {item.book.bookTitle}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            by {item.book.authors}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.book.category}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                            isOnTime
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {isOnTime ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          <span className="text-sm font-semibold">
                            {isOnTime ? "On Time" : "Late"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span>Borrowed</span>
                          </div>
                          <p className="font-semibold">
                            {new Date(item.approvedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due Date</span>
                          </div>
                          <p className="font-semibold">
                            {new Date(item.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span>Returned</span>
                          </div>
                          <p className="font-semibold">
                            {new Date(item.returnedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {!isOnTime && (
                        <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <div className="text-sm">
                              <span className="font-semibold text-red-600 dark:text-red-400">
                                Returned {item.daysLate} day
                                {item.daysLate !== 1 ? "s" : ""} late
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-red-600 dark:text-red-400">
                              Late Fee
                            </p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">
                              ₦{item.lateFee}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default ReturnHistoryPage;
