import type { Metadata } from "next";
import AdminSideBar from "@/app/components/admin/Sidebar";
import AdminNavbar from "@/app/components/admin/Navbar";

export const metadata: Metadata = {
  title: "Admin - Bookwise Library Managament System",
  description: "Administrative panel for managing the Bookwise platform.",
};

export default function AdminLayout({children}: { children: React.ReactNode }) {
    return (
        <section className="flex w-screen h-screen fixed inset-0 z-[500] overflow-hidden bg-white-solid text-corbeau dark:bg-corbeau dark:text-white-solid">
            <AdminSideBar />
            <div className="flex-1">
                <AdminNavbar />
                {children}
            </div>
        </section>
    )
}