"use client"

import { useState, useEffect, useCallback } from "react"
import { useMockVeChain } from "./use-mock-vechain"
import { v4 as uuidv4 } from "uuid"

/**
 * useVeChainWallet Hook
 * 
 * A custom hook that provides wallet connection and interaction capabilities with the VeChain blockchain.
 * This hook abstracts the complexity of dealing with VeChain wallets and provides a simple interface for:
 * 
 * - Connecting to various wallet providers (Sync2, VeWorld)
 * - Managing wallet connection state
 * - Retrieving account balances
 * - Handling network changes
 * - Contract interactions via the Connex instance
 * 
 * The hook integrates with Thor (VeChain's blockchain) and provides typed interfaces for blockchain operations.
 */

// Define interfaces for Connex and Thor
// These are specific to VeChain and different from Web3
interface Connex {
  thor: {
    genesis: {
      id: string
    }
    status: {
      head: {
        id: string
        number: number
        timestamp: number
        parentID: string
      }
    }
    ticker: () => {
      next: () => Promise<{ number: number }>
    }
    account: (address: string) => {
      get: () => Promise<any>
      getCode: () => Promise<any>
      getStorage: (key: string) => Promise<any>
      method: (abi: any) => {
        call: (...args: any[]) => Promise<any>
      }
    }
    block: (revision: string | number) => {
      get: () => Promise<any>
    }
    transaction: (id: string) => {
      get: () => Promise<any>
      getReceipt: () => Promise<any>
    }
    filter: (kind: 'event' | 'transfer', criteria: any) => {
      apply: (offset: number, limit: number) => Promise<any[]>
    }
  }
  vendor: {
    sign: (kind: 'tx' | 'cert', msg: any) => {
      requested: (address: string) => any
      link: (url: string) => any
      comment: (text: string) => any
      delegate: (handler: (msg: any) => Promise<any>) => any
      gas: (gas: number) => any
      gasPriceCoef: (coef: number) => any
      dependsOn: (txid: string) => any
      request: () => Promise<any>
    }
  }
}

// Network types
export type Network = "mainnet" | "testnet"

interface WalletState {
  isConnected: boolean
  address: string
  balance: string
  network: Network
  connectionTime: number
}

// Initial state
const initialState: WalletState = {
  isConnected: false,
  address: "",
  balance: "0",
  network: "testnet",
  connectionTime: 0
}

// Check if window and connex are available
const isConnexAvailable = (): boolean => {
  return typeof window !== "undefined" && 
         typeof (window as any).connex !== "undefined"
}

export function useVeChainWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [balance, setBalance] = useState("0")
  const [network, setNetwork] = useState<Network>("testnet")
  const [connectionTime, setConnectionTime] = useState(0)
  const [connectionDuration, setConnectionDuration] = useState(0)
  const [web3, setWeb3] = useState<any>(null)
  const [connex, setConnex] = useState<Connex | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isTestnet, setIsTestnet] = useState(true)
  
  // Use mock VeChain hook as a fallback
  const mockVeChain = useMockVeChain()
  
  // Create a function to check wallet availability
  const checkWalletAvailability = useCallback((): boolean => {
    if (isConnexAvailable()) {
      console.log("Connex is available")
      return true
    }
    
    console.log("No VeChain wallet detected, falling back to mock implementation")
    return false
  }, [])
  
  // Get formatted address for display
  const getFormattedAddress = useCallback((): string => {
    if (!address) return ""
    
    const start = address.substring(0, 8)
    const end = address.substring(address.length - 6)
    
    return `${start}...${end}`
  }, [address])
  
  // Connect to VeChain wallet
  const connect = useCallback(async () => {
    try {
      // Clear any previous errors
      setError(null)
      
      // Check if Connex is available
      if (isConnexAvailable()) {
        console.log("Connecting to VeWorld on", network === "mainnet" ? "mainnet" : "testnet", "...")
        
        // Get Connex instance from window
        const connexInstance = (window as any).connex as Connex
        setConnex(connexInstance)
        
        // Get network from connex genesis ID
        const genesisId = connexInstance.thor.genesis.id
        const isMainnet = genesisId === '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'
        setNetwork(isMainnet ? "mainnet" : "testnet")
        setIsTestnet(!isMainnet)
        
        // Request certificate to get user address
        try {
          const cert = await connexInstance.vendor.sign('cert', {
            purpose: 'identification',
            payload: {
              type: 'text',
              content: `Connect to Better Earth Marketplace\nPlease sign to verify your identity.\n${new Date().toISOString()}`
            }
          }).request()
          
          if (cert && cert.annex && cert.annex.signer) {
            const userAddress = cert.annex.signer
            setAddress(userAddress)
            
            // Get account balance
            const account = await connexInstance.thor.account(userAddress).get()
            const balanceInWei = account.balance
            // Convert Wei to VET (1 VET = 10^18 Wei)
            const balanceValue = BigInt(balanceInWei) / BigInt(10 ** 18)
            setBalance(balanceValue.toString())
            
            // Update connection state
            setIsConnected(true)
            const time = Date.now()
            setConnectionTime(time)
            
            console.log("Successfully connected to VeWorld on", network)
            console.log("VeWorld connected with address:", userAddress)
            console.log("Account balance:", parseFloat(balanceValue.toString()).toFixed(4), "VET")
            
            // Create a minimal Web3-like interface for compatibility
            const web3Like = {
              eth: {
                accounts: [userAddress],
                defaultAccount: userAddress,
                Contract: function(abi: any, address: string) {
                  return {
                    methods: createContractMethods(connexInstance, abi, address),
                    abi
                  }
                },
                getBalance: async (address: string) => {
                  const account = await connexInstance.thor.account(address).get()
                  return account.balance
                },
                utils: {
                  fromWei: (wei: string, unit: string) => {
                    if (unit === "ether" || unit === "VET") {
                      return (BigInt(wei) / BigInt(10 ** 18)).toString()
                    }
                    return wei
                  },
                  toWei: (eth: string, unit: string) => {
                    if (unit === "ether" || unit === "VET") {
                      const floatVal = parseFloat(eth)
                      return BigInt(Math.floor(floatVal * 10 ** 18)).toString()
                    }
                    return eth
                  }
                }
              }
            }
            
            setWeb3(web3Like)
            return userAddress
          } else {
            throw new Error("Failed to get signer address from certificate")
          }
        } catch (err) {
          console.error("Error during VeWorld connection:", err)
          
          // Check if user rejected
          if (err instanceof Error && err.message.includes("User canceled")) {
            setError("Connection request was rejected")
            throw new Error("User rejected connection request")
          } else {
            setError("Failed to connect to VeWorld")
            throw err
          }
        }
      } else {
        // Fall back to mock implementation
        console.log("No VeChain wallet detected, using mock wallet")
        const result = await mockVeChain.connect()
        
        if (result) {
          setIsConnected(true)
          setAddress(result.address)
          setBalance(result.balance)
          setNetwork(result.network)
          const time = Date.now()
          setConnectionTime(time)
          setIsTestnet(result.network === "testnet")
          
          // Create a minimal Web3-like interface
          const web3Like = {
            eth: {
              accounts: [result.address],
              defaultAccount: result.address,
              getBalance: async () => result.balance,
              utils: {
                fromWei: (wei: string) => wei,
                toWei: (eth: string) => eth
              }
            }
          }
          
          setWeb3(web3Like)
          return result.address
        }
      }
    } catch (err) {
      console.error("Wallet connection error:", err)
      setError(err instanceof Error ? err.message : "Unknown error connecting to wallet")
      throw err
    }
  }, [network, mockVeChain])
  
  // Disconnect from wallet
  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAddress("")
    setBalance("0")
    setConnectionTime(0)
    setWeb3(null)
    setConnex(null)
    
    // Also reset mock if being used
    if (mockVeChain.enabled) {
      mockVeChain.disconnect()
    }
  }, [mockVeChain])
  
  // Update connection duration
  useEffect(() => {
    if (!isConnected || connectionTime === 0) {
      setConnectionDuration(0)
      return
    }
    
    const interval = setInterval(() => {
      const now = Date.now()
      const duration = Math.floor((now - connectionTime) / 1000)
      setConnectionDuration(duration)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isConnected, connectionTime])
  
  // Helper to create contract methods for Web3 compatibility
  const createContractMethods = (
    connexInstance: Connex,
    abi: any[],
    contractAddress: string
  ) => {
    // Create a proxy to handle method calls
    return new Proxy({}, {
      get: (target, prop) => {
        if (typeof prop === 'string') {
          // Find the method in the ABI
          const method = abi.find(item => item.name === prop)
          
          if (method) {
            // Return a function that handles calling the method
            return (...args: any[]) => {
              // Create a callable method object
              const callable = {
                call: async (options = {}) => {
                  const connexMethod = connexInstance.thor.account(contractAddress).method(method)
                  try {
                    const result = await connexMethod.call(...args)
                    return result.decoded
                  } catch (err) {
                    console.error(`Error calling ${prop}:`, err)
                    throw err
                  }
                }
              }
              return callable
            }
          }
        }
        return undefined
      }
    })
  }
  
  return {
    isConnected,
    address,
    balance,
    network,
    web3,
    connex,
    error,
    connect,
    disconnect,
    connectionDuration,
    getFormattedAddress,
    checkWalletAvailability,
    isTestnet
  }
} 