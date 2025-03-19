"use client"

import { useState, useCallback, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'

// Mock transaction structure
export interface MockTransaction {
  transactionHash: string
  from: string
  to: string
  value: string
  data: string
  timestamp: number
  isPending: boolean
  isConfirmed: boolean
  isFailed: boolean
  receipt?: {
    blockNumber: number
    gasUsed: string
    status: boolean
  }
  blockExplorerUrl?: string
  tokenType?: "VET" | "B3TR"
  tokenAmount?: string
  comment?: string
}

// Mock contract call
export interface MockContractCall {
  contract: string
  method: string
  args: any[]
  result: any
  timestamp: number
}

// Mock event notification
export interface MockNotification {
  id: string
  title: string
  message: string
  type: string
  timestamp: number
  read: boolean
}

// Mock wallet state
export interface MockVeChainState {
  address: string
  balance: string
  b3trBalance: string
  network: "mainnet" | "testnet"
  isConnected: boolean
  connectionTime: number
}

// Mock Connex class
export interface MockConnexInstance {
  thor: {
    account: (address?: string) => any
    status: {
      head: {
        id: string
        number: number
        timestamp: number
        parentID: string
        network: string
      }
    }
  }
  vendor: {
    sign: (kind: string) => any
  }
}

// Mock Web3 class
export interface MockWeb3Instance {
  eth: {
    Contract: any
    getBalance: (address: string) => Promise<string>
    accounts: string[]
    defaultAccount: string
    utils: {
      fromWei: (value: string, unit: string) => string
      toWei: (value: string, unit: string) => string
    }
  }
}

export function useMockVeChain() {
  // Enable mock mode by default
  const [enabled] = useState(true)
  
  // State for the mock wallet
  const [state, setState] = useState<MockVeChainState>({
    address: "",
    balance: "0",
    b3trBalance: "0",
    network: "testnet",
    isConnected: false,
    connectionTime: 0
  })
  
  // Transactions record
  const [transactions, setTransactions] = useState<Record<string, MockTransaction>>({})
  
  // Contract calls record
  const [contractCalls, setContractCalls] = useState<MockContractCall[]>([])
  
  // Notifications record
  const [notifications, setNotifications] = useState<MockNotification[]>([])
  
  // Connect to mock wallet
  const connect = useCallback(async () => {
    if (state.isConnected) return state

    // Generate random address and balance
    const newAddress = `0x${Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`
    
    const newBalance = (Math.random() * 100).toFixed(2)
    const newB3trBalance = (Math.random() * 1000).toFixed(2)
    
    // Update state
    setState({
      ...state,
      isConnected: true,
      address: newAddress,
      balance: newBalance,
      b3trBalance: newB3trBalance,
      connectionTime: Date.now()
    })
    
    // Return connection info
    return {
      address: newAddress,
      balance: newBalance,
      b3trBalance: newB3trBalance,
      network: "testnet" as const // Add network property
    }
  }, [state])
  
  // Disconnect from mock wallet
  const disconnect = useCallback(() => {
    setState({
      address: "",
      balance: "0",
      b3trBalance: "0",
      network: "testnet",
      isConnected: false,
      connectionTime: 0
    })
    
    addNotification(
      "Wallet Disconnected",
      "Successfully disconnected from wallet",
      "connection"
    )
  }, [])
  
  // Get VET balance
  const getBalance = useCallback(() => {
    return state.balance
  }, [state.balance])
  
  // Get B3TR balance
  const getB3trBalance = useCallback(() => {
    return state.b3trBalance
  }, [state.b3trBalance])
  
  // Check balance based on token type
  const checkBalance = useCallback((amount: string, tokenType: "VET" | "B3TR" = "VET") => {
    const balanceToCheck = tokenType === "VET" 
      ? parseFloat(state.balance) 
      : parseFloat(state.b3trBalance)
    
    const amountValue = parseFloat(amount)
    
    return {
      isEnough: balanceToCheck >= amountValue,
      current: balanceToCheck.toString(),
      needed: amount
    }
  }, [state.balance, state.b3trBalance])
  
  // Send mock transaction
  const sendTransaction = useCallback(async (
    to: string, 
    value: string = "0x0", 
    data: string = "0x",
    options?: {
      tokenType?: "VET" | "B3TR",
      tokenAmount?: string,
      comment?: string
    }
  ) => {
    // Determine token type and amount
    const tokenType = options?.tokenType || "VET"
    const tokenAmount = options?.tokenAmount || (
      tokenType === "VET" 
        ? (parseInt(value, 16) / 1e18).toString() 
        : "0"
    )
    
    // Check if balance is sufficient
    const balanceCheck = checkBalance(tokenAmount, tokenType)
    
    if (!balanceCheck.isEnough) {
      throw new Error(`Insufficient ${tokenType} balance: ${balanceCheck.current} < ${balanceCheck.needed}`)
    }
    
    // Generate transaction hash
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`
    
    // Create pending transaction
    const pendingTx: MockTransaction = {
      transactionHash: txHash,
      from: state.address,
      to,
      value,
      data,
      timestamp: Date.now(),
      isPending: true,
      isConfirmed: false,
      isFailed: false,
      tokenType,
      tokenAmount,
      comment: options?.comment
    }
    
    // Add transaction to record
    setTransactions(prev => ({
      ...prev,
      [txHash]: pendingTx
    }))
    
    // Add notification for pending transaction
    addNotification(
      `${tokenType} Transaction Sent`,
      `Transaction ${getShortHash(txHash)} is pending`,
      "transaction"
    )
    
    // Mock transaction confirmation after delay
    const confirmDelay = Math.random() * 3000 + 2000 // 2-5 seconds
    
    return new Promise<MockTransaction>((resolve) => {
      setTimeout(() => {
        // 5% chance of failure
        const willFail = Math.random() < 0.05
        
        // Update transaction status
        const confirmedTx: MockTransaction = {
          ...pendingTx,
          isPending: false,
          isConfirmed: !willFail,
          isFailed: willFail,
          receipt: willFail ? undefined : {
            blockNumber: Math.floor(Math.random() * 10000000),
            gasUsed: `0x${Math.floor(Math.random() * 1000000).toString(16)}`,
            status: true
          },
          blockExplorerUrl: `https://explore-testnet.vechain.org/transactions/${txHash}`
        }
        
        // Update transaction in record
        setTransactions(prev => ({
          ...prev,
          [txHash]: confirmedTx
        }))
        
        // Add notification for transaction result
        if (willFail) {
          addNotification(
            `${tokenType} Transaction Failed`,
            `Transaction ${getShortHash(txHash)} has failed`,
            "transaction_error"
          )
        } else {
          addNotification(
            `${tokenType} Transaction Confirmed`,
            `Sent ${tokenAmount} ${tokenType} to ${getShortAddress(to)}`,
            "transaction_success"
          )
          
          // If transaction successful, update balance
          if (tokenType === "VET") {
            setState(prev => ({
              ...prev,
              balance: (parseFloat(prev.balance) - parseFloat(tokenAmount)).toFixed(2)
            }))
          } else {
            setState(prev => ({
              ...prev,
              b3trBalance: (parseFloat(prev.b3trBalance) - parseFloat(tokenAmount)).toFixed(2)
            }))
          }
        }
        
        resolve(confirmedTx)
      }, confirmDelay)
    })
  }, [state.address, state.balance, state.b3trBalance, checkBalance])
  
  // Call mock contract
  const callContract = useCallback(async (
    contract: string,
    method: string,
    args: any[] = []
  ): Promise<any> => {
    console.log(`Mock contract call: ${method}(${args.join(", ")})`)
    
    // Record the contract call
    const contractCall: MockContractCall = {
      contract,
      method,
      args,
      result: null,
      timestamp: Date.now()
    }
    
    // Handle different contract methods based on method name
    let result: any
    
    // Handle B3TR token contract methods
    if (method === "balanceOf") {
      // Assume the first arg is the address
      const address = args[0]
      
      // If checking balance of current user, return our mock value
      if (address === state.address) {
        result = (parseFloat(state.b3trBalance) * 1e18).toString()
      } else {
        // Random balance for other addresses
        result = (Math.random() * 10000 * 1e18).toString()
      }
    } else if (method === "transfer") {
      // token.transfer(to, amount)
      const to = args[0]
      const amount = args[1]
      
      // We'd normally handle this as a transaction
      // But for balanceOf we'll just return success
      result = true
      
      // Add a notification
      addNotification(
        "Contract Method Called",
        `Called ${method} on contract ${getShortAddress(contract)}`,
        "contract_interaction"
      )
    } else if (method === "name") {
      result = "Better Earth Token"
    } else if (method === "symbol") {
      result = "B3TR"
    } else if (method === "decimals") {
      result = "18"
    } else if (method === "totalSupply") {
      result = (1000000000 * 1e18).toString() // 1 billion tokens
    } else {
      // For any other method, just return a mock object
      result = {
        success: true,
        data: `0x${Math.random().toString(16).substring(2, 10)}`,
        timestamp: Date.now()
      }
      
      // Add a notification for generic contract call
      addNotification(
        "Contract Method Called",
        `Called ${method} on contract ${getShortAddress(contract)}`,
        "contract_interaction"
      )
    }
    
    // Update the contract call with the result
    contractCall.result = result
    
    // Save the call
    setContractCalls(prev => [...prev, contractCall])
    
    return result
  }, [state.address, state.b3trBalance])
  
  // Get mock transaction
  const getTransaction = useCallback((hash: string) => {
    return transactions[hash] || null
  }, [transactions])
  
  // Get all mock transactions
  const getAllTransactions = useCallback(() => {
    return transactions
  }, [transactions])
  
  // Add a notification
  const addNotification = useCallback((title: string, message: string, type: string) => {
    const notification: MockNotification = {
      id: uuidv4(),
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false
    }
    
    setNotifications(prev => [notification, ...prev])
  }, [])
  
  // Mark notifications as read
  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({
        ...notification,
        read: true
      }))
    )
  }, [])
  
  // Get unread notifications count
  const getUnreadNotificationsCount = useCallback(() => {
    return notifications.filter(n => !n.read).length
  }, [notifications])
  
  // Helper function to format addresses
  const getShortAddress = (address: string) => {
    if (!address || address.length < 10) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }
  
  // Helper function to format transaction hashes
  const getShortHash = (hash: string) => {
    if (!hash || hash.length < 10) return hash
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
  }
  
  // Randomly update balances (both VET and B3TR)
  const updateRandomBalance = useCallback(() => {
    // Small random balance changes to simulate blockchain activity
    // Change is between -1% and +2%
    const changePct = (Math.random() * 3 - 1) / 100
    
    setState(prev => {
      // Calculate new balances
      let newVetBalance = parseFloat(prev.balance) * (1 + changePct)
      newVetBalance = Math.max(0, newVetBalance) // Don't go below 0
      
      let newB3trBalance = parseFloat(prev.b3trBalance) * (1 + changePct)
      newB3trBalance = Math.max(0, newB3trBalance) // Don't go below 0
      
      return {
        ...prev,
        balance: newVetBalance.toFixed(2),
        b3trBalance: newB3trBalance.toFixed(2)
      }
    })
  }, [])
  
  // Create a mock Connex instance
  const getMockConnex = useCallback((): MockConnexInstance => {
    return {
      thor: {
        account: (address: string = state.address) => ({
          address,
          get: async () => ({
            balance: (parseFloat(state.balance) * 1e18).toString(16),
            energy: "0x0",
            hasCode: false
          }),
          method: (abi: any) => ({
            call: async (...args: any[]) => {
              // Mock method call
              return {
                data: `0x${Math.random().toString(16).substring(2, 66)}`,
                events: [],
                transfers: [],
                gasUsed: 21000,
                reverted: false,
                vmError: ""
              }
            }
          }),
          event: (abi: any) => ({
            filter: (criteria: any) => ({
              apply: async (range: any, options: any) => {
                // Mock events
                return []
              }
            })
          })
        }),
        status: {
          head: {
            id: `0x${Math.random().toString(16).substring(2, 66)}`,
            number: Math.floor(Math.random() * 10000000),
            timestamp: Math.floor(Date.now() / 1000),
            parentID: `0x${Math.random().toString(16).substring(2, 66)}`,
            network: "test"
          }
        }
      },
      vendor: {
        sign: (kind: string) => ({
          message: async (message: any) => {
            return {
              annex: { signer: state.address },
              signature: `0x${Math.random().toString(16).substring(2, 130)}`
            }
          },
          request: async (message: any) => {
            return {
              annex: { signer: state.address },
              signature: `0x${Math.random().toString(16).substring(2, 130)}`
            }
          }
        })
      }
    }
  }, [state.address, state.balance])
  
  // Create a mock Web3 instance
  const getMockWeb3 = useCallback((): MockWeb3Instance => {
    return {
      eth: {
        Contract: class MockContract {
          methods: any
          
          constructor(abi: any[], address: string) {
            this.methods = {}
            
            // Create mock methods based on ABI
            abi.forEach((item: any) => {
              if (item.type === "function" || item.type === undefined) {
                // Add the method to our contract
                this.methods[item.name] = (...args: any[]) => ({
                  call: async (options: any = {}) => {
                    return callContract(address, item.name, args)
                  },
                  encodeABI: () => {
                    return `0x${Math.random().toString(16).substring(2, 66)}`
                  }
                })
              }
            })
          }
        },
        getBalance: async (address: string) => {
          if (address === state.address) {
            return (parseFloat(state.balance) * 1e18).toString()
          }
          return "0"
        },
        accounts: [state.address],
        defaultAccount: state.address,
        utils: {
          fromWei: (value: string, unit: string) => {
            // Simple conversion for demo purposes
            const divisor = unit === 'ether' ? 1e18 : 1e6
            const convertedValue = (parseInt(value) / divisor).toString()
            return convertedValue
          },
          toWei: (value: string, unit: string) => {
            // Simple conversion for demo purposes
            const multiplier = unit === 'ether' ? 1e18 : 1e6
            const convertedValue = Math.floor(parseFloat(value) * multiplier).toString()
            return convertedValue
          }
        }
      }
    }
  }, [state.address, state.balance, callContract])
  
  return {
    enabled,
    state,
    connect,
    disconnect,
    sendTransaction,
    getBalance,
    getB3trBalance,
    checkBalance,
    getTransaction,
    getAllTransactions,
    callContract,
    notifications,
    addNotification,
    markAllNotificationsAsRead,
    getUnreadNotificationsCount,
    updateRandomBalance,
    getMockConnex,
    getMockWeb3,
    contractCalls
  }
} 