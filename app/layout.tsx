import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import Sidebar from "../components/Sidebar";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import ToastProvider from "../components/ToastProvider";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "EduImpact",
  description: "Plateforme éducative pour apprendre, se certifier et accéder aux opportunités.",
};

export default async function RootLayout({
  children,
}: Readonly<{ 
  children: ReactNode; 
}>) { 
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {session ? (
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 min-w-0">
                {children}
              </div>
            </div>
          ) : (
            <div className="min-h-screen flex flex-col">
              <PublicHeader />
              <div className="flex-1 min-w-0">
                {children}
              </div>
              <PublicFooter />
            </div>
          )}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
