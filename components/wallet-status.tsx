"use client"

import { useWallet } from "@/providers/wallet-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function WalletStatus() {
  const { isConnected, account, balance, network, chainId, isDemo, isWalletAvailable } = useWallet()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Status</CardTitle>
        <CardDescription>Current connection status and wallet information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Mode:</span>
          <Badge variant={isDemo ? "outline" : "default"} className="font-mono">
            {isDemo ? "DEMO MODE" : "REAL WALLET"}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Wallet Available:</span>
          <Badge variant={isWalletAvailable ? "default" : "secondary"} className="font-mono">
            {isWalletAvailable ? "YES" : "NO"}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Connection Status:</span>
          <Badge variant={isConnected ? "default" : "secondary"} className="font-mono">
            {isConnected ? "CONNECTED" : "DISCONNECTED"}
          </Badge>
        </div>

        {isConnected && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Account:</span>
              <span className="font-mono text-xs truncate max-w-[200px]">{account}</span>
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

