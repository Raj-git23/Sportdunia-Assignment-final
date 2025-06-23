"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/navbar';
import { AuthProvider } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENTID || ""

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={clientId}>

        <AuthProvider >
          <div className="h-full w-full flex flex-col items-center justify-center">
            {!pathname.includes('login') && <Navbar />}
            {children}
          </div>
        </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}