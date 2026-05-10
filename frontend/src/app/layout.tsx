import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { baseMetaDatas } from "@/config/base";
import { SuperProvider } from "@/providers/super";
import { Navbar } from "@/components/Navbar";
import React from "react";
import Link from "next/link";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sg",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jbm",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = baseMetaDatas;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased bg-ambient`}
      ><React.StrictMode>

          <SuperProvider>
            <div className="app-shell">
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <footer className="border-t border-white/10 bg-ambient text-xs text-muted">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="font-medium text-primary">SmartCart</div>
                  <div className="flex flex-wrap gap-6 text-sm">
                    <Link href="/about" className="hover:text-primary">About</Link>
                    <Link href="/compare" className="hover:text-primary">Compare</Link>
                    <Link href="/wishlist" className="hover:text-primary">Wishlist</Link>
                  </div>
                  <div className="text-muted">&copy; 2026 SmartCart</div>
                </div>
              </footer>
            </div>
          </SuperProvider>
        </React.StrictMode>
      </body>
    </html>
  );
}
