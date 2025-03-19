import type React from "react"
import type { Metadata } from "next"
import { Inter, Dancing_Script } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { NetworkToggle } from "@/components/network-toggle"
import { NetworkProvider } from "@/contexts/network-context"
import { WalletProvider } from "@/contexts/wallet-context"
import { TokenProvider } from "@/contexts/token-context"
import { TransactionProvider } from "@/contexts/transaction-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { VeChainProvider } from '@/providers/VeChainProvider'
import { I18nProvider } from '@/contexts/i18n-context'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
})

export const metadata: Metadata = {
  title: 'ReVive - Sustainable Marketplace on VeChain',
  description: 'Sustainable marketplace powered by blockchain technology',
  keywords: "sustainable, second-hand, marketplace, eco-friendly, pre-owned, B3TR tokens",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${dancingScript.variable} font-sans antialiased`}>
      <body className={inter.className}>
        <VeChainProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="revive-theme"
          >
            <I18nProvider>
              <NetworkProvider>
                <AuthProvider>
                  <WalletProvider>
                    <TokenProvider>
                      <TransactionProvider>
                        <CartProvider>
                          <WishlistProvider>
                            <div className="relative min-h-screen flex flex-col bg-background">
                              <Navbar />
                              <main className="flex-1 pt-16">{children}</main>
                              <Footer />
                              <NetworkToggle />
                              <Toaster />
                            </div>
                          </WishlistProvider>
                        </CartProvider>
                      </TransactionProvider>
                    </TokenProvider>
                  </WalletProvider>
                </AuthProvider>
              </NetworkProvider>
            </I18nProvider>
          </ThemeProvider>
        </VeChainProvider>
      </body>
    </html>
  )
}