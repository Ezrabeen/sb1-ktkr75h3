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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
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
                        {children}
                        <Footer />
                        <NetworkToggle />
                        <Toaster />
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
  )
} 