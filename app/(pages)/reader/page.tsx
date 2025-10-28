"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ReaderPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/reader/all-books");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-deepSkyBlue animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
