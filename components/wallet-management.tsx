"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRCode } from "@/components/ui/qr-code"
import { CopyButton } from "@/components/ui/copy-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Wallet, Send, Download, Eye, EyeOff, AlertTriangle, Check, Copy, QrCode, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export function WalletManagement() {
  const { isConnected, account, balance, network = "unknown" } = useWallet()

  // State for different wallet operations
  const [activeTab, setActiveTab] = useState("receive")
  const [showQRCode, setShowQRCode] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [destinationWallet, setDestinationWallet] = useState("")
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Format network name with proper capitalization
  const formatNetworkName = (networkName: string) => {
    if (!networkName) return "Unknown"
    return networkName.charAt(0).toUpperCase() + networkName.slice(1)
  }

  // Mock mnemonic phrase - in a real app, this would be securely stored and retrieved
  const mnemonicPhrase = "abandon ability able about above absent absorb abstract absurd abuse access accident"

  // Handle send transaction
  const handleSendTransaction = () => {
    // In a real app, this would initiate a blockchain transaction
    console.log("Sending", sendAmount, "to", recipientAddress)
    // Reset form
    setRecipientAddress("")
    setSendAmount("")
  }

  // Handle withdrawal
  const handleWithdraw = () => {
    // Show confirmation dialog
    setShowWithdrawConfirm(true)
  }

  // Confirm withdrawal
  const confirmWithdrawal = () => {
    // In a real app, this would initiate a withdrawal transaction
    console.log("Withdrawing", withdrawAmount, "to", destinationWallet)
    // Close dialog and reset form
    setShowWithdrawConfirm(false)
    setWithdrawAmount("")
    setDestinationWallet("")
  }

  // Handle copy mnemonic
  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonicPhrase)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Ensure we have a valid wallet address for QR codes
  const safeWalletAddress = account || "No wallet address available"

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please connect your wallet to manage your funds</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Wallet Management
        </CardTitle>
        <CardDescription>Manage your wallet, send and receive funds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Wallet Address</span>
            <div className="flex items-center gap-2">
              <CopyButton value={safeWalletAddress} className="h-8 w-8" />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowQRCode(!showQRCode)}>
                <QrCode className="h-4 w-4" />
                <span className="sr-only">Show QR Code</span>
              </Button>
            </div>
          </div>
          <div className="font-mono text-sm break-all">{safeWalletAddress}</div>

          {showQRCode && (
            <div className="mt-4 flex flex-col items-center justify-center p-4 bg-white rounded-lg">
              <QRCode value={safeWalletAddress} size={200} />
              <p className="mt-2 text-sm text-muted-foreground">Scan to copy address</p>
            </div>
          )}
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold">{balance} VET</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Network</p>
            <p className="text-sm font-medium">{formatNetworkName(network)}</p>
          </div>
        </div>

        <Tabs defaultValue="receive" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="receive">Receive</TabsTrigger>
            <TabsTrigger value="send">Send</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>

          <TabsContent value="receive" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
              <QRCode value={safeWalletAddress} size={240} />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Scan this QR code or copy the address below to receive funds
              </p>
              <div className="mt-4 w-full flex items-center gap-2">
                <Input value={safeWalletAddress} readOnly className="font-mono text-sm" />
                <CopyButton value={safeWalletAddress} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="send" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (VET)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleSendTransaction} disabled={!recipientAddress || !sendAmount}>
                <Send className="mr-2 h-4 w-4" />
                Send Transaction
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount to Withdraw (VET)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.0"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination Wallet</Label>
                <Input
                  id="destination"
                  placeholder="0x..."
                  value={destinationWallet}
                  onChange={(e) => setDestinationWallet(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleWithdraw} disabled={!withdrawAmount || !destinationWallet}>
                <Download className="mr-2 h-4 w-4" />
                Withdraw Funds
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Settings
            </h3>
          </div>

          <Alert
            variant="warning"
            className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Mnemonic Phrase</AlertTitle>
            <AlertDescription>
              Your mnemonic phrase is the master key to your wallet. Never share it with anyone and keep it in a safe
              place.
            </AlertDescription>
          </Alert>

          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Recovery Phrase</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowMnemonic(!showMnemonic)} className="h-8">
                  {showMnemonic ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showMnemonic ? "Hide" : "Show"}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCopyMnemonic} className="h-8" disabled={isCopied}>
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
            {showMnemonic ? (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-mono text-sm break-all">{mnemonicPhrase}</p>
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground">••••••••• ••••••••• ••••••••• •••••••••</p>
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              This 12-word phrase is the only way to recover your wallet if you lose access. Write it down and store it
              in a secure location.
            </p>
          </div>
        </div>
      </CardContent>

      {/* Withdrawal Confirmation Dialog */}
      <Dialog open={showWithdrawConfirm} onOpenChange={setShowWithdrawConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>Please review the withdrawal details before proceeding</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="font-medium">{withdrawAmount} VET</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Destination:</span>
              <span className="font-mono text-sm truncate max-w-[200px]">{destinationWallet}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Network:</span>
              <span>{formatNetworkName(network)}</span>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              {/* Only render QR code if destination wallet is not empty */}
              {destinationWallet && <QRCode value={destinationWallet} size={200} className="mx-auto" />}
              <p className="mt-2 text-center text-xs text-muted-foreground">Destination wallet QR code</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdrawConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={confirmWithdrawal}>Accept & Withdraw</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

