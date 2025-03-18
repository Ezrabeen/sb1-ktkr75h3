"use client"

import { useState, useEffect } from "react"
import { useVeWorld } from "@/providers/veworld-provider"
import { getTransactions } from "@/services/transactions"
import { getRewards } from "@/services/rewards"

type Transaction = {
  id: string
  type: "buy" | "sell"
  amount: string
  timestamp: number
  status: "completed" | "pending" | "failed"
  itemName?: string
}

type Reward = {
  id: string
  amount: string
  reason: string
  timestamp: number
}

export function ProfileClient() {
  const { isConnected, account, balance } = useVeWorld()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [activeTab, setActiveTab] = useState<"transactions" | "rewards">("transactions")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!isConnected || !account) return

      try {
        setIsLoading(true)
        const [txData, rewardData] = await Promise.all([getTransactions(account), getRewards(account)])

        setTransactions(txData)
        setRewards(rewardData)
      } catch (error) {
        console.error("Error loading profile data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isConnected, account])

  if (!isConnected) {
    return (
      <div className="text-center py-10">
        <p className="text-xl mb-4">Please connect your wallet to view your profile</p>
        <p>You need to connect your VeWorld wallet to see your transactions and rewards.</p>
      </div>
    )
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary-600">Account Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
            <p className="font-mono break-all">{account}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
            <p className="text-xl font-bold">{balance} VET</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "transactions"
                  ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("rewards")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "rewards"
                  ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Rewards
            </button>
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <p className="text-center py-4">Loading...</p>
          ) : activeTab === "transactions" ? (
            transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              tx.type === "buy"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {tx.type.toUpperCase()}
                          </span>
                          {tx.itemName && <span className="ml-2 text-sm">{tx.itemName}</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{tx.amount} VET</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(tx.timestamp)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              tx.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : tx.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {tx.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4">No transactions found</p>
            )
          ) : rewards.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Reward
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {rewards.map((reward) => (
                    <tr key={reward.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                          REWARD
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{reward.amount} VET</td>
                      <td className="px-6 py-4 whitespace-nowrap">{reward.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(reward.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4">No rewards found</p>
          )}
        </div>
      </div>
    </div>
  )
}

