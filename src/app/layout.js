"use client";
import React from "react";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fredoka.className}>
      <body className="bg-clayBg text-clayText min-h-screen selection:bg-blue-200">
        {children}
      </body>
    </html>
  );
}
