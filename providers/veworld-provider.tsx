"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { ethers } from "ethers"

// Define the Thor network IDs
const THOR_MAINNET_ID = 39
const THOR_TESTNET_ID = 40

// Define connection states
type ConnectionState = "disconnected" | "connecting" | "connected" | "error"

type VeWorldContextType = {
  isConnected: boolean
  account: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
  chainId: number | null
  isLoading: boolean
  network: "mainnet" | "testnet" | "unknown"
  connectionState: ConnectionState
  detectWallet: () => boolean
}

const initialContext: VeWorldContextType = {
  isConnected: false,
  account: null,
  provider: null,
  signer: null,
  balance: "0",
  connect: async () => {},
  disconnect: () => {},
  chainId: null,
  isLoading: false,
  network: "unknown",
  connectionState: "disconnected",
  detectWallet: () => false,
}

const VeWorldContext = createContext<VeWorldContextType>(initialContext)

export const useVeWorld = () => useContext(VeWorldContext)

export function VeWorldProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [balance, setBalance] = useState("0")
  const [chainId, setChainId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [network, setNetwork] = useState<"mainnet" | "testnet" | "unknown">("unknown")
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected")

  // Check if VeWorld is available
  const detectWallet = (): boolean => {
    if (typeof window === "undefined") return false

    // Check for VeWorld browser extension
    if (window.ethereum?.isVeWorld) return true

    // Check for VeWorld mobile app
    if (window.vechain?.thor) return true

    // Check for generic ethereum provider that might be VeWorld
    // This is a fallback for cases where the isVeWorld flag might not be present
    if (window.ethereum && !window.ethereum.isMetaMask) return true

    return false
  }

  // Get network name based on chainId
  const getNetworkFromChainId = (id: number | null): "mainnet" | "testnet" | "unknown" => {
    if (id === THOR_MAINNET_ID) return "mainnet"
    if (id === THOR_TESTNET_ID) return "testnet"
    return "unknown"
  }

  // Connect to VeWorld wallet
  const connect = async () => {
    try {
      setConnectionState("connecting")
      setIsLoading(true)

      const isWalletAvailable = detectWallet()

      if (!isWalletAvailable) {
        setConnectionState("error")
        console.error("VeWorld wallet not detected")
        // Instead of redirecting, we'll return and let the UI handle this case
        return
      }

      // Try connecting via window.ethereum (browser extension)
      if (window.ethereum) {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum)

        try {
          // Request account access
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          })

          if (accounts.length > 0) {
            // Get signer, account balance, and chain ID
            const ethersSigner = await ethersProvider.getSigner()
            const accountBalance = await ethersProvider.getBalance(accounts[0])
            const { chainId: networkChainId } = await ethersProvider.getNetwork()

            const networkName = getNetworkFromChainId(Number(networkChainId))

            // Update state
            setProvider(ethersProvider)
            setSigner(ethersSigner)
            setAccount(accounts[0])
            setBalance(ethers.formatEther(accountBalance))
            setChainId(Number(networkChainId))
            setNetwork(networkName)
            setIsConnected(true)
            setConnectionState("connected")

            console.log(`Connected to VeWorld on ${networkName} network`)
          }
        } catch (error) {
          console.error("Error connecting with ethereum provider:", error)
          setConnectionState("error")
        }
      }
      // Try connecting via window.vechain.thor (mobile)
      else if (window.vechain?.thor) {
        try {
          const accounts = await window.vechain.thor.request({
            method: "eth_requestAccounts",
          })

          if (accounts.length > 0) {
            setAccount(accounts[0])
            setIsConnected(true)
            setConnectionState("connected")

            // Try to get network information if available
            try {
              const chainId = await window.vechain.thor.request({
                method: "eth_chainId",
              })
              setChainId(Number(chainId))
              setNetwork(getNetworkFromChainId(Number(chainId)))
            } catch (error) {
              console.error("Error getting chain ID:", error)
              setNetwork("unknown")
            }
          }
        } catch (error) {
          console.error("Error connecting with thor provider:", error)
          setConnectionState("error")
        }
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error)
      setConnectionState("error")
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setBalance("0")
    setChainId(null)
    setNetwork("unknown")
    setConnectionState("disconnected")
  }

  // Update balance
  const updateBalance = async () => {
    if (isConnected && provider && account) {
      try {
        const accountBalance = await provider.getBalance(account)
        setBalance(ethers.formatEther(accountBalance))
      } catch (error) {
        console.error("Error updating balance:", error)
      }
    }
  }

  useEffect(() => {
    // Auto-detect and connect only if wallet is already connected
    // to avoid unexpected wallet popups
    const checkConnection = async () => {
      if (detectWallet()) {
        try {
          if (window.ethereum) {
            const accounts = await window.ethereum.request({
              method: "eth_accounts", // This doesn't trigger a popup
            })

            if (accounts.length > 0) {
              connect()
            }
          } else if (window.vechain?.thor) {
            const accounts = await window.vechain.thor.request({
              method: "eth_accounts", // This doesn't trigger a popup
            })

            if (accounts.length > 0) {
              connect()
            }
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }

    checkConnection()

    // Set up event listeners
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          connect()
        } else {
          disconnect()
        }
      })

      window.ethereum.on("chainChanged", () => {
        connect()
      })
    } else if (window.vechain?.thor) {
      window.vechain.thor.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          connect()
        } else {
          disconnect()
        }
      })
    }

    // Set up balance update interval when connected
    let balanceInterval: NodeJS.Timeout | null = null

    if (isConnected) {
      balanceInterval = setInterval(updateBalance, 30000) // Update every 30 seconds
    }

    // Cleanup listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }
      if (balanceInterval) {
        clearInterval(balanceInterval)
      }
    }
  }, [isConnected])

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
        isLoading,
        network,
        connectionState,
        detectWallet,
      }}
    >
      {children}
    </VeWorldContext.Provider>
  )
}

