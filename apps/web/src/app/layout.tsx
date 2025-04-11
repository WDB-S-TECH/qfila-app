import { Geist_Mono } from "next/font/google"
import { Geist } from "next/font/google"

import "@repo/ui/globals.css"

import type { Metadata } from "next"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans"
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: "QFila - Sistema de fila de espera",
  description: "Sistema de fila de espera",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico"
  }
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
        suppressHydrationWarning
        suppressContentEditableWarning
      >
        {children}
      </body>
    </html>
  )
}
