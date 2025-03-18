"use client"

import { useWallet } from "@/providers/wallet-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function WalletActions() {
  const { isConnected, connect, disconnect, isLoading, isDemo } = useWallet()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Actions</CardTitle>
        <CardDescription>Connect or disconnect your {isDemo ? "demo" : ""} wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={isConnected ? disconnect : connect} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isConnected ? "Disconnecting..." : "Connecting..."}
            </>
          ) : isConnected ? (
            "Disconnect Wallet"
          ) : (
            `Connect ${isDemo ? "Demo " : ""}Wallet`
          )}
        </Button>

        {isDemo && isConnected && (
          <p className="mt-4 text-sm text-amber-600 dark:text-amber-400">
            You are using a demo wallet. All transactions are simulated and no real assets are involved.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

