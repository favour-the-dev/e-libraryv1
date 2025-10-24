"use client";
import { motion } from "framer-motion";
import { 
    BookOpen, 
    Users, 
    BookMarked, 
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

function AdminDashboard() {
    // Mock data - replace with actual API calls
    const stats = [
        {
            title: "Total Books",
            value: "2,547",
            change: "+12%",
            trend: "up",
            icon: <BookOpen className="w-6 h-6" />,
            color: "bg-blue-500"
        },
        {
            title: "Active Users",
            value: "1,234",
            change: "+8%",
            trend: "up",
            icon: <Users className="w-6 h-6" />,
            color: "bg-green-500"
        },
        {
            title: "Books Borrowed",
            value: "856",
            change: "-3%",
            trend: "down",
            icon: <BookMarked className="w-6 h-6" />,
            color: "bg-purple-500"
        },
        {
            title: "Overdue Returns",
            value: "23",
            change: "-15%",
            trend: "down",
            icon: <Clock className="w-6 h-6" />,
            color: "bg-red-500"
        }
    ];

    const recentActivity = [
        {
            user: "John Doe",
            action: "borrowed",
            book: "The Great Gatsby",
            time: "2 hours ago",
            status: "success"
        },
        {
            user: "Jane Smith",
            action: "returned",
            book: "To Kill a Mockingbird",
            time: "4 hours ago",
            status: "success"
        },
        {
            user: "Mike Johnson",
            action: "overdue",
            book: "1984",
            time: "1 day ago",
            status: "warning"
        },
        {
            user: "Sarah Williams",
            action: "borrowed",
            book: "Pride and Prejudice",
            time: "3 hours ago",
            status: "success"
        },
        {
            user: "Tom Brown",
            action: "returned",
            book: "The Catcher in the Rye",
            time: "5 hours ago",
            status: "success"
        }
    ];

    const popularBooks = [
        { title: "The Great Gatsby", borrows: 156, available: 3 },
        { title: "To Kill a Mockingbird", borrows: 142, available: 5 },
        { title: "1984", borrows: 128, available: 2 },
        { title: "Pride and Prejudice", borrows: 115, available: 4 },
        { title: "The Hobbit", borrows: 98, available: 6 }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto space-y-6"
            >
                {/* Header */}
                <motion.div variants={itemVariants}>
                    <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Welcome back! Here's what's happening with your library today.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div 
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        {stat.title}
                                    </p>
                                    <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                                    <div className="flex items-center gap-1">
                                        {stat.trend === "up" ? (
                                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className={`text-sm font-medium ${
                                            stat.trend === "up" ? "text-green-500" : "text-red-500"
                                        }`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-sm text-gray-500">vs last month</span>
                                    </div>
                                </div>
                                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <motion.div 
                        variants={itemVariants}
                        className="lg:col-span-2 bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Recent Activity</h2>
                            <button className="text-sm text-deepSkyBlue hover:underline">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className={`p-2 rounded-lg ${
                                        activity.status === "success" 
                                            ? "bg-green-100 dark:bg-green-900/30" 
                                            : "bg-yellow-100 dark:bg-yellow-900/30"
                                    }`}>
                                        {activity.status === "success" ? (
                                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            <span className="text-deepSkyBlue">{activity.user}</span>
                                            {" "}{activity.action}{" "}
                                            <span className="font-semibold">"{activity.book}"</span>
                                        </p>
                                        <p className="text-sm text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Popular Books */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-deepSkyBlue" />
                            <h2 className="text-xl font-bold">Popular Books</h2>
                        </div>
                        <div className="space-y-4">
                            {popularBooks.map((book, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm line-clamp-1">
                                                {book.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {book.borrows} borrows • {book.available} available
                                            </p>
                                        </div>
                                        <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">
                                            #{index + 1}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-deepSkyBlue h-2 rounded-full"
                                            style={{ width: `${(book.borrows / 156) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button className="p-6 bg-white dark:bg-corbeau border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-deepSkyBlue dark:hover:border-deepSkyBlue transition-colors group">
                        <BookOpen className="w-8 h-8 text-deepSkyBlue mb-3" />
                        <h3 className="font-bold mb-1">Add New Book</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Add a new book to the catalogue
                        </p>
                    </button>
                    <button className="p-6 bg-white dark:bg-corbeau border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-deepSkyBlue dark:hover:border-deepSkyBlue transition-colors group">
                        <Users className="w-8 h-8 text-deepSkyBlue mb-3" />
                        <h3 className="font-bold mb-1">Manage Users</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            View and manage user accounts
                        </p>
                    </button>
                    <button className="p-6 bg-white dark:bg-corbeau border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-deepSkyBlue dark:hover:border-deepSkyBlue transition-colors group">
                        <Clock className="w-8 h-8 text-deepSkyBlue mb-3" />
                        <h3 className="font-bold mb-1">Overdue Books</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Handle overdue book returns
                        </p>
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default AdminDashboard;