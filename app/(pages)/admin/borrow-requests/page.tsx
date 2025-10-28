"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Loader2,
  Calendar,
  User,
  BookOpen,
  X,
  AlertCircle,
} from "lucide-react";

interface BorrowRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  book: {
    _id: string;
    bookTitle: string;
    authors: string;
    isbn: number;
    cover: string;
  };
  status: "pending" | "approved" | "rejected" | "returned";
  requestDate: string;
  approvedDate?: string;
  dueDate?: string;
  returnedDate?: string;
  notes?: string;
}

type ConfirmModalType = "approve" | "reject" | "return" | null;

function BorrowRequestsPage() {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BorrowRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalType>(null);
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(
    null
  );

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchQuery, statusFilter]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/borrow-requests");
      const data = await response.json();

      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (req) =>
          req.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.book.bookTitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          req.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleApprove = async (id: string) => {
    try {
      setIsProcessing(true);
      const response = await fetch("/api/borrow-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchRequests();
        setConfirmModal(null);
        setSelectedRequest(null);
      } else {
        alert(data.error || "Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setIsProcessing(true);
      const response = await fetch("/api/borrow-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "rejected" }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchRequests();
        setConfirmModal(null);
        setSelectedRequest(null);
      } else {
        alert(data.error || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReturn = async (id: string) => {
    try {
      setIsProcessing(true);
      const response = await fetch("/api/borrow-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "returned" }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchRequests();
        setConfirmModal(null);
        setSelectedRequest(null);
      } else {
        alert(data.error || "Failed to mark as returned");
      }
    } catch (error) {
      console.error("Error marking as returned:", error);
      alert("Failed to mark as returned");
    } finally {
      setIsProcessing(false);
    }
  };

  const openConfirmModal = (type: ConfirmModalType, request: BorrowRequest) => {
    setConfirmModal(type);
    setSelectedRequest(request);
  };

  const closeConfirmModal = () => {
    if (!isProcessing) {
      setConfirmModal(null);
      setSelectedRequest(null);
    }
  };

  const confirmAction = () => {
    if (!selectedRequest) return;

    switch (confirmModal) {
      case "approve":
        handleApprove(selectedRequest._id);
        break;
      case "reject":
        handleReject(selectedRequest._id);
        break;
      case "return":
        handleReturn(selectedRequest._id);
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
      case "approved":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "returned":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-3xl font-bold mb-2">Borrow Requests</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage book borrowing requests, approvals, and returns.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by user name, email, or book title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full placeholder:text-gray-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-deepSkyBlue"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Requests Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
        >
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-deepSkyBlue mx-auto mb-4 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400">
                Loading requests...
              </p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {requests.length === 0
                  ? "No borrow requests yet."
                  : "No requests match your filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Request Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRequests.map((request, index) => (
                    <motion.tr
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{request.user.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {request.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">
                            {request.book.bookTitle}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {request.book.authors}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">
                          {formatDate(request.requestDate)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {request.dueDate && (
                          <p
                            className={`text-sm ${
                              isOverdue(request.dueDate)
                                ? "text-red-600 dark:text-red-400 font-semibold"
                                : ""
                            }`}
                          >
                            {formatDate(request.dueDate)}
                            {isOverdue(request.dueDate) && " (Overdue)"}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {request.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  openConfirmModal("approve", request)
                                }
                                disabled={isProcessing}
                                className="p-2 hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  openConfirmModal("reject", request)
                                }
                                disabled={isProcessing}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {request.status === "approved" && (
                            <button
                              onClick={() =>
                                openConfirmModal("return", request)
                              }
                              disabled={isProcessing}
                              className="px-3 py-1 bg-deepSkyBlue text-white rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                              Mark Returned
                            </button>
                          )}
                          {(request.status === "rejected" ||
                            request.status === "returned") && (
                            <span className="text-sm text-gray-500">
                              No actions
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && selectedRequest && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeConfirmModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-corbeau rounded-xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      confirmModal === "approve"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : confirmModal === "reject"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-blue-100 dark:bg-blue-900/30"
                    }`}
                  >
                    {confirmModal === "approve" ? (
                      <CheckCircle
                        className={`w-6 h-6 text-green-600 dark:text-green-400`}
                      />
                    ) : confirmModal === "reject" ? (
                      <XCircle
                        className={`w-6 h-6 text-red-600 dark:text-red-400`}
                      />
                    ) : (
                      <AlertCircle
                        className={`w-6 h-6 text-blue-600 dark:text-blue-400`}
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold">
                    {confirmModal === "approve"
                      ? "Approve Request"
                      : confirmModal === "reject"
                      ? "Reject Request"
                      : "Mark as Returned"}
                  </h3>
                </div>
                <button
                  onClick={closeConfirmModal}
                  disabled={isProcessing}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Request Details */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      User
                    </p>
                    <p className="font-semibold">{selectedRequest.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedRequest.user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Book
                    </p>
                    <p className="font-semibold">
                      {selectedRequest.book.bookTitle}
                    </p>
                    <p className="text-sm text-gray-500">
                      by {selectedRequest.book.authors}
                    </p>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Request Date
                      </p>
                      <p className="font-semibold text-sm">
                        {formatDate(selectedRequest.requestDate)}
                      </p>
                    </div>
                    {confirmModal === "approve" && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Due Date (14 days)
                        </p>
                        <p className="font-semibold text-sm">{getDueDate()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirmation Message */}
                <div
                  className={`p-3 rounded-lg ${
                    confirmModal === "approve"
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : confirmModal === "reject"
                      ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      confirmModal === "approve"
                        ? "text-green-700 dark:text-green-300"
                        : confirmModal === "reject"
                        ? "text-red-700 dark:text-red-300"
                        : "text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {confirmModal === "approve" &&
                      "This will approve the borrow request and set the book status to borrowed. The user will be able to pick up the book."}
                    {confirmModal === "reject" &&
                      "This will reject the borrow request. The user will not be able to borrow this book and will need to make a new request."}
                    {confirmModal === "return" &&
                      "This will mark the book as returned. The book will become available for others to borrow."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={closeConfirmModal}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAction}
                    disabled={isProcessing}
                    className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                      confirmModal === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : confirmModal === "reject"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {confirmModal === "approve" && "Approve Request"}
                        {confirmModal === "reject" && "Reject Request"}
                        {confirmModal === "return" && "Mark as Returned"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BorrowRequestsPage;
