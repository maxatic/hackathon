import { ClerkProvider } from "@clerk/nextjs";
import { Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Syz",
  description: "AI-powered job applications for DACH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistMono.className} min-h-screen antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
