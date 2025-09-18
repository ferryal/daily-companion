import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { WebVitalsReporter } from "@/components/WebVitals";
import "./globals.css";
import "./performance.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Companion",
  description:
    "Your addictive AI chat companion for daily motivation and growth",
  keywords: ["AI", "chat", "companion", "daily", "motivation", "productivity"],
  authors: [{ name: "Daily Companion Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Daily Companion",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Daily Companion",
    title: "Daily Companion",
    description:
      "Your addictive AI chat companion for daily motivation and growth",
  },
  twitter: {
    card: "summary",
    title: "Daily Companion",
    description:
      "Your addictive AI chat companion for daily motivation and growth",
  },
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "white" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        {children}
        <Toaster />
        <ServiceWorkerRegister />
        <WebVitalsReporter />
      </body>
    </html>
  );
}
