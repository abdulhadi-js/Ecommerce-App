import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import StoreProvider from "./StoreProvider"; // <--- 1. Import the Provider

// 1. The Body Font (Clean Sans-Serif)
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// 2. The Heading Font (Elegant Serif)
const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "LuxeStore",
  description: "Experience the art of living.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontSerif.variable
        )}
      >
        {/* 2. Wrap the application logic with Redux */}
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}