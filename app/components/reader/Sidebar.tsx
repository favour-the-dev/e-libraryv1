"use client";
import Link from "next/link";
import { Library, BookMarked, History, Trophy } from "lucide-react";
import LogOutBtn from "../ui-helpers/logout";
import { useSession } from "next-auth/react";
import Logo from "../ui-helpers/Logo";
import { usePathname } from "next/navigation";

function ReaderSidebar() {
  const { data: session } = useSession();
  const pathName = usePathname();

  const links = [
    {
      path: "/reader/all-books",
      name: "All Books",
      icon: <Library />,
    },
    {
      path: "/reader/borrowed-books",
      name: "My Books",
      icon: <BookMarked />,
    },
    {
      path: "/reader/return-history",
      name: "History",
      icon: <History />,
    },
    {
      path: "/reader/leaderboard",
      name: "Leaderboard",
      icon: <Trophy />,
    },
  ];

  return (
    <aside
      className="hidden md:flex flex-col justify-between w-[225px] h-screen bg-white dark:bg-corbeau border-r
         border-gray-200 dark:border-gray-700 p-5 space-y-6"
    >
      <header className="flex flex-col gap-8">
        <Logo page="reader" />
        <nav className="flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`flex items-center gap-2 text-sm font-medium p-2 rounded-lg hover:bg-deepSkyBlue/20 hover:text-blue-500 dark:hover:text-blue-400 ${
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
      </header>
      <footer className="space-y-3">
        <div>
          <h2 className="font-semibold">{session?.user?.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {session?.user?.email}
          </p>
        </div>
        <LogOutBtn />
      </footer>
    </aside>
  );
}

export default ReaderSidebar;
