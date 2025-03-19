"use client"

import { useState, useEffect, useCallback } from "react"
import { useVeChainWallet } from "./use-vechain-wallet"
import { useVeChainTransaction, TransactionResult } from "./use-vechain-transaction"
import { useToast } from "./use-toast"

export type EventType = 
  | "wallet_connected" 
  | "wallet_disconnected"
  | "transaction_sent"
  | "transaction_confirmed" 
  | "transaction_failed"
  | "block_added"
  | "balance_changed"

export interface EventNotification {
  id: string
  type: EventType
  title: string
  message: string
  timestamp: number
  data?: any
  read: boolean
}

export function useVeChainEvents() {
  const { isConnected, connex, address, balance } = useVeChainWallet()
  const { transactions } = useVeChainTransaction()
  const { toast } = useToast()
  
  const [notifications, setNotifications] = useState<EventNotification[]>([])
  const [lastBalance, setLastBalance] = useState<string>("0")
  const [lastBlockId, setLastBlockId] = useState<string | null>(null)
  
  // Generate a unique ID for events
  const generateEventId = useCallback(() => {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }, [])
  
  // Add a new notification
  const addNotification = useCallback(
    (type: EventType, title: string, message: string, data?: any) => {
      const newNotification: EventNotification = {
        id: generateEventId(),
        type,
        title,
        message,
        timestamp: Date.now(),
        data,
        read: false
      }
      
      setNotifications((prev) => [newNotification, ...prev])
      
      // Also show a toast notification
      toast({
        title,
        description: message,
        variant: type.includes("failed") ? "destructive" : "default"
      })
      
      return newNotification
    },
    [generateEventId, toast]
  )
  
  // Mark a notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }, [])
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    )
  }, [])
  
  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])
  
  // Track wallet connection events
  useEffect(() => {
    if (isConnected && address) {
      addNotification(
        "wallet_connected",
        "Wallet Connected",
        `Connected to address ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        { address }
      )
    } else if (!isConnected && notifications.length > 0) {
      addNotification(
        "wallet_disconnected",
        "Wallet Disconnected",
        "Your wallet has been disconnected"
      )
    }
  }, [isConnected, address, addNotification, notifications.length])
  
  // Track balance changes
  useEffect(() => {
    if (isConnected && balance !== lastBalance) {
      // Only notify if this isn't the first balance update
      if (lastBalance !== "0") {
        const balanceChange = Number(balance) - Number(lastBalance)
        const formattedChange = balanceChange >= 0 ? `+${balanceChange}` : `${balanceChange}`
        
        addNotification(
          "balance_changed",
          "Balance Updated",
          `Your balance changed by ${formattedChange} VET`,
          { previousBalance: lastBalance, newBalance: balance, change: balanceChange }
        )
      }
      
      setLastBalance(balance)
    }
  }, [isConnected, balance, lastBalance, addNotification])
  
  // Track block updates
  useEffect(() => {
    if (!connex) return
    
    const trackNewBlocks = async () => {
      try {
        // Get best block
        const ticker = connex.thor.ticker()
        const block = await ticker.next()
        
        if (block.number && (!lastBlockId || block.id !== lastBlockId)) {
          console.log(`New block added: ${block.number} (${block.id})`)
          
          addNotification(
            "block_added",
            "New Block",
            `Block #${block.number} has been added to the chain`,
            { blockNumber: block.number, blockId: block.id }
          )
          
          setLastBlockId(block.id)
        }
      } catch (error) {
        console.error("Error tracking blocks:", error)
      }
    }
    
    // Start checking for new blocks
    const intervalId = setInterval(trackNewBlocks, 10000) // Every 10 seconds
    
    return () => clearInterval(intervalId)
  }, [connex, lastBlockId, addNotification])
  
  // Track transaction status changes
  useEffect(() => {
    // Check for newly confirmed or failed transactions
    Object.values(transactions).forEach((tx: TransactionResult) => {
      // Skip already processed transactions
      if (!tx.receipt || tx.receipt.meta) return
      
      if (tx.isConfirmed) {
        addNotification(
          "transaction_confirmed",
          "Transaction Confirmed",
          `Transaction ${tx.transactionHash?.substring(0, 10)}... has been confirmed`,
          { transaction: tx }
        )
      } else if (tx.isFailed) {
        addNotification(
          "transaction_failed",
          "Transaction Failed",
          `Transaction ${tx.transactionHash?.substring(0, 10)}... has failed`,
          { transaction: tx, error: tx.error }
        )
      }
    })
  }, [transactions, addNotification])
  
  // Get unread notification count
  const getUnreadCount = useCallback(() => {
    return notifications.filter((notification) => !notification.read).length
  }, [notifications])
  
  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    getUnreadCount,
    hasUnread: getUnreadCount() > 0
  }
} 