import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EmberProvider } from "./lib/emberConversation";
import { EmberWidget } from "./components/EmberWidget";
import { THEME_INIT_SCRIPT } from "./lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Mastery HQ — Freedom Engine",
  description:
    "Your personal headquarters in the Freedom Engine world. Build, explore, return.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Applies the stored light/dark preference before first paint —
            avoids a flash of the wrong theme while React hydrates. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <EmberProvider>
          {children}
          <EmberWidget />
        </EmberProvider>
      </body>
    </html>
  );
}
