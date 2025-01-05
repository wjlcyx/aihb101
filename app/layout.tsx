import React from 'react'
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import '@authing/guard-react18/dist/esm/guard.min.css'
import { AuthProvider } from './providers'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI红包封面",
  description: "免费生成红包封面",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent`}
        style={{ margin: 0, padding: 0 }}
      >
        <AuthProvider>
          <BackgroundWrapper>
            {children}
          </BackgroundWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
