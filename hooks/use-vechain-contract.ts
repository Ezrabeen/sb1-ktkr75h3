"use client"

import { useState, useEffect, useCallback } from "react"
import { useVeChainWallet } from "./use-vechain-wallet"
import { useVeChainTransaction } from "./use-vechain-transaction"
import type { TransactionResult } from "./use-vechain-transaction"

// VIP-180 token standard ABI (VeChain's ERC-20 equivalent)
const VIP180_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transferFrom",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "owner", "type": "address"},
      {"indexed": true, "name": "spender", "type": "address"},
      {"indexed": false, "name": "value", "type": "uint256"}
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "from", "type": "address"},
      {"indexed": true, "name": "to", "type": "address"},
      {"indexed": false, "name": "value", "type": "uint256"}
    ],
    "name": "Transfer",
    "type": "event"
  }
]

// B3TR token is VIP-180 compliant
const B3TR_ABI = VIP180_ABI

// Mock B3TR token contract address (for display purposes only)
const B3TR_CONTRACT_ADDRESS = "0x0000000000000000000000000000456E65726779"

// In-memory storage for mock token balances
// In a real app, this would be in a database or localStorage
const mockTokenBalances: Record<string, string> = {}
const mockTokenTransactions: Array<{
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  hash: string;
}> = []

// Helper to generate a mock transaction hash
const generateTransactionHash = (): string => {
  return '0x' + Array.from({length: 64}, () => 
    Math.floor(Math.random() * 16).toString(16)).join('')
}

// Types
export interface ContractMethod {
  name: string
  inputs: Array<{name: string; type: string}>
  outputs?: Array<{name: string; type: string}>
  constant?: boolean
  stateMutability?: string
}

export interface ContractABI extends Array<ContractMethod> {}

export interface ContractCallOptions {
  from?: string
  value?: string
  gasPrice?: string
  gas?: string
}

export interface TokenInfo {
  name: string
  symbol: string
  decimals: number
  totalSupply: string
}

export function useVeChainContract(contractAddress?: string, abi?: ContractABI) {
  const { web3, address, isConnected, connex } = useVeChainWallet()
  const { sendTransaction } = useVeChainTransaction()
  
  const [contract, setContract] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  
  // Initialize contract instance when web3 is available and contract address/ABI are provided
  useEffect(() => {
    if (web3 && contractAddress && abi) {
      try {
        const contractInstance = new web3.eth.Contract(abi, contractAddress)
        setContract(contractInstance)
        setError(null)
      } catch (err) {
        console.error("Error initializing contract:", err)
        setError("Failed to initialize contract")
      }
    } else {
      setContract(null)
    }
  }, [web3, contractAddress, abi])
  
  // Initialize default B3TR info and mock balances on first load
  useEffect(() => {
    // Set up the token info
    const defaultTokenInfo = {
      name: "Better Earth Token",
      symbol: "B3TR",
      decimals: 18,
      totalSupply: "1000000000000000000000000000" // 1 billion tokens
    }
    setTokenInfo(defaultTokenInfo)
    
    // Set up default balances for testing if they don't exist
    if (address && !mockTokenBalances[address]) {
      // Give the user 1000 tokens to start
      mockTokenBalances[address] = "1000";
    }
  }, [address])
  
  // Load B3TR token info (mock implementation)
  const loadB3TRInfo = useCallback(async () => {
    // Just return the static mock data
    const tokenData = {
      name: "Better Earth Token",
      symbol: "B3TR",
      decimals: 18,
      totalSupply: "1000000000000000000000000000" // 1 billion tokens
    }
    
    setTokenInfo(tokenData)
    return tokenData
  }, [])
  
  // Get B3TR balance for an address (mock implementation)
  const getB3TRBalance = useCallback(async (ownerAddress: string) => {
    // Return the mock balance or 0 if not set
    return mockTokenBalances[ownerAddress] || "0"
  }, [])
  
  // Mock implementation of transferring tokens
  const mockTransferTokens = useCallback(async (from: string, to: string, amount: string): Promise<TransactionResult> => {
    if (!from || !to || !amount) {
      throw new Error("Invalid transfer parameters")
    }
    
    // Ensure the sender has a balance
    if (!mockTokenBalances[from]) {
      mockTokenBalances[from] = "0"
    }
    
    // Check if sender has enough balance
    const senderBalance = parseFloat(mockTokenBalances[from])
    const transferAmount = parseFloat(amount)
    
    if (senderBalance < transferAmount) {
      throw new Error(`Insufficient B3TR balance: ${senderBalance} < ${transferAmount}`)
    }
    
    // Update balances
    mockTokenBalances[from] = (senderBalance - transferAmount).toString()
    
    // Initialize recipient balance if it doesn't exist
    if (!mockTokenBalances[to]) {
      mockTokenBalances[to] = "0"
    }
    
    // Add to recipient balance
    const recipientBalance = parseFloat(mockTokenBalances[to])
    mockTokenBalances[to] = (recipientBalance + transferAmount).toString()
    
    // Generate a mock transaction hash
    const txHash = generateTransactionHash()
    
    // Record the transaction
    mockTokenTransactions.push({
      from,
      to,
      amount,
      timestamp: Date.now(),
      hash: txHash
    })
    
    // Return a mock transaction result
    return {
      transactionHash: txHash,
      isPending: false,
      isConfirmed: true,
      isFailed: false,
      receipt: {
        blockNumber: Math.floor(Math.random() * 1000000) + 10000000,
        gasUsed: "21000",
        status: true
      },
      blockExplorerUrl: `https://explore-testnet.vechain.org/transactions/${txHash}`,
      tokenType: "B3TR",
      tokenAmount: amount
    }
  }, [])
  
  // Send B3TR tokens (with mock implementation)
  const sendB3TR = useCallback(async (to: string, amount: string) => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected")
    }
    
    try {
      setIsLoading(true)
      
      // First check if this should be a mock transaction (always for now)
      const result = await mockTransferTokens(address, to, amount)
      
      setIsLoading(false)
      return result
    } catch (err) {
      console.error("Error sending B3TR:", err)
      setIsLoading(false)
      throw err
    }
  }, [isConnected, address, mockTransferTokens])
  
  // Call a contract method (read-only, mock implementation)
  const call = useCallback(async (methodName: string, args: any[] = [], options: ContractCallOptions = {}) => {
    try {
      setIsLoading(true)
      
      // Mock implementation for specific methods
      if (methodName === "balanceOf" && args.length > 0) {
        const address = args[0]
        const balance = mockTokenBalances[address] || "0"
        // Convert to Wei format (assuming 18 decimals)
        const balanceInWei = BigInt(Math.floor(parseFloat(balance) * 1e18)).toString()
        
        setIsLoading(false)
        return [balanceInWei]
      }
      
      if (methodName === "name") {
        setIsLoading(false)
        return ["Better Earth Token"]
      }
      
      if (methodName === "symbol") {
        setIsLoading(false)
        return ["B3TR"]
      }
      
      if (methodName === "decimals") {
        setIsLoading(false)
        return [18]
      }
      
      if (methodName === "totalSupply") {
        setIsLoading(false)
        return ["1000000000000000000000000000"] // 1 billion tokens
      }
      
      // Default mock response
      setIsLoading(false)
      return ["0"]
    } catch (err) {
      console.error(`Error calling ${methodName}:`, err)
      setError(`Failed to call ${methodName}`)
      setIsLoading(false)
      throw err
    }
  }, [])
  
  // Send a transaction to the contract (mock implementation)
  const send = useCallback(async (methodName: string, args: any[] = [], options: ContractCallOptions = {}) => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected")
    }
    
    try {
      setIsLoading(true)
      
      // Mock implementation for token transfer
      if (methodName === "transfer" && args.length >= 2) {
        const to = args[0]
        const amount = args[1].toString()
        // Convert from Wei to token amount (assuming 18 decimals)
        const tokenAmount = (parseFloat(amount) / 1e18).toString()
        
        const result = await mockTransferTokens(address, to, tokenAmount)
        
        setIsLoading(false)
        return result
      }
      
      // Default mock transaction response
      const txHash = generateTransactionHash()
      
      setIsLoading(false)
      return {
        transactionHash: txHash,
        isPending: false,
        isConfirmed: true,
        isFailed: false,
        receipt: {
          blockNumber: Math.floor(Math.random() * 1000000) + 10000000,
          gasUsed: "21000",
          status: true
        },
        blockExplorerUrl: `https://explore-testnet.vechain.org/transactions/${txHash}`
      }
    } catch (err) {
      console.error(`Error sending ${methodName}:`, err)
      setError(`Failed to send ${methodName}`)
      setIsLoading(false)
      throw err
    }
  }, [isConnected, address, mockTransferTokens])
  
  // Get all B3TR transactions for an address
  const getB3TRTransactions = useCallback((userAddress: string) => {
    if (!userAddress) return []
    
    return mockTokenTransactions.filter(tx => 
      tx.from === userAddress || tx.to === userAddress
    )
  }, [])
  
  return {
    contract,
    isLoading,
    error,
    call,
    send,
    // B3TR token specific functions
    B3TR_CONTRACT_ADDRESS,
    loadB3TRInfo,
    getB3TRBalance,
    sendB3TR,
    tokenInfo,
    getB3TRTransactions,
    // For testing/admin
    _mockTokenBalances: mockTokenBalances,
    _setMockBalance: (address: string, balance: string) => {
      mockTokenBalances[address] = balance
    }
  }
} 