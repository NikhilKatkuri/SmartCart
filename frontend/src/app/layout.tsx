import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { baseMetaDatas } from "@/config/base";
import { SuperProvider } from "@/providers/super";
import { Navbar } from "@/components/Navbar";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      ><React.StrictMode>

          <SuperProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <footer className="bg-gray-900 text-white py-12 mt-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <h3 className="font-bold mb-4">SmartCart</h3>
                    <p className="text-gray-400">Your modern e-commerce platform</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Products</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li><a href="/products" className="hover:text-white">All Products</a></li>
                      <li><a href="/products?sort=trending" className="hover:text-white">Trending</a></li>
                      <li><a href="/products?sort=price" className="hover:text-white">Deals</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li><a href="/about" className="hover:text-white">About Us</a></li>
                      <li><a href="/contact" className="hover:text-white">Contact</a></li>
                      <li><a href="/blog" className="hover:text-white">Blog</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
                      <li><a href="/terms" className="hover:text-white">Terms</a></li>
                      <li><a href="/sitemap" className="hover:text-white">Sitemap</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                  <p>&copy; 2026 SmartCart. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </SuperProvider>
        </React.StrictMode>
      </body>
    </html>
  );
}
