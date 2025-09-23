import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientRoot from "./client-root"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "A modern analytics dashboard built with Next.js and Tailwind CSS",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Analytics Dashboard",
    description: "A modern analytics dashboard built with Next.js and Tailwind CSS",
    url: "https://yourdomain.com",
    siteName: "Analytics Dashboard",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Analytics Dashboard",
    description: "A modern analytics dashboard built with Next.js and Tailwind CSS",
    creator: "@yourusername",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ClientRoot>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ClientRoot>
      </body>
    </html>
  );
}
