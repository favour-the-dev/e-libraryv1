"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Barcode,
  BookOpen,
  Calendar,
  User,
  Tag,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { DisplayBook } from "@/types/types";
import { searchBookByISBN } from "@/app/services/searchService";
import Image from "next/image";

function BooksInventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<DisplayBook | null>(null);
  const [activeTab, setActiveTab] = useState<"isbn" | "barcode">("isbn");
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<DisplayBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    cover: "",
    coverId: 1234678,
    bookTitle: "",
    authors: "",
    category: "",
    status: "available" as "available" | "borrowed",
    publishedDate: "",
    isbn: "",
  });

  const [isSearchingISBN, setIsSearchingISBN] = useState(false);
  const [isbnError, setIsbnError] = useState("");

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/books");
      const data = await response.json();

      if (data.success) {
        const formattedBooks = data.data.map((book: any) => ({
          id: book._id,
          isbn: book.isbn,
          cover: book.cover,
          coverId: book.coverId,
          bookTitle: book.bookTitle,
          authors: book.authors,
          category: book.category,
          status: book.status,
          publishedDate: book.publishedDate,
        }));
        setBooks(formattedBooks);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "isbn") {
      setIsbnError("");
    }
  };

  const handleSearchByISBN = async () => {
    if (!formData.isbn) {
      setIsbnError("Please enter an ISBN number");
      return;
    }

    setIsSearchingISBN(true);
    setIsbnError("");

    try {
      const isbnNumber = parseInt(formData.isbn.replace(/[-\s]/g, ""), 10);
      if (isNaN(isbnNumber)) {
        setIsbnError("Please enter a valid ISBN number");
        setIsSearchingISBN(false);
        return;
      }

      const result = await searchBookByISBN(isbnNumber);

      if (result) {
        const isbnKey = Object.keys(result)[0];
        const bookData = result[isbnKey];

        if (bookData) {
          const authorsString =
            bookData.authors
              ?.slice(0, 2)
              .map((author) => author.name)
              .join(", ") || "";

          const category = bookData.subjects?.[0]?.name || "";

          const coverImage =
            bookData.cover?.large ||
            bookData.cover?.medium ||
            bookData.cover?.small ||
            "";

          setFormData({
            ...formData,
            bookTitle: bookData.title || "",
            authors: authorsString,
            category: category,
            cover: coverImage,
            publishedDate: bookData.publish_date
              ? new Date(bookData.publish_date).toISOString().split("T")[0]
              : "",
          });

          setIsbnError("");
        } else {
          setIsbnError("No book found with this ISBN");
        }
      } else {
        setIsbnError(
          "No book found with this ISBN. Please try again or enter details manually."
        );
      }
    } catch (error) {
      console.error("Error searching ISBN:", error);
      setIsbnError(
        "Failed to search for book. Please try again or enter details manually."
      );
    } finally {
      setIsSearchingISBN(false);
    }
  };

  const handleAddBook = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isbn: parseInt(formData.isbn.replace(/[-\s]/g, ""), 10) || 0,
          cover: formData.cover || "/assets/book-placeholder.jpg",
          coverId: formData.coverId,
          bookTitle: formData.bookTitle,
          authors: formData.authors,
          category: formData.category,
          status: formData.status,
          publishedDate: formData.publishedDate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBooks(); // Refresh the list
        setIsAddModalOpen(false);
        resetForm();
      } else {
        setIsbnError(data.error || "Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      setIsbnError("Failed to add book. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditBook = async () => {
    if (!selectedBook) return;

    try {
      setIsSaving(true);
      const response = await fetch("/api/books", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedBook.id,
          isbn:
            parseInt(formData.isbn.replace(/[-\s]/g, ""), 10) ||
            selectedBook.isbn,
          cover: formData.cover || selectedBook.cover,
          coverId: formData.coverId,
          bookTitle: formData.bookTitle,
          authors: formData.authors,
          category: formData.category,
          status: formData.status,
          publishedDate: formData.publishedDate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBooks(); // Refresh the list
        setIsEditModalOpen(false);
        setSelectedBook(null);
        resetForm();
      } else {
        setIsbnError(data.error || "Failed to update book");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      setIsbnError("Failed to update book. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/books?id=${selectedBook.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        await fetchBooks(); // Refresh the list
        setIsDeleteModalOpen(false);
        setSelectedBook(null);
      } else {
        alert(data.error || "Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (book: DisplayBook) => {
    setSelectedBook(book);
    setFormData({
      cover: book.cover,
      coverId: book.coverId ?? 12345678,
      bookTitle: book.bookTitle,
      authors: book.authors,
      category: book.category,
      status: book.status,
      publishedDate: book.publishedDate,
      isbn: book.isbn.toString(),
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (book: DisplayBook) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      cover: "",
      coverId: 12345678,
      bookTitle: "",
      authors: "",
      category: "",
      status: "available",
      publishedDate: "",
      isbn: "",
    });
    setActiveTab("isbn");
    setIsbnError("");
    setIsSearchingISBN(false);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Books Inventory</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your library's book collection. Add, edit, or remove books
              from your catalogue.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-deepSkyBlue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Book
          </button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full placeholder:text-gray-500"
            />
          </div>
        </motion.div>

        {/* Books Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Cover
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Author(s)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBooks.map((book, index) => (
                  <motion.tr
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {/* {book.cover && !book.cover.startsWith("/assets") ? (
                        <Image
                          alt={book.bookTitle}
                          src={book.cover}
                          width={100}
                          height={50}
                          className="w-12 h-16 object-cover rounded"
                          //   unoptimized
                        />
                      ) : (
                        <div className="w-12 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-gray-400" />
                        </div>
                      )} */}
                      <div className="w-12 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-gray-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{book.bookTitle}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                        {book.isbn || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 dark:text-gray-400 truncate">
                        {book.authors}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-deepSkyBlue/10 text-deepSkyBlue rounded-full text-sm whitespace-nowrap">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium ${
                          book.status === "available"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        <span
                          className={`${
                            book.status === "available"
                              ? "bg-green-500 dark:bg-green-300"
                              : "bg-yellow-500 dark:bg-yellow-300"
                          } w-2 h-2 rounded-full`}
                        />
                        {book.status.charAt(0).toUpperCase() +
                          book.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(book.publishedDate).getFullYear()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(book)}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(book)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-deepSkyBlue mx-auto mb-4 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400">
                Loading books...
              </p>
            </div>
          )}

          {!isLoading && filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {books.length === 0
                  ? "No books in your inventory yet. Click 'Add Book' to get started."
                  : "No books found matching your search."}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Book Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setIsAddModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-corbeau rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="sticky z-10 top-0 bg-white dark:bg-corbeau border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Add New Book</h2>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 mt-2">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveTab("isbn")}
                      className={`pb-4 px-4 font-medium transition-colors relative ${
                        activeTab === "isbn"
                          ? "text-deepSkyBlue"
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Search by ISBN
                      </div>
                      {activeTab === "isbn" && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-deepSkyBlue"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("barcode")}
                      className={`pb-4 px-4 font-medium transition-colors relative ${
                        activeTab === "barcode"
                          ? "text-deepSkyBlue"
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Barcode className="w-4 h-4" />
                        Scan Barcode
                      </div>
                      {activeTab === "barcode" && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-deepSkyBlue"
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* ISBN/Barcode Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {activeTab === "isbn" ? "ISBN Number" : "Barcode"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleInputChange}
                        placeholder={
                          activeTab === "isbn"
                            ? "Enter ISBN number (e.g., 9780140328721)"
                            : "Scan or enter barcode"
                        }
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                        disabled={isSearchingISBN}
                      />
                      <button
                        onClick={
                          activeTab === "isbn" ? handleSearchByISBN : undefined
                        }
                        disabled={isSearchingISBN}
                        className="px-6 py-2 bg-deepSkyBlue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSearchingISBN ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Searching...
                          </>
                        ) : activeTab === "isbn" ? (
                          "Search"
                        ) : (
                          "Scan"
                        )}
                      </button>
                    </div>
                    {isbnError && (
                      <p className="text-red-500 text-sm mt-2">{isbnError}</p>
                    )}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {isbnError
                        ? "Enter book details manually:"
                        : "Or enter book details manually:"}
                    </p>

                    {/* Cover URL */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Cover Image URL
                        </div>
                      </label>
                      <input
                        type="text"
                        name="cover"
                        value={formData.cover}
                        onChange={handleInputChange}
                        placeholder="https://example.com/cover.jpg"
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                      />
                    </div>

                    {/* Book Title */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Book Title *
                        </div>
                      </label>
                      <input
                        type="text"
                        name="bookTitle"
                        value={formData.bookTitle}
                        onChange={handleInputChange}
                        placeholder="Enter book title"
                        required
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                      />
                    </div>

                    {/* Author(s) */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Author(s) *
                        </div>
                      </label>
                      <input
                        type="text"
                        name="authors"
                        value={formData.authors}
                        onChange={handleInputChange}
                        placeholder="Enter author name(s)"
                        required
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                      />
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Category *
                        </div>
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g., Fiction, Science, History"
                        required
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                      />
                    </div>

                    {/* Status */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Status *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                      >
                        <option value="available">Available</option>
                        <option value="borrowed">Borrowed</option>
                      </select>
                    </div>

                    {/* Published Date */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Published Date *
                        </div>
                      </label>
                      <input
                        type="date"
                        name="publishedDate"
                        value={formData.publishedDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-corbeau border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3 justify-end">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={isSaving}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBook}
                    disabled={isSaving}
                    className="px-6 py-2 bg-deepSkyBlue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSaving ? "Adding..." : "Add Book"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Book Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedBook && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setIsEditModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-corbeau rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white dark:bg-corbeau border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Edit Book</h2>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  {/* Cover URL */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Cover Image URL
                      </div>
                    </label>
                    <input
                      type="text"
                      name="cover"
                      value={formData.cover}
                      onChange={handleInputChange}
                      placeholder="https://example.com/cover.jpg"
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                    />
                  </div>

                  {/* Book Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Book Title *
                      </div>
                    </label>
                    <input
                      type="text"
                      name="bookTitle"
                      value={formData.bookTitle}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                    />
                  </div>

                  {/* Author(s) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Author(s) *
                      </div>
                    </label>
                    <input
                      type="text"
                      name="authors"
                      value={formData.authors}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Category *
                      </div>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                    >
                      <option value="available">Available</option>
                      <option value="borrowed">Borrowed</option>
                    </select>
                  </div>

                  {/* Published Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Published Date *
                      </div>
                    </label>
                    <input
                      type="date"
                      name="publishedDate"
                      value={formData.publishedDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-corbeau border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3 justify-end">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    disabled={isSaving}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditBook}
                    disabled={isSaving}
                    className="px-6 py-2 bg-deepSkyBlue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedBook && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-corbeau rounded-xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Delete Book</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to delete "
                    <span className="font-semibold">
                      {selectedBook.bookTitle}
                    </span>
                    "? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      disabled={isSaving}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteBook}
                      disabled={isSaving}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isSaving ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BooksInventoryPage;
