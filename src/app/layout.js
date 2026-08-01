"use client";
import React from "react";
import { Fredoka } from "next/font/google";
import Navigation from "./components/Navigation";
import ClayDecorations from "./components/ClayDecorations";
import { AlertProvider } from "./components/AlertProvider";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fredoka.className}>
      <body className="bg-clayBg text-clayText min-h-screen selection:bg-blue-200 overflow-x-hidden relative">
        <AlertProvider>
          <ClayDecorations />
          <Navigation />
          <main className="pb-24 md:pb-8 md:pt-24 min-h-screen">
            {children}
          </main>
        </AlertProvider>
      </body>
    </html>
  );
}
