"use client"

import { Button } from "@/components/ui/button"
import { useVeWorld } from "@/providers/veworld-provider"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useState } from "react"

export function ConnectWalletButton() {
  const { isConnected, connect, disconnect, isLoading, detectWallet } = useVeWorld()
  const [showNoWalletDialog, setShowNoWalletDialog] = useState(false)

  const handleConnectClick = async () => {
    if (isConnected) {
      disconnect()
      return
    }

    if (!detectWallet()) {
      setShowNoWalletDialog(true)
      return
    }

    await connect()
  }

  return (
    <>
      <Button
        onClick={handleConnectClick}
        disabled={isLoading}
        variant={isConnected ? "outline" : "default"}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : isConnected ? (
          "Disconnect Wallet"
        ) : (
          "Connect Wallet"
        )}
      </Button>

      <Dialog open={showNoWalletDialog} onOpenChange={setShowNoWalletDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>VeWorld Wallet Not Detected</DialogTitle>
            <DialogDescription>You need to install VeWorld wallet to connect to this application.</DialogDescription>
          </DialogHeader>
          <p className="py-4">
            VeWorld is the official wallet for the VeChain blockchain. You can download it from the official website.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoWalletDialog(false)}>
              Cancel
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

