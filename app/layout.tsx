import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EmberProvider } from "./lib/emberConversation";
import { EmberWidget } from "./components/EmberWidget";
import { BackToHqButton } from "./components/BackToHqButton";
import { AmbientBackground } from "./components/AmbientBackground";
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
  // Lets "Add to Home Screen" launch as a real standalone app (no Safari
  // chrome at all) instead of a bookmarked tab — that's the only mode where
  // iOS actually hands the notch/status-bar area to the page's own content
  // instead of drawing its own legibility scrim over it.
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Freedom Engine",
  },
};

// Pinch-zoom disabled by explicit choice, on top of the input font-size fix
// (see the inputs across the app) that already stops the involuntary
// iOS auto-zoom-on-focus — this additionally blocks intentional pinch
// gestures, which is a real accessibility tradeoff (WCAG 1.4.4 expects
// users to be able to zoom) accepted knowingly for this personal app.
// viewportFit: "cover" lets the page's own background extend under the
// notch/status bar instead of Safari reserving that strip with its own
// chrome color. env(safe-area-inset-top) is what individual components
// (FounderStatusBar, each page's outer wrapper) use to keep content clear
// of that area.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
        {/* Next's appleWebApp metadata field emits the newer unprefixed
            mobile-web-app-capable tag; iOS's home-screen standalone mode has
            historically required this apple-prefixed one specifically. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* Applies the stored light/dark preference before first paint —
            avoids a flash of the wrong theme while React hydrates. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AmbientBackground />
        <EmberProvider>
          {children}
          <EmberWidget />
          <BackToHqButton />
        </EmberProvider>
      </body>
    </html>
  );
}
