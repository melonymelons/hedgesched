import { Geist, Geist_Mono } from "next/font/google";
import {Inter} from 'next/font/google'
import "./globals.css";
import Header from "@/components/header";

export const metadata = {
  title: "HEDGE 调度器",
  description: "HEDGE Meeting Scheduler",
};

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     <body> <div className={inter.className}>
      {/* Header */}
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-red-200 to-white">{children}</main>
      {/* Footer */}
      </div>
      <footer className="bg-black py-12">
        <div className = "container mx-auto px-4 text-center text-white">
          <p>Hedge Global ~ Scheduling Platform</p>
        </div>
      </footer>
      </body>
    </html>
  );
}
