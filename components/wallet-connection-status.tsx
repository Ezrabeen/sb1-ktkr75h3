"use client"

import { useVeWorld } from "@/providers/veworld-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function WalletConnectionStatus() {
  const { isConnected, account, balance, network, chainId, connectionState, detectWallet } = useVeWorld()

  const walletDetected = detectWallet()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Wallet Connection Status</CardTitle>
        <CardDescription>Use this debug information to check your connection to VeChain.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Wallet Detected:</span>
          <Badge variant={walletDetected ? "default" : "destructive"} className="font-mono">
            {walletDetected ? "YES" : "NO"}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Connection State:</span>
          <Badge
            variant={
              connectionState === "connected"
                ? "default"
                : connectionState === "connecting"
                  ? "outline"
                  : connectionState === "error"
                    ? "destructive"
                    : "secondary"
            }
            className="font-mono"
          >
            {connectionState.toUpperCase()}
          </Badge>
        </div>

        {isConnected && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Account:</span>
              <span className="font-mono text-xs">{account}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Network:</span>
              <Badge
                variant={network === "mainnet" ? "default" : network === "testnet" ? "outline" : "secondary"}
                className="font-mono"
              >
                {network.toUpperCase()} {chainId && `(${chainId})`}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Balance:</span>
              <span className="font-mono">{balance} VET</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

