"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  User,
  Calendar,
  X,
  CheckCircle,
  Loader2,
  Filter,
} from "lucide-react";

interface Book {
  _id: string;
  isbn: number;
  cover: string;
  bookTitle: string;
  authors: string;
  category: string;
  publishedDate: string;
  status: string;
  borrowedByCurrentUser?: boolean;
}

function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = Array.from(
      new Set(books.map((book) => book.category))
    ).sort();
    setCategories(["All", ...uniqueCategories]);
  }, [books]);

  useEffect(() => {
    let filtered = books;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.bookTitle.toLowerCase().includes(query) ||
          book.authors.toLowerCase().includes(query) ||
          book.category.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(filtered);
  }, [searchQuery, selectedCategory, books]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/reader/books");
      const data = await response.json();

      if (data.success) {
        setBooks(data.data);
        setFilteredBooks(data.data);
      } else {
        console.error("Failed to fetch books:", data.message);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("All Books", books);
  }, [books]);

  const handleBorrowClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleConfirmBorrow = async () => {
    if (!selectedBook) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/reader/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: selectedBook._id }),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedBook(null);
        setShowSuccessModal(true);
        fetchBooks(); // Refresh the list
        setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
        alert(data.message || "Failed to create borrow request");
      }
    } catch (error) {
      console.error("Error creating borrow request:", error);
      alert("Failed to create borrow request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBorrowDate = () => new Date().toLocaleDateString();
  const getReturnDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toLocaleDateString();
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
          <h1 className="text-3xl font-bold mb-2">All Books</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and borrow from our collection of {books.length} books
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepSkyBlue"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter by:</span>
            </div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-deepSkyBlue text-white"
                    : "bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredBooks.length} of {books.length} books
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </div>
        </motion.div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-deepSkyBlue animate-spin" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <motion.div
            variants={itemVariants}
            //  className="text-center py-20 bg-white dark:bg-corbeau rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No books found
            </p>
          </motion.div>
        ) : (
          <motion.div
            // y
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredBooks.map((book) => (
              <motion.div
                key={book._id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="w-full h-[150px] bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center">
                  {/* <img
                    src={book.cover}
                    alt={book.bookTitle}
                    className="w-full h-full object-cover"
                  /> */}
                  <BookOpen className="w-16 h-16 text-gray-400" />
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-lg line-clamp-2">
                    {book.bookTitle}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="line-clamp-1">{book.authors}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{book.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{book.publishedDate}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {book.status === "borrowed" && (
                    <div className="flex items-center gap-2 py-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">
                        Currently Borrowed
                      </span>
                    </div>
                  )}

                  {book.borrowedByCurrentUser && (
                    <div className="flex items-center gap-2 py-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        You borrowed this book
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleBorrowClick(book)}
                    disabled={
                      book.status === "borrowed" || book.borrowedByCurrentUser
                    }
                    className={`w-full font-semibold py-2 rounded-lg transition-colors ${
                      book.status === "borrowed" || book.borrowedByCurrentUser
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-deepSkyBlue hover:bg-blue-600 text-white"
                    }`}
                  >
                    {book.borrowedByCurrentUser
                      ? "Already Requested"
                      : book.status === "borrowed"
                      ? "Not Available"
                      : "Borrow Book"}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Borrow Confirmation Modal */}
      <AnimatePresence>
        {selectedBook && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => !isSubmitting && setSelectedBook(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-corbeau rounded-xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">Confirm Borrow</h3>
                <button
                  onClick={() => !isSubmitting && setSelectedBook(null)}
                  disabled={isSubmitting}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  {/* <img
                    src={selectedBook.cover}
                    alt={selectedBook.bookTitle}
                    className="w-20 h-28 object-cover rounded-lg"
                  /> */}
                  <div className="w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-bold line-clamp-2">
                      {selectedBook.bookTitle}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedBook.authors}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Borrow Date:
                    </span>
                    <span className="font-semibold">{getBorrowDate()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Expected Return:
                    </span>
                    <span className="font-semibold">{getReturnDate()}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please return the book on or before the expected return date
                  to avoid late fees (₦100 per day).
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedBook(null)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBorrow}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-deepSkyBlue hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Confirm Borrow"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold">
              Borrow request submitted successfully!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AllBooksPage;
