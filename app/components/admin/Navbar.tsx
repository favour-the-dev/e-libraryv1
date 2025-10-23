import Link from "next/link";
import ThemeSwitchBtn from "../ui-helpers/ThemeSwitchBtn";
function AdminNavbar() {
    return (
        <nav className="bg-white dark:bg-corbeau border-b border-gray-200 dark:border-gray-700 p-3">
            <div className="max-container flex items-center justify-between py-4">
                <div className="text-lg font-bold">Admin Panel</div>
                <ThemeSwitchBtn/>
            </div>
        </nav>
    );
}

export default AdminNavbar;