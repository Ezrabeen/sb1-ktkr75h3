"use client"

import { useState } from "react"
import { useWallet } from "@/providers/wallet-provider"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function ConnectWallet() {
  const { isConnected, account, balance, connect, disconnect, network, isLoading, isDemo, isWalletAvailable } =
    useWallet()

  const [showNoWalletDialog, setShowNoWalletDialog] = useState(false)

  const handleConnect = async () => {
    if (!isWalletAvailable && !isDemo) {
      setShowNoWalletDialog(true)
      return
    }

    try {
      await connect()
    } catch (error) {
      console.error("Connection error:", error)
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const formatAccount = (account: string) => {
    return `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
  }

  const getNetworkName = (network: string) => {
    switch (network) {
      case "mainnet":
        return "Thor Mainnet"
      case "testnet":
        return "Thor Testnet"
      default:
        return "Unknown Network"
    }
  }

  return (
    <>
      {isConnected ? (
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center mr-2">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                network === "mainnet" ? "bg-green-500" : network === "testnet" ? "bg-yellow-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {isDemo ? "Demo " : ""}
              {getNetworkName(network)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="border-gray-300 text-gray-700 hover:text-primary hover:border-primary"
          >
            {formatAccount(account || "")}
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleConnect}
          disabled={isLoading}
          className="border-primary text-primary hover:bg-primary hover:text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : isDemo ? (
            "Connect Demo Wallet"
          ) : (
            "Connect Wallet"
          )}
        </Button>
      )}

      {/* Dialog for when VeWorld wallet is not detected */}
      <Dialog open={showNoWalletDialog} onOpenChange={setShowNoWalletDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-amber-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              VeWorld Wallet Not Detected
            </DialogTitle>
            <DialogDescription>You need to install VeWorld wallet to connect to this application.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-4">
              VeWorld is the official wallet for the VeChain blockchain. You can download it as a browser extension or
              mobile app.
            </p>
            <a
              href="https://www.veworld.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline"
            >
              Download VeWorld Wallet
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoWalletDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                window.open("https://www.veworld.net/", "_blank")
                setShowNoWalletDialog(false)
              }}
            >
              Visit VeWorld Website
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

