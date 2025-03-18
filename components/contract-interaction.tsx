"use client"

import type React from "react"

import { useState } from "react"
import { useVeWorld } from "./veworld-provider"
import { getContract, transferTokens } from "@/lib/contract-utils"

export function ContractInteraction() {
  const { isConnected, signer } = useVeWorld()
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !signer) {
      setError("Please connect your wallet first")
      return
    }

    setIsLoading(true)
    setError("")
    setTxHash("")

    try {
      // Validate inputs
      if (!recipient || !amount) {
        throw new Error("Please provide both recipient address and amount")
      }

      if (!recipient.startsWith("0x") || recipient.length !== 42) {
        throw new Error("Invalid recipient address")
      }

      const amountValue = Number.parseFloat(amount)
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Amount must be a positive number")
      }

      // Get contract instance
      const contract = await getContract(signer)

      // Execute the transfer
      const tx = await transferTokens(contract, recipient, amount)

      // Update UI with tx hash
      setTxHash(tx.hash)

      // Reset form
      setRecipient("")
      setAmount("")
    } catch (err: any) {
      setError(err.message || "An error occurred during the transaction")
      console.error("Transaction error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-5 border rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-4">Contract Interaction</h2>

      {!isConnected ? (
        <p className="text-amber-600">Please connect your wallet to interact with the contract</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
              Recipient Address
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Send Transaction"}
          </button>

          {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          {txHash && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              <p>Transaction successful!</p>
              <p className="font-mono break-all text-xs mt-1">Hash: {txHash}</p>
            </div>
          )}
        </form>
      )}
    </div>
  )
}

