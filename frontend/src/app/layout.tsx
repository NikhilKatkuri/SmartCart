import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { baseMetaDatas } from "@/config/base";
import { SuperProvider } from "@/providers/super";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><React.StrictMode>

          <SuperProvider>

            {children}
          </SuperProvider>
        </React.StrictMode>
      </body>
    </html>
  );
}
