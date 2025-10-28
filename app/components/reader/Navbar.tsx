"use client";
import { useSession } from "next-auth/react";
import ThemeSwitchBtn from "../ui-helpers/ThemeSwitchBtn";
import {
  Menu,
  Search,
  X,
  Library,
  BookMarked,
  History,
  Trophy,
  Bell,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../ui-helpers/Logo";
import LogOutBtn from "../ui-helpers/logout";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  type: "overdue" | "due_soon" | "due_today";
  message: string;
  time: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  bookTitle: string;
  dueDate: string;
}

function ReaderNavbar() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/reader/notifications");
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "due_today":
        return <Clock className="w-5 h-5 text-orange-500" />;
      case "due_soon":
        return <Calendar className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case "overdue":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "due_today":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      case "due_soon":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const links = [
    {
      path: "/reader/all-books",
      name: "All Books",
      icon: <Library className="w-5 h-5" />,
    },
    {
      path: "/reader/borrowed-books",
      name: "My Books",
      icon: <BookMarked className="w-5 h-5" />,
    },
    {
      path: "/reader/return-history",
      name: "History",
      icon: <History className="w-5 h-5" />,
    },
    {
      path: "/reader/leaderboard",
      name: "Leaderboard",
      icon: <Trophy className="w-5 h-5" />,
    },
  ];

  return (
    <>
      <nav className="bg-white dark:bg-corbeau border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Section - Mobile Menu & Search */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 max-w-md w-full">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-full placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <ThemeSwitchBtn />

            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {session?.user?.name || "Reader"}
                </p>
                <p className="text-xs text-gray-500">Member</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-deepSkyBlue/20 text-deepSkyBlue font-bold flex items-center justify-center">
                {session?.user?.name?.charAt(0).toUpperCase() || "R"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-corbeau border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                <Logo page="reader" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-5 space-y-3 overflow-y-auto">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 text-sm font-medium p-3 rounded-lg hover:bg-deepSkyBlue/20 hover:text-blue-500 dark:hover:text-blue-400 ${
                      pathName === link.path
                        ? "text-blue-500 dark:text-blue-400 bg-deepSkyBlue/20"
                        : "text-gray-700 dark:text-gray-200"
                    } transition-colors duration-300 ease-in-out`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Footer - User Info */}
              <div className="p-5 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deepSkyBlue/20 text-deepSkyBlue font-bold flex items-center justify-center flex-shrink-0">
                    {session?.user?.name?.charAt(0).toUpperCase() || "R"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm truncate">
                      {session?.user?.name || "Reader"}
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <LogOutBtn />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Notifications Modal */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsNotificationsOpen(false)}
            />

            {/* Notifications Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed right-2 md:right-4 top-20 w-full max-w-[300px] md:max-w-md bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-bold">Due Date Reminders</h3>
                  <p className="text-sm text-gray-500">
                    {unreadCount} book{unreadCount !== 1 ? "s" : ""} need
                    {unreadCount !== 1 ? "" : "s"} attention
                  </p>
                </div>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deepSkyBlue"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No notifications
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      All your books are on track!
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg border ${getNotificationBgColor(
                        notification.type
                      )} cursor-pointer hover:shadow-md transition-all`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">
                              {notification.time}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full font-semibold ${
                                notification.type === "overdue"
                                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                  : notification.type === "due_today"
                                  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                              }`}
                            >
                              {notification.type === "overdue"
                                ? "Overdue"
                                : notification.type === "due_today"
                                ? "Due Today"
                                : "Upcoming"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link
                    href="/reader/borrowed-books"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="block w-full text-center px-4 py-2 bg-deepSkyBlue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    View My Books
                  </Link>
                  <button
                    onClick={fetchNotifications}
                    className="w-full text-center text-sm text-deepSkyBlue hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    Refresh Notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ReaderNavbar;
