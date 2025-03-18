"use client"

import { useWallet } from "@/providers/wallet-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function TestnetBanner() {
  const { isDemo, isConnected } = useWallet()

  if (!isDemo || !isConnected) return null

  return (
    <Alert variant="warning" className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
      <AlertTitle className="text-yellow-800 dark:text-yellow-400">Testnet Environment Detected</AlertTitle>
      <AlertDescription className="text-yellow-700 dark:text-yellow-300">
        <p>
          You are currently using a <strong>simulated wallet connection</strong>. This is a prototype of ReVive and does
          not require a genuine connection to function.
        </p>
        <p className="mt-2">
          All elements are dummy replicas, including the wallet itself, B3TR tokens, VET, and all transactions. No real
          blockchain interactions are taking place.
        </p>
      </AlertDescription>
    </Alert>
  )
}

