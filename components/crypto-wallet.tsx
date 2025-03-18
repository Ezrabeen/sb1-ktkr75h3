"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useWallet } from "@/contexts/wallet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRCode } from "@/components/ui/qr-code"
import { CopyButton } from "@/components/ui/copy-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Wallet, SendIcon, AlertTriangle, Check, QrCode, RefreshCw, PlaneIcon as PaperPlaneIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export function CryptoWallet() {
  const { user, updateB3TRBalance } = useAuth()
  const { isConnected, account, balance, network = "unknown" } = useWallet()
  const { toast } = useToast()

  // State for different wallet operations
  const [activeTab, setActiveTab] = useState("receive")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [conversionRate, setConversionRate] = useState(0.5) // 1 VET = 0.5 B3TR (example)
  const [b3trBalance, setB3trBalance] = useState(user?.b3trBalance || 0)

  // Success transaction dialog
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successDetails, setSuccessDetails] = useState<{
    amount: number
    recipient: string
    timestamp: string
    txHash: string
  } | null>(null)

  // Update B3TR balance when user changes
  useEffect(() => {
    if (user?.b3trBalance) {
      setB3trBalance(user.b3trBalance)
    }
  }, [user])

  // Format network name with proper capitalization
  const formatNetworkName = (networkName: string) => {
    if (!networkName) return "Unknown"
    return networkName.charAt(0).toUpperCase() + networkName.slice(1)
  }

  // Ensure we have a valid wallet address for QR codes
  const safeWalletAddress = account || user?.walletAddress || ""

  // Format date for transaction details
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Handle send transaction
  const handleSendTransaction = async () => {
    if (!recipientAddress || !sendAmount) {
      toast({
        title: "Invalid input",
        description: "Please enter a recipient address and amount",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(sendAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      })
      return
    }

    if (amount > b3trBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough B3TR tokens for this transaction",
        variant: "destructive",
      })
      return
    }

    // Start sending animation
    setIsSending(true)

    try {
      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update B3TR balance
      const newBalance = b3trBalance - amount
      setB3trBalance(newBalance)
      updateB3TRBalance(newBalance)

      // Generate a random transaction hash
      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

      // Show success message
      toast({
        title: "Transaction successful! ✅",
        description: `Successfully sent ${amount} B3TR to ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(recipientAddress.length - 4)}`,
        variant: "success",
      })

      // Set success details for dialog
      setSuccessDetails({
        amount,
        recipient: recipientAddress,
        timestamp: new Date().toISOString(),
        txHash,
      })
      setShowSuccessDialog(true)

      // Reset form
      setRecipientAddress("")
      setSendAmount("")
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: "There was an error processing your transaction",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  // Handle max button click
  const handleMaxClick = () => {
    setSendAmount(b3trBalance.toString())
  }

  // Handle percentage button click
  const handlePercentageClick = (percentage: number) => {
    const amount = (b3trBalance * percentage).toFixed(2)
    setSendAmount(amount)
  }

  // Refresh conversion rate
  const refreshConversionRate = () => {
    // Simulate API call to get new conversion rate
    const newRate = 0.5 + (Math.random() * 0.2 - 0.1) // Random rate between 0.4 and 0.6
    setConversionRate(Number.parseFloat(newRate.toFixed(4)))

    toast({
      title: "Conversion rate updated",
      description: `New rate: 1 VET = ${newRate.toFixed(4)} B3TR`,
    })
  }

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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Cryptocurrency Wallet
          </CardTitle>
          <CardDescription>Manage your crypto assets, send and receive tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Wallet Address</span>
              <div className="flex items-center gap-2">
                <CopyButton
                  value={safeWalletAddress}
                  className="h-8 w-8"
                  onCopy={() => {
                    toast({
                      title: "Address copied",
                      description: "Wallet address copied to clipboard",
                    })
                  }}
                />
                <div className="h-8 w-8 flex items-center justify-center">
                  <QrCode className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="font-mono text-sm break-all">{safeWalletAddress}</div>

            <div className="mt-4 flex flex-col items-center justify-center p-4 bg-white rounded-lg">
              <QRCode value={safeWalletAddress} size={200} />
              <p className="mt-2 text-sm text-muted-foreground">Scan to copy address</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">VET Balance</p>
                  <p className="text-2xl font-bold">{balance} VET</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Network</p>
                  <p className="text-sm font-medium">{formatNetworkName(network)}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">B3TR Balance</p>
                  <p className="text-2xl font-bold">{b3trBalance.toFixed(2)} B3TR</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">1 VET = {conversionRate} B3TR</p>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={refreshConversionRate}>
                    <RefreshCw className="h-3 w-3" />
                    <span className="sr-only">Refresh rate</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="receive" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="receive">Receive</TabsTrigger>
              <TabsTrigger value="send">Send</TabsTrigger>
            </TabsList>

            <TabsContent value="receive" className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                <QRCode value={safeWalletAddress} size={240} />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Scan this QR code or copy the address below to receive funds
                </p>
                <div className="mt-4 w-full flex items-center gap-2">
                  <Input value={safeWalletAddress} readOnly className="font-mono text-sm" />
                  <CopyButton
                    value={safeWalletAddress}
                    onCopy={() => {
                      toast({
                        title: "Address copied",
                        description: "Wallet address copied to clipboard",
                      })
                    }}
                  />
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Make sure to verify the address before sending any funds. Transactions cannot be reversed once
                  confirmed.
                </AlertDescription>
              </Alert>
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
                    disabled={isSending}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="amount">Amount (B3TR)</Label>
                    <span className="text-sm text-muted-foreground">Available: {b3trBalance.toFixed(2)} B3TR</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.0"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      disabled={isSending}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" onClick={handleMaxClick} disabled={isSending}>
                      Max
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePercentageClick(0.25)}
                    disabled={isSending}
                  >
                    25%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePercentageClick(0.5)}
                    disabled={isSending}
                  >
                    50%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePercentageClick(0.75)}
                    disabled={isSending}
                  >
                    75%
                  </Button>
                </div>

                <Button
                  className="w-full relative"
                  onClick={handleSendTransaction}
                  disabled={
                    isSending ||
                    !recipientAddress ||
                    !sendAmount ||
                    Number.parseFloat(sendAmount) <= 0 ||
                    Number.parseFloat(sendAmount) > b3trBalance
                  }
                >
                  {isSending ? (
                    <div className="flex items-center justify-center">
                      <PaperPlaneIcon
                        className={cn("h-5 w-5 mr-2 transition-transform duration-1000", isSending && "animate-fly")}
                      />
                      Sending...
                    </div>
                  ) : (
                    <>
                      <SendIcon className="mr-2 h-4 w-4" />
                      Send B3TR
                    </>
                  )}
                </Button>

                {Number.parseFloat(sendAmount) > b3trBalance && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Insufficient balance</AlertTitle>
                    <AlertDescription>You don't have enough B3TR tokens for this transaction.</AlertDescription>
                  </Alert>
                )}
              </div>

              <Alert className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Transaction Information</AlertTitle>
                <AlertDescription>
                  <p>Transactions typically take 10-30 seconds to confirm on the VeChain network.</p>
                  <p className="mt-1">Network fee: 0.001 VET</p>
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Transaction Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <Check className="mr-2 h-5 w-5" />
              Transaction Successful
            </DialogTitle>
            <DialogDescription>Your B3TR tokens have been sent successfully.</DialogDescription>
          </DialogHeader>

          {successDetails && (
            <div className="py-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="font-medium">{successDetails.amount} B3TR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Recipient:</span>
                    <span className="font-mono text-sm truncate max-w-[200px]">
                      {successDetails.recipient.substring(0, 6)}...
                      {successDetails.recipient.substring(successDetails.recipient.length - 4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Time:</span>
                    <span>{formatDate(successDetails.timestamp)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div>
                    <span className="text-sm text-muted-foreground">Transaction Hash:</span>
                    <div className="font-mono text-xs break-all mt-1">{successDetails.txHash}</div>
                  </div>
                </div>

                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Transaction Confirmed</AlertTitle>
                  <AlertDescription>Your transaction has been confirmed on the VeChain network.</AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

