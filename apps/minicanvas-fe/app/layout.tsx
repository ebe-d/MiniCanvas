import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "../components/Navigation";
import { AuthProvider } from "../components/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiniCanvas - Collaborative Drawing Tool",
  description: "Create, collaborate, and innovate with our powerful drawing tool. Real-time collaboration for teams and individuals.",
  keywords: "drawing, collaboration, canvas, design, creative, real-time",
  authors: [{ name: "MiniCanvas Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#6366f1",
  openGraph: {
    title: "MiniCanvas - Collaborative Drawing Tool",
    description: "Create, collaborate, and innovate with our powerful drawing tool.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MiniCanvas - Collaborative Drawing Tool",
    description: "Create, collaborate, and innovate with our powerful drawing tool.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navigation />
          <main className="relative">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
