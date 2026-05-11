import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { UserProvider } from "@/lib/AuthContext.js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube",
  description: "Explore what you want to see",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black">

        <UserProvider>
          <div className=" text-black bg-white">
            <Header />
          </div>
          <div className="flex flex-1">
            <div className=" w-56 text-black bg-white">
              <Sidebar />
            </div>

            <main className="flex-1 min-w-0 p-4 overflow-x-hidden">
              {children}
            </main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
