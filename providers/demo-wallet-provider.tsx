"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { ethers } from "ethers"
import { appConfig } from "@/config/app-config"
import { useToast } from "@/components/ui/use-toast"

// Define the demo wallet context type
type DemoWalletContextType = {
  isConnected: boolean
  account: string | null
  balance: string
  tokenBalance: string
  network: "mainnet" | "testnet"
  chainId: number
  connect: (customAddress?: string) => Promise<void>
  disconnect: () => void
  isLoading: boolean
  sendTransaction: (to: string, amount: string) => Promise<{ hash: string }>
  getTransactionReceipt: (hash: string) => Promise<any>
  userProfile: {
    username: string | null
    email: string | null
    avatar: string | null
  }
  setUserProfile: (profile: { username: string; email: string; avatar?: string }) => void
}

const initialContext: DemoWalletContextType = {
  isConnected: false,
  account: null,
  balance: "0",
  tokenBalance: "0",
  network: appConfig.demoMode.demoNetwork,
  chainId: appConfig.demoMode.demoChainId,
  connect: async () => {},
  disconnect: () => {},
  isLoading: false,
  sendTransaction: async () => ({ hash: "" }),
  getTransactionReceipt: async () => ({}),
  userProfile: {
    username: null,
    email: null,
    avatar: null,
  },
  setUserProfile: () => {},
}

const DemoWalletContext = createContext<DemoWalletContextType>(initialContext)

export const useDemoWallet = () => useContext(DemoWalletContext)

// Generate a random transaction hash
const generateTxHash = () => {
  return `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
}

// Demo wallet provider component
export function DemoWalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState(appConfig.demoMode.demoBalance)
  const [tokenBalance, setTokenBalance] = useState(appConfig.demoMode.demoTokenBalance)
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Record<string, any>>({})
  const [userProfile, setUserProfileState] = useState({
    username: null as string | null,
    email: null as string | null,
    avatar: null as string | null,
  })
  const { toast } = useToast()

  // Connect to demo wallet
  const connect = async (customAddress?: string) => {
    setIsLoading(true)

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const walletAddress = customAddress || appConfig.demoMode.demoAddress
    setAccount(walletAddress)
    setIsConnected(true)

    // Load user profile from localStorage if available
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem(`userProfile_${walletAddress}`)
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile)
          setUserProfileState(profile)
        } catch (error) {
          console.error("Failed to parse user profile:", error)
        }
      }
    }

    setIsLoading(false)

    toast({
      title: "Wallet Connected",
      description: "Demo wallet connected successfully",
    })
  }

  // Disconnect from demo wallet
  const disconnect = () => {
    setIsConnected(false)
    setAccount(null)
    setUserProfileState({
      username: null,
      email: null,
      avatar: null,
    })

    toast({
      title: "Wallet Disconnected",
      description: "Demo wallet disconnected",
    })
  }

  // Set user profile
  const setUserProfile = (profile: { username: string; email: string; avatar?: string }) => {
    const updatedProfile = {
      username: profile.username,
      email: profile.email,
      avatar: profile.avatar || null,
    }

    setUserProfileState(updatedProfile)

    // Save to localStorage
    if (typeof window !== "undefined" && account) {
      localStorage.setItem(`userProfile_${account}`, JSON.stringify(updatedProfile))
    }

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    })
  }

  // Send a demo transaction
  const sendTransaction = async (to: string, amount: string) => {
    setIsLoading(true)

    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a transaction hash
    const hash = generateTxHash()

    // Update balance
    const newBalance = Number.parseFloat(balance) - Number.parseFloat(amount)
    setBalance(newBalance.toString())

    // Store transaction
    setTransactions((prev) => ({
      ...prev,
      [hash]: {
        from: account,
        to,
        value: ethers.parseEther(amount),
        hash,
        blockNumber: Math.floor(Math.random() * 1000000),
        status: 1, // success
        timestamp: Date.now(),
      },
    }))

    setIsLoading(false)

    return { hash }
  }

  // Get a transaction receipt
  const getTransactionReceipt = async (hash: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return transactions[hash] || null
  }

  return (
    <DemoWalletContext.Provider
      value={{
        isConnected,
        account,
        balance,
        tokenBalance,
        network: appConfig.demoMode.demoNetwork,
        chainId: appConfig.demoMode.demoChainId,
        connect,
        disconnect,
        isLoading,
        sendTransaction,
        getTransactionReceipt,
        userProfile,
        setUserProfile,
      }}
    >
      {children}
    </DemoWalletContext.Provider>
  )
}

