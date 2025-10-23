"use client";
import { ThemeProvider } from "next-themes";
import AuthProvider from "./AuthProvider";
import AppContextProvider from "../context/context";

export default function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
