import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Providers from "../components/Providers";
import AuthLayoutContent from "../components/AuthLayoutContent";
import ToastProvider from "../components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduImpact",
  description: "Plateforme éducative pour apprendre, se certifier et accéder aux opportunités.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AuthLayoutContent>
            {children}
          </AuthLayoutContent>
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
