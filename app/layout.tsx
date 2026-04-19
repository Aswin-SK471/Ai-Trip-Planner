import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkyPlan AI — Smart Flight Booking & Travel Planning",
  description:
    "Plan your perfect journey with AI-powered flight search, smart itineraries, and destination insights. Book flights, explore destinations, and create unforgettable travel experiences.",
  keywords: "flight booking, AI travel planner, trip planning, flight search, travel itinerary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col antialiased"
        style={{ background: "var(--bg-primary)" }}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
