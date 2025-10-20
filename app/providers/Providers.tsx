"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export default function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      {children}
    </ThemeProvider>
  );
}
