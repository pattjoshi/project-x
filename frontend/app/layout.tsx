import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { CustomCursor } from "@/components/cinematic/custom-cursor";
import { GrainOverlay } from "@/components/cinematic/grain-overlay";
import { SmoothScroll } from "@/components/cinematic/smooth-scroll";
import { AuthSessionProvider } from "@/components/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "AI Dating Simulator",
  description: "Meet characters, build relationships, unlock stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <AuthSessionProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <GrainOverlay />
          <CustomCursor />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
