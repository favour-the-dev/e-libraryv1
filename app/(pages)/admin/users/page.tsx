"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Loader2,
  User as UserIcon,
  Mail,
  Calendar,
  BookOpen,
  Shield,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  activeBorrows?: number;
  totalBorrows?: number;
}

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users");
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    )
      return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers();
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    if (
      !confirm(
        `Are you sure you want to change this user's role to "${newRole}"?`
      )
    )
      return;

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers();
      } else {
        alert(data.error || "Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-3xl font-bold mb-2">Users Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage library users, their roles, and borrowing activities.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <h3 className="text-2xl font-bold">{users.length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Admins
                </p>
                <h3 className="text-2xl font-bold">
                  {users.filter((u) => u.role === "admin").length}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Borrows
                </p>
                <h3 className="text-2xl font-bold">
                  {users.reduce((sum, u) => sum + (u.activeBorrows || 0), 0)}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full placeholder:text-gray-500"
            />
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
        >
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-deepSkyBlue mx-auto mb-4 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400">
                Loading users...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {users.length === 0
                  ? "No users registered yet."
                  : "No users match your search."}
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
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Active Borrows
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Total Borrows
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-deepSkyBlue/20 text-deepSkyBlue font-bold flex items-center justify-center">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleRole(user._id, user.role)}
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                            user.role === "admin"
                              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          } hover:opacity-80 transition-opacity`}
                        >
                          {user.role === "admin" && (
                            <Shield className="w-3 h-3" />
                          )}
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            (user.activeBorrows || 0) > 0
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {user.activeBorrows || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 dark:text-gray-400">
                          {user.totalBorrows || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(user.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          disabled={isDeleting}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default UsersPage;
