import type React from "react"
import type { Metadata } from "next"

import "./globals.css"

import { Geist, Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-inter",
})

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "500"],
  variable: "--font-geist",
})

export const metadata: Metadata = {
  title: "Builders Archive | Crecimiento",
  description:
    "From the very beginning, Argentina was always at the forefront of Ethereum innovation. The Builders Archive gathers origin stories of Argentina's crypto startups, early experiments, and ongoing contributions to the world computer.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Builders Archive | Crecimiento",
    description:
      "From the very beginning, Argentina was always at the forefront of Ethereum innovation. The Builders Archive gathers origin stories of Argentina's crypto startups, early experiments, and ongoing contributions to the world computer.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Builders Archive | Crecimiento",
    description:
      "From the very beginning, Argentina was always at the forefront of Ethereum innovation. The Builders Archive gathers origin stories of Argentina's crypto startups, early experiments, and ongoing contributions to the world computer.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${inter.variable} antialiased`}>{children}</body>
    </html>
  )
}
