import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navigation } from "@/components/navigation";
import { CursorGlow } from "@/components/cursor-glow";
import { EasterEgg } from "@/components/easter-egg";
import { ScrollProgress } from "@/components/scroll-progress";
import { FloatingParticles } from "@/components/floating-particles";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Dev Dashboard | Developer Presence",
  description:
    "A futuristic personal developer dashboard showing real-time coding activity, projects, and more.",
  keywords: ["developer", "portfolio", "dashboard", "coding", "projects"],
  authors: [{ name: "Developer" }],
  creator: "Developer",
  openGraph: {
    title: "Dev Dashboard | Developer Presence",
    description:
      "A futuristic personal developer dashboard showing real-time coding activity.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Dashboard | Developer Presence",
    description:
      "A futuristic personal developer dashboard showing real-time coding activity.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a12",
  width: "device-width",
  initialScale: 1,
};

// Easter egg console message
const consoleMessage = `
%c
██████╗ ███████╗██╗   ██╗   ██████╗  █████╗ ███████╗██╗  ██╗
██╔══██╗██╔════╝██║   ██║   ██╔══██╗██╔══██╗██╔════╝██║  ██║
██║  ██║█████╗  ██║   ██║   ██║  ██║███████║███████╗███████║
██║  ██║██╔══╝  ╚██╗ ██╔╝   ██║  ██║██╔══██║╚════██║██╔══██║
██████╔╝███████╗ ╚████╔╝    ██████╔╝██║  ██║███████║██║  ██║
╚═════╝ ╚══════╝  ╚═══╝     ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

Hey there, fellow developer! 👋
Glad to see you checking out the console.
Built with Next.js, Tailwind CSS, and Framer Motion.

`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `console.log('${consoleMessage.replace(/'/g, "\\'")}', 'color: #a855f7; font-family: monospace;');`,
          }}
        />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased gradient-bg min-h-screen`}
      >
        <ScrollProgress />
        <FloatingParticles />
        <CursorGlow />
        <Navigation />
        <EasterEgg />
        <main className="pt-24 pb-12">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
