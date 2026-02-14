import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { NavBar } from "@/components/NavBar";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alt Vows — Invitations That Move",
  description:
    "Stunning, animated invitation sites your guests will never forget. Pick a theme, customize in minutes, share a link. One-time $49 — no subscriptions.",
  keywords: ["invitation", "wedding website", "animated invitation", "RSVP", "wedding", "events"],
  openGraph: {
    title: "Alt Vows — Invitations That Move",
    description:
      "Stunning, animated invitation sites your guests will never forget. Pick a theme, customize in minutes, share a link.",
    url: "https://altvows.com",
    siteName: "Alt Vows",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alt Vows — Invitations That Move",
    description:
      "Stunning, animated invitation sites your guests will never forget. One-time $49.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
      >
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
