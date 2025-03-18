"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWalletDetection } from "@/hooks/use-wallet-detection"
import { VeWorldProvider, useVeWorld } from "@/providers/veworld-provider"
import { DemoWalletProvider, useDemoWallet } from "@/providers/demo-wallet-provider"
import { appConfig } from "@/config/app-config"

// Define the unified wallet context type
type WalletContextType = {
  isConnected: boolean
  account: string | null
  balance: string
  network: "mainnet" | "testnet" | "unknown"
  chainId: number | null
  connect: () => Promise<void>
  disconnect: () => void
  isLoading: boolean
  isDemo: boolean
  isWalletAvailable: boolean
}

const initialContext: WalletContextType = {
  isConnected: false,
  account: null,
  balance: "0",
  network: "unknown",
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
  isLoading: false,
  isDemo: false,
  isWalletAvailable: false,
}

const WalletContext = createContext<WalletContextType>(initialContext)

export const useWallet = () => useContext(WalletContext)

// Wallet bridge component that connects to the appropriate provider
function WalletBridge({ children }: { children: ReactNode }) {
  const { isWalletAvailable } = useWalletDetection()
  const veworld = useVeWorld()
  const demoWallet = useDemoWallet()
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    // Determine if we should use demo mode
    const shouldUseDemo = !isWalletAvailable && appConfig.enableDemoMode
    setIsDemo(shouldUseDemo)
  }, [isWalletAvailable])

  // Use the appropriate wallet provider based on availability
  const wallet = isDemo ? demoWallet : veworld

  return (
    <WalletContext.Provider
      value={{
        ...wallet,
        isDemo,
        isWalletAvailable: !!isWalletAvailable,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

// Main wallet provider that combines both real and demo providers
export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <VeWorldProvider>
      <DemoWalletProvider>
        <WalletBridge>{children}</WalletBridge>
      </DemoWalletProvider>
    </VeWorldProvider>
  )
}

