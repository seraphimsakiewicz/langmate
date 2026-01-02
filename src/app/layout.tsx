import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import { TailwindIndicator } from "@/components/ui/tailwind-indicator";
import { Providers } from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: "Swaptalk - Schedule based language exchange",
  description: "Practice languages with real people.",

  openGraph: {
    title: "Swaptalk - Schedule based language exchange",
    description: "Practice languages with real people.",
    url: "https://swaptalk.io",
    siteName: "Swaptalk",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full overflow-hidden`}>
        <Providers>{children}</Providers>
        <TailwindIndicator />
      </body>
    </html>
  );
}
