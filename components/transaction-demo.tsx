"use client"

import type React from "react"

import { useState } from "react"
import { useWallet } from "@/providers/wallet-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useDemoWallet } from "@/providers/demo-wallet-provider"

export function TransactionDemo() {
  const { isConnected, isDemo } = useWallet()
  const demoWallet = useDemoWallet()

  const [recipient, setRecipient] = useState("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")
  const [amount, setAmount] = useState("10")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [txStatus, setTxStatus] = useState<"pending" | "success" | "error" | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !isDemo) return

    setIsSubmitting(true)
    setTxStatus("pending")

    try {
      // Use the demo wallet's sendTransaction method
      const result = await demoWallet.sendTransaction(recipient, amount)
      setTxHash(result.hash)

      // Simulate transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setTxStatus("success")
    } catch (error) {
      console.error("Transaction error:", error)
      setTxStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected || !isDemo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demo Transactions</CardTitle>
          <CardDescription>Connect to the demo wallet to try simulated transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Please connect to the demo wallet first to access this feature.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo Transactions</CardTitle>
        <CardDescription>Send simulated transactions with your demo wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (VET)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.1"
              step="0.1"
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Send Transaction"
            )}
          </Button>
        </form>

        {txStatus && (
          <div
            className={`mt-4 p-3 rounded-md ${
              txStatus === "success"
                ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
                : txStatus === "error"
                  ? "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
                  : "bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
            }`}
          >
            <div className="flex items-start">
              {txStatus === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : txStatus === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              ) : (
                <Loader2 className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 animate-spin" />
              )}
              <div>
                <p
                  className={`font-medium ${
                    txStatus === "success"
                      ? "text-green-700 dark:text-green-300"
                      : txStatus === "error"
                        ? "text-red-700 dark:text-red-300"
                        : "text-yellow-700 dark:text-yellow-300"
                  }`}
                >
                  {txStatus === "success"
                    ? "Transaction Successful"
                    : txStatus === "error"
                      ? "Transaction Failed"
                      : "Transaction Pending"}
                </p>
                {txHash && (
                  <p className="text-sm font-mono break-all mt-1 text-gray-600 dark:text-gray-400">{txHash}</p>
                )}
                <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                  This is a simulated transaction in demo mode. No real assets were transferred.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-gray-500">
        Demo mode: All transactions are simulated and no real assets are involved.
      </CardFooter>
    </Card>
  )
}

