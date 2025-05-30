import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Providers from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Image Optimizer",
  description: "Crop and reduce the size of your image files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900`}
          // className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900 px-4 sm:px-6`}
        >
          {children}
        </body>
      </Providers>
    </html>
  );
}
