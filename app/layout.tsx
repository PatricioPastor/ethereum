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
  title: "Reconstructing Crypto in Argentina | 2008-2025",
  description:
    "A registry of early events, companies, and Ethereum-related contributions by Argentinians. Early Ethereum history overlaps with Bitcoin, so some early Bitcoin-related events have been included.",
  generator: "v0.app",
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
