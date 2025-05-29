'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  

  const showMainNavbar = !pathname?.startsWith('/dashboard') && 
                         pathname !== '/login' && 
                         pathname !== '/register';
  
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {showMainNavbar && <Navbar />}
        {children}
        {showMainNavbar && (
          <footer className="bg-gray-800 text-white py-6 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p>© {new Date().getFullYear()} - Aplicativo de Controle de Ponto</p>
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}