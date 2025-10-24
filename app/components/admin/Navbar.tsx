"use client";
import { useSession } from "next-auth/react";
import ThemeSwitchBtn from "../ui-helpers/ThemeSwitchBtn";
import { Bell, Menu, Search, X, ChartColumnBig, BookOpenText, ScrollText, Users } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../ui-helpers/Logo";
import LogOutBtn from "../ui-helpers/logout";
import { motion, AnimatePresence } from "framer-motion";

function AdminNavbar() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathName = usePathname();

    const links = [
        {
            path: "/admin/dashboard",
            name: "Dashboard",
            icon: <ChartColumnBig className="w-5 h-5" />
        },
        {
            path: "/admin/books-inventory",
            name: "Books Inventory",
            icon: <BookOpenText className="w-5 h-5" />
        },
        {
            path: "/admin/borrow-requests",
            name: "Borrow Requests",
            icon: <ScrollText className="w-5 h-5" />
        },
        {
            path: "/admin/users",
            name: "Users",
            icon: <Users className="w-5 h-5" />
        }
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
                            placeholder="Search books, users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-500"
                        />
                    </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-4">
                    <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    
                    <ThemeSwitchBtn />
                    
                    <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                        <div className="text-right">
                            <p className="text-sm font-semibold">{session?.user?.name || "Admin"}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-deepSkyBlue/20 text-deepSkyBlue font-bold flex items-center justify-center">
                            {session?.user?.name?.charAt(0).toUpperCase() || "A"}
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
                            <Logo page="admin" />
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 p-5 space-y-3 overflow-y-auto">
                            {links.map(link => (
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
                                    {session?.user?.name?.charAt(0).toUpperCase() || "A"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold text-sm truncate">{session?.user?.name || "Admin"}</h2>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{session?.user?.email}</p>
                                </div>
                            </div>
                            <LogOutBtn />
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
        </>
    );
}

export default AdminNavbar;