import type { Metadata } from "next";
import ProviderWrapper from "./providers/Providers";
import { Playfair_Display, Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookWise Library Management System",
  description: "A library management system built with Next.js",
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${montserrat.className} antialiased`}
      >
        {/* <Toaster /> */}
        <ProviderWrapper>
          <Navbar />
          {children}
          <Footer />
        </ProviderWrapper>
      </body>
    </html>
  );
}
