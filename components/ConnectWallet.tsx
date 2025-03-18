"use client"

import { useState } from "react"
import { useVeWorld } from "@/providers/veworld-provider"

export function ConnectWallet() {
  const { isConnected, account, balance, connect, disconnect, chainId } = useVeWorld()

  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await connect()
    } catch (error) {
      console.error("Connection error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const formatAccount = (account: string) => {
    return `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
  }

  const getNetworkName = (chainId: number | null) => {
    if (!chainId) return "Unknown"

    // Check for Thor network chain IDs
    switch (chainId) {
      case 39:
        return "Thor Mainnet"
      case 40:
        return "Thor Testnet"
      default:
        return `Network (${chainId})`
    }
  }

  return (
    <div className="p-5 border rounded-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>

      {isConnected ? (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Account:</span>
            <span className="font-mono">{formatAccount(account || "")}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Network:</span>
            <span>{getNetworkName(chainId)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Balance:</span>
            <span>{balance} VET</span>
          </div>

          <button
            onClick={handleDisconnect}
            className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Connecting..." : "Connect VeWorld Wallet"}
        </button>
      )}
    </div>
  )
}

