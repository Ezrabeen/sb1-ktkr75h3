"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import Connex from '@vechain/connex'

// Define the Thor network IDs
const THOR_MAINNET_ID = 39
const THOR_TESTNET_ID = 40

// Define connection states
type ConnectionState = "disconnected" | "connecting" | "connected" | "error"

type VeWorldContextType = {
  isConnected: boolean
  account: string | null
  connex: Connex | null
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
  connex: null,
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

// Helper to format VET balance
const formatVET = (wei: string): string => {
  const vet = Number(wei) / Math.pow(10, 18);
  return vet.toFixed(4);
}

export function VeWorldProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [connex, setConnex] = useState<Connex | null>(null)
  const [balance, setBalance] = useState("0")
  const [chainId, setChainId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [network, setNetwork] = useState<"mainnet" | "testnet" | "unknown">("unknown")
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected")

  // Initialize Connex
  useEffect(() => {
    try {
      // Initialize for testnet by default
      const newConnex = new Connex({
        node: 'https://testnet.vechain.org/',
        network: 'test'
      });
      setConnex(newConnex);
      setNetwork("testnet");
      setChainId(THOR_TESTNET_ID);
    } catch (error) {
      console.error("Failed to initialize Connex:", error);
    }
  }, []);

  // Check if VeWorld/Sync2 is available
  const detectWallet = (): boolean => {
    return typeof window !== "undefined" && 
           (!!window.connex || !!window.ethereum?.isVeWorld || 
            !!window.vechain?.thor);
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
        return
      }

      // Use Connex Vendor to sign certificate
      if (connex) {
        try {
          const vendor = new Connex.Vendor('test');
          const certificateResponse = await vendor.sign('cert', {
            purpose: 'identification',
            payload: {
              type: 'text',
              content: 'Connect to dApp'
            }
          });
          
          setAccount(certificateResponse.annex.signer);
          
          // Get balance
          const account = connex.thor.account(certificateResponse.annex.signer);
          const accountInfo = await account.get();
          setBalance(formatVET(accountInfo.balance));
          
          setIsConnected(true);
          setConnectionState("connected");
          
          console.log(`Connected to VeWorld on ${network} network`);
        } catch (error) {
          console.error("Error connecting with Connex:", error);
          setConnectionState("error");
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
    setBalance("0")
    setConnectionState("disconnected")
  }

  // Update balance
  const updateBalance = async () => {
    if (isConnected && connex && account) {
      try {
        const accountObj = connex.thor.account(account);
        const accountInfo = await accountObj.get();
        setBalance(formatVET(accountInfo.balance));
      } catch (error) {
        console.error("Error updating balance:", error)
      }
    }
  }

  useEffect(() => {
    // Set up balance update interval when connected
    let balanceInterval: NodeJS.Timeout | null = null

    if (isConnected) {
      balanceInterval = setInterval(updateBalance, 30000) // Update every 30 seconds
    }

    // Cleanup
    return () => {
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
        connex,
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

