"use client"

import type React from "react"

import { useState } from "react"
import { useVeChain } from "@/providers/VeChainProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { formatWalletAddress } from "@/lib/utils"

export function TransactionDemo() {
  const { account, sendTransaction, isConnected } = useVeChain()

  const [recipient, setRecipient] = useState("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")
  const [amount, setAmount] = useState("10")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txStatus, setTxStatus] = useState<"pending" | "success" | "error" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !account) {
      setError("Please connect your wallet first")
      return
    }

    setIsSubmitting(true)
    setTxStatus("pending")

    try {
      // Convert amount to wei (1 VET = 10^18 wei)
      const valueInWei = `0x${(Number(amount) * 1e18).toString(16)}`
      
      console.log("Sending transaction on testnet:", {
        from: account,
        to: recipient,
        value: valueInWei
      })

      // Create the transaction clause
      const clause = {
        to: recipient,
        value: valueInWei,
        data: "0x" // No data for simple transfer
      }

      // Send transaction
      const hash = await sendTransaction([clause])
      console.log("Transaction sent! Hash:", hash)
      setTxHash(hash)

      // Simulate transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setTxStatus("success")
    } catch (err: any) {
      console.error("Transaction error:", err)
      setError(err.message || "Failed to send transaction")
      setTxStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>VeChain Testnet Transactions</CardTitle>
        <CardDescription>Send test transactions on VeChain Thor testnet</CardDescription>
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

          <Button type="submit" disabled={isSubmitting || !isConnected} className="w-full">
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

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
              <div className="flex-1">
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
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Transaction Hash:</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => copyToClipboard(txHash)}
                          title="Copy to clipboard"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => window.open(`https://explore-testnet.vechain.org/transactions/${txHash}`, '_blank')}
                          title="View on explorer"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="sr-only">View on explorer</span>
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm font-mono break-all text-gray-600 dark:text-gray-400">{txHash}</p>
                    {isCopied && <Badge className="mt-1">Copied!</Badge>}
                  </div>
                )}
                
                {txStatus === "success" && (
                  <a 
                    href={`https://explore-testnet.vechain.org/transactions/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs mt-2 flex items-center text-primary hover:underline"
                  >
                    View on VeChain Explorer
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-gray-500">
        Using testnet: All transactions use test VET tokens with no real value.
      </CardFooter>
    </Card>
  )
}

