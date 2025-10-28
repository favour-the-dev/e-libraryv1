"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookMarked,
  Calendar,
  AlertCircle,
  X,
  Loader2,
  CheckCircle,
  Clock,
  BookOpen,
} from "lucide-react";

interface BorrowedBook {
  _id: string;
  book: {
    _id: string;
    cover: string;
    bookTitle: string;
    authors: string;
    category: string;
  };
  approvedDate: string;
  dueDate: string;
  status: string;
}

interface ReturnResult {
  daysLate: number;
  lateFee: number;
  isOnTime: boolean;
}

function BorrowedBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<BorrowedBook | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [returnResult, setReturnResult] = useState<ReturnResult | null>(null);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/reader/borrowed");
      const data = await response.json();

      if (data.success) {
        setBorrowedBooks(data.data);
      }
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnClick = (book: BorrowedBook) => {
    setSelectedBook(book);
    setReturnResult(null);
  };

  const handleConfirmReturn = async () => {
    if (!selectedBook) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/reader/borrowed", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: selectedBook._id }),
      });

      const data = await response.json();

      if (data.success) {
        setReturnResult(data.data);
        fetchBorrowedBooks();
      } else {
        alert(data.message || "Failed to return book");
      }
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Failed to return book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setReturnResult(null);
  };

  const isOverdue = (dueDate: string) => {
    return new Date() > new Date(dueDate);
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculatePotentialLateFee = (dueDate: string) => {
    const daysLate = Math.abs(getDaysRemaining(dueDate));
    return isOverdue(dueDate) ? daysLate * 100 : 0;
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
          <h1 className="text-3xl font-bold mb-2">My Borrowed Books</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your currently borrowed books
          </p>
        </motion.div>

        {/* Books List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-deepSkyBlue animate-spin" />
          </div>
        ) : borrowedBooks.length === 0 ? (
          <motion.div
            // variants={itemVariants}
            className="text-center py-20 bg-white dark:bg-corbeau rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <BookMarked className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              You haven't borrowed any books yet
            </p>
            <a
              href="/reader/all-books"
              className="inline-block mt-4 text-deepSkyBlue hover:underline"
            >
              Browse available books
            </a>
          </motion.div>
        ) : (
          <motion.div className="space-y-4">
            {borrowedBooks.map((item) => {
              const overdue = isOverdue(item.dueDate);
              const daysRemaining = getDaysRemaining(item.dueDate);

              return (
                <motion.div
                  key={item._id}
                  whileHover={{ x: 5 }}
                  className={`bg-white dark:bg-corbeau border rounded-xl p-6 ${
                    overdue
                      ? "border-red-300 dark:border-red-800"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Borrowed:
                          </span>
                          <span className="font-semibold">
                            {new Date(item.approvedDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-2 text-sm ${
                            overdue ? "text-red-600 dark:text-red-400" : ""
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Due Date:
                          </span>
                          <span className="font-semibold">
                            {new Date(item.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {overdue ? (
                        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-semibold text-red-600 dark:text-red-400">
                              Overdue by {Math.abs(daysRemaining)} day
                              {Math.abs(daysRemaining) !== 1 ? "s" : ""}
                            </p>
                            <p className="text-red-600 dark:text-red-400">
                              Late fee: ₦
                              {calculatePotentialLateFee(item.dueDate)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}{" "}
                            remaining
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => handleReturnClick(item)}
                        className="w-full sm:w-auto px-6 py-2 bg-deepSkyBlue hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Return Confirmation Modal */}
      <AnimatePresence>
        {selectedBook && !returnResult && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => !isSubmitting && handleCloseModal()}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-corbeau rounded-xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">Confirm Return</h3>
                <button
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  {/* <img
                    src={selectedBook.book.cover}
                    alt={selectedBook.book.bookTitle}
                    className="w-20 h-28 object-cover rounded-lg"
                  /> */}
                  <div className="w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-bold line-clamp-2">
                      {selectedBook.book.bookTitle}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedBook.book.authors}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Return Date:
                    </span>
                    <span className="font-semibold">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span
                      className={`font-semibold ${
                        isOverdue(selectedBook.dueDate)
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {isOverdue(selectedBook.dueDate) ? "Late" : "On Time"}
                    </span>
                  </div>
                  {isOverdue(selectedBook.dueDate) && (
                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Late Fee:
                      </span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        ₦{calculatePotentialLateFee(selectedBook.dueDate)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReturn}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-deepSkyBlue hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Return"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Return Success Modal */}
        {returnResult && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-corbeau rounded-xl shadow-2xl z-50 p-6"
            >
              <div className="text-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                    returnResult.isOnTime
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  <CheckCircle
                    className={`w-10 h-10 ${
                      returnResult.isOnTime
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Book Returned Successfully!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {returnResult.isOnTime
                      ? "Thank you for returning on time!"
                      : "Book returned late"}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2 text-left">
                  {returnResult.daysLate > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Days Late:
                      </span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {returnResult.daysLate}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Late Fee:
                    </span>
                    <span
                      className={`font-semibold ${
                        returnResult.lateFee > 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      ₦{returnResult.lateFee}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Points:
                    </span>
                    <span
                      className={`font-semibold ${
                        returnResult.isOnTime
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {returnResult.isOnTime
                        ? "+100"
                        : returnResult.daysLate * -10}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="w-full px-4 py-2 bg-deepSkyBlue hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BorrowedBooksPage;
