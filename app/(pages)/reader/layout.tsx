import ReaderSidebar from "@/app/components/reader/Sidebar";
import ReaderNavbar from "@/app/components/reader/Navbar";

export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-screen h-screen fixed inset-0 z-[500] overflow-hidden bg-white-solid text-corbeau dark:bg-corbeau dark:text-white-solid">
      <ReaderSidebar />
      <div className="w-full flex-1 flex flex-col">
        <ReaderNavbar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </section>
  );
}
