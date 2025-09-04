import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaxEnd.AI - Smart Tax Solutions for Australian Business",
  description: "AI-powered tax management platform for individuals, businesses & advisors. Complete Australian Tax Management Platform.",
  keywords: "Australian tax, tax calculator, ATO, tax management, AI tax assistant",
  openGraph: {
    title: "TaxEnd.AI - Smart Tax Solutions",
    description: "AI-powered Australian tax management platform",
    url: "https://taxend.ai",
    siteName: "TaxEnd.AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
