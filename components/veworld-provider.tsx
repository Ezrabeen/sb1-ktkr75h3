"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { ethers } from "ethers"

type VeWorldContextType = {
  isConnected: boolean
  account: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
  chainId: number | null
}

const VeWorldContext = createContext<VeWorldContextType>({
  isConnected: false,
  account: null,
  provider: null,
  signer: null,
  balance: "0",
  connect: async () => {},
  disconnect: () => {},
  chainId: null,
})

export const useVeWorld = () => useContext(VeWorldContext)

export function VeWorldProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [balance, setBalance] = useState("0")
  const [chainId, setChainId] = useState<number | null>(null)

  // Connect to VeWorld wallet
  const connect = async () => {
    try {
      // Check if VeWorld wallet is available in window
      if (typeof window !== "undefined" && window.ethereum) {
        // Create ethers provider using window.ethereum
        const ethersProvider = new ethers.BrowserProvider(window.ethereum)

        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          // Get signer, account balance, and chain ID
          const ethersSigner = await ethersProvider.getSigner()
          const accountBalance = await ethersProvider.getBalance(accounts[0])
          const { chainId: networkChainId } = await ethersProvider.getNetwork()

          // Update state
          setProvider(ethersProvider)
          setSigner(ethersSigner)
          setAccount(accounts[0])
          setBalance(ethers.formatEther(accountBalance))
          setChainId(Number(networkChainId))
          setIsConnected(true)
        }
      } else {
        alert("VeWorld wallet not found! Please install the VeWorld extension.")
      }
    } catch (error) {
      console.error("Error connecting to VeWorld wallet:", error)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setBalance("0")
    setChainId(null)
  }

  useEffect(() => {
    // Check if already connected
    if (typeof window !== "undefined" && window.ethereum) {
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          })

          if (accounts.length > 0) {
            connect()
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }

      checkConnection()

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          connect()
        } else {
          disconnect()
        }
      })

      // Listen for chain changes
      window.ethereum.on("chainChanged", () => {
        connect()
      })
    }

    // Cleanup listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }
    }
  }, [])

  return (
    <VeWorldContext.Provider
      value={{
        isConnected,
        account,
        provider,
        signer,
        balance,
        connect,
        disconnect,
        chainId,
      }}
    >
      {children}
    </VeWorldContext.Provider>
  )
}

