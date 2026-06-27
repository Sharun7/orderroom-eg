import type React from "react"
import type { Metadata } from "next"
import { Inter, DM_Serif_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-dm-serif",
})

export const metadata: Metadata = {
  title: "OrderRoom — Daily Vendor Ordering Platform",
  description: "Replace 20 vendor WhatsApp chats with one daily order in under 60 seconds.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable} bg-[#0F1B2D]`}>
      <body className="font-sans bg-[#0F1B2D] text-[#F7F5F0] antialiased">{children}</body>
    </html>
  )
}
