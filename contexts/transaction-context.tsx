"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useToken } from "./token-context"

export interface Transaction {
  id: string
  orderId: string
  productId: string
  productName: string
  productImage: string
  productLink: string
  price: number
  currency: string
  tokensEarned: number
  timestamp: number
  txHash: string
  status: "completed" | "pending" | "failed"
  marketplace: "ebay" | "vinted" | "etsy" | "other"
  category: string
}

interface TransactionContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp" | "txHash" | "status">) => Promise<Transaction>
  getTransactionById: (id: string) => Transaction | undefined
}

const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  addTransaction: async () => ({}) as Transaction,
  getTransactionById: () => undefined,
})

export const useTransaction = () => useContext(TransactionContext)

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const { addTokens, calculateIncentive } = useToken()

  const generateOrderId = () => {
    return `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  }

  const generateTxHash = () => {
    return `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
  }

  const addTransaction = async (
    transactionData: Omit<Transaction, "id" | "timestamp" | "txHash" | "status">,
  ): Promise<Transaction> => {
    // Calculate token incentive based on price and category
    const tokensEarned = calculateIncentive(transactionData.price, transactionData.category)

    // Create new transaction
    const newTransaction: Transaction = {
      ...transactionData,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      txHash: generateTxHash(),
      status: "completed",
      tokensEarned,
    }

    // Simulate transaction processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Add tokens to balance
    addTokens(tokensEarned)

    // Add transaction to history
    setTransactions((prev) => [newTransaction, ...prev])

    return newTransaction
  }

  const getTransactionById = (id: string) => {
    return transactions.find((tx) => tx.id === id)
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        getTransactionById,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

