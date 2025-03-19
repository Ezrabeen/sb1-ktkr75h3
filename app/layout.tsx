import { Metadata } from "next"
import { Providers } from "@/providers/providers"
import { Navbar } from "@/components/Navbar"
import { dancingScript } from "./fonts"

import "./globals.css"

export const metadata: Metadata = {
  title: 'ReVive - Sustainable Marketplace on VeChain',
  description: 'Sustainable marketplace powered by blockchain technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={dancingScript.variable}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}