"use client"

import { useState } from "react"
import { 
  useVeChainWallet, 
  useVeChainTransaction, 
  useVeChainEvents 
} from "@/hooks"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { 
  Wallet, 
  Send, 
  CircleAlert, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  ExternalLink,
  Bell, 
  Coins,
  ShoppingBag
} from "lucide-react"

// Mock items for demo purchase
const MOCK_ITEMS = [
  { id: '1', name: 'Eco-friendly Water Bottle', price: '10', image: '🍶' },
  { id: '2', name: 'Sustainable T-shirt', price: '20', image: '👕' },
  { id: '3', name: 'Recycled Paper Notebook', price: '5', image: '📓' }
]

export function VeChainWalletDemo() {
  const { toast } = useToast()
  
  // Use our custom hooks
  const { 
    isConnected, 
    address, 
    balance, 
    network, 
    connect, 
    disconnect, 
    getFormattedAddress, 
    connectionDuration,
    checkWalletAvailability,
    isTestnet
  } = useVeChainWallet()
  
  const { 
    sendTransaction, 
    getTransaction, 
    getAllTransactions, 
    transactions,
    getB3trBalance,
    b3trBalance,
    checkBalance,
    purchaseItem
  } = useVeChainTransaction()
  
  const {
    notifications,
    hasUnread,
    getUnreadCount,
    markAllAsRead
  } = useVeChainEvents()
  
  // State for transaction form
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [tokenType, setTokenType] = useState<"VET" | "B3TR">("VET")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txResult, setTxResult] = useState<any>(null)
  const [balanceError, setBalanceError] = useState<string | null>(null)
  
  // State for purchase demo
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [selectedTokenForPurchase, setSelectedTokenForPurchase] = useState<"VET" | "B3TR">("VET")
  
  // Helper function to format an address for display
  const getShortAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }
  
  // Handle wallet connection
  const handleConnect = async () => {
    const isAvailable = checkWalletAvailability()
    
    if (!isAvailable) {
      toast({
        title: "Wallet Not Detected",
        description: "VeChain wallet not detected. We'll use a mock wallet for this demo.",
        variant: "default"
      })
    }
    
    await connect()
    
    // Get B3TR balance after connection
    if (isConnected) {
      await getB3trBalance()
    }
  }
  
  // Handle token type selection
  const handleTokenTypeChange = (value: string) => {
    setTokenType(value as "VET" | "B3TR")
    setAmount("")
    setBalanceError(null)
  }
  
  // Handle amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    
    // Check if amount is valid
    if (e.target.value) {
      const amountToSend = parseFloat(e.target.value)
      
      if (isNaN(amountToSend) || amountToSend <= 0) {
        setBalanceError("Please enter a valid amount")
      } else {
        // Check if balance is sufficient
        const hasEnough = tokenType === "VET" 
          ? parseFloat(balance) >= amountToSend 
          : parseFloat(b3trBalance) >= amountToSend
          
        if (!hasEnough) {
          setBalanceError(`Insufficient ${tokenType} balance`)
        } else {
          setBalanceError(null)
        }
      }
    } else {
      setBalanceError(null)
    }
  }
  
  // Handle transaction submission
  const handleSendTransaction = async () => {
    if (!recipient || !amount) {
      alert("Please enter recipient address and amount")
      return
    }
    
    if (balanceError) {
      alert(balanceError)
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Prepare a clear comment/description for the transaction
      // This will be shown in the wallet dialog
      const comment = `Send ${amount} ${tokenType} from Better Earth marketplace for sustainability project funding`
      
      // Send the transaction with token type and amount
      const result = await sendTransaction(
        recipient,
        "0x0", // Value is determined by token type and amount
        "0x",  // No data for simple transfers
        {
          tokenType,
          tokenAmount: amount,
          comment,
          gasPriceCoef: 128, // Default gas price coefficient
          purpose: "transfer"
        }
      )
      
      console.log("Transaction result:", result)
      setTxResult(result)
      
      // Reset form
      setRecipient("")
      setAmount("")
      
      // Display success feedback
      if (!result.isPending && result.isConfirmed) {
        // Transaction was confirmed immediately (mock mode)
        toast({
          title: "Transaction Confirmed",
          description: `Successfully sent ${amount} ${tokenType} to ${getShortAddress(recipient)}`,
          variant: "success"
        })
      } else if (result.isPending) {
        // Transaction is pending (real mode)
        toast({
          title: "Transaction Submitted",
          description: `Your transaction is being processed. It may take a few moments to confirm.`,
          variant: "default"
        })
      }
    } catch (error) {
      console.error("Transaction failed:", error)
      
      // Check for user rejection
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      if (errorMessage.includes("User rejected")) {
        toast({
          title: "Transaction Cancelled",
          description: "You cancelled the transaction in your wallet",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Transaction Failed",
          description: errorMessage,
          variant: "destructive"
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle purchase
  const handlePurchase = async (itemId: string, price: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsPurchasing(true)
      
      // Show "opening wallet" message
      toast({
        title: "Opening Wallet",
        description: "Please confirm the transaction in your wallet",
        variant: "default"
      })
      
      // For real VeWorld integration, we would wait for user confirmation
      // but for demo purposes, we'll simulate a delay then process with mock
      setTimeout(async () => {
        try {
          // Execute the purchase transaction (mock)
          const result = await purchaseItem(itemId, price, selectedTokenForPurchase)
          console.log("Purchase result:", result)
          setTxResult(result)
          
          // Show success message
          toast({
            title: "Purchase Successful",
            description: `You purchased item #${itemId} for ${price} ${selectedTokenForPurchase}. Thank you for supporting sustainable commerce!`,
            variant: "success"
          })
        } catch (error) {
          console.error("Purchase failed:", error)
          const errorMessage = error instanceof Error ? error.message : String(error)
          
          toast({
            title: "Purchase Failed",
            description: errorMessage,
            variant: "destructive"
          })
        } finally {
          setIsPurchasing(false)
        }
      }, 2000) // Simulate wallet dialog for 2 seconds
    } catch (error) {
      console.error("Purchase process error:", error)
      setIsPurchasing(false)
      
      const errorMessage = error instanceof Error ? error.message : String(error)
      toast({
        title: "Purchase Process Failed",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }
  
  // Render transaction status badge
  const renderStatusBadge = (status: string) => {
    if (status === "pending") {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      )
    } else if (status === "confirmed") {
      return (
        <Badge className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Confirmed
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Failed
        </Badge>
      )
    }
  }
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }
  
  // Format duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wallet className="h-5 w-5" /> 
              VeChain Wallet
            </span>
            
            {isTestnet && (
              <Badge variant="secondary">Testnet</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Connect to your VeChain wallet to interact with the blockchain
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isConnected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Address</Label>
                  <div className="font-mono text-sm mt-1">{getFormattedAddress()}</div>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">VET Balance</Label>
                    <div className="font-medium">{balance} VET</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">B3TR Balance</Label>
                    <div className="font-medium">{b3trBalance} B3TR</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Network</Label>
                  <div className="capitalize">{network}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Connected For</Label>
                  <div>{formatDuration(connectionDuration)}</div>
                </div>
              </div>
              
              {hasUnread && (
                <Alert variant="default" className="bg-primary/10 border-primary/20">
                  <Bell className="h-4 w-4" />
                  <AlertTitle>New Notifications</AlertTitle>
                  <AlertDescription className="flex justify-between">
                    <span>You have {getUnreadCount()} unread notifications</span>
                    <Button variant="link" size="sm" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-muted-foreground mb-4">
                Not connected to VeChain wallet
              </div>
              <Button onClick={handleConnect}>
                Connect Wallet
              </Button>
            </div>
          )}
        </CardContent>
        
        {isConnected && (
          <CardFooter>
            <Button variant="ghost" onClick={disconnect}>Disconnect</Button>
          </CardFooter>
        )}
      </Card>
      
      {isConnected && (
        <Tabs defaultValue="send">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="send">Send</TabsTrigger>
            <TabsTrigger value="purchase">Purchase</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="events">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Send Tokens</CardTitle>
                <CardDescription>
                  Send VET or B3TR tokens to another address on the {network} network
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="token-type">Token</Label>
                      <Select
                        value={tokenType}
                        onValueChange={handleTokenTypeChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VET">
                            <div className="flex items-center">
                              <Wallet className="h-4 w-4 mr-2" />
                              VET
                            </div>
                          </SelectItem>
                          <SelectItem value="B3TR">
                            <div className="flex items-center">
                              <Coins className="h-4 w-4 mr-2" />
                              B3TR
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={handleAmountChange}
                        className={balanceError ? "border-red-500" : ""}
                      />
                      {balanceError && (
                        <p className="text-xs text-red-500">{balanceError}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="rounded-md bg-muted p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available:</span>
                      <span className="font-medium">
                        {tokenType === "VET" ? `${balance} VET` : `${b3trBalance} B3TR`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={handleSendTransaction} 
                  disabled={isSubmitting || !recipient || !amount || !!balanceError}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send {tokenType}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {txResult && (
              <Alert variant={txResult.isConfirmed ? "default" : txResult.isFailed ? "destructive" : "default"} 
                 className={txResult.isConfirmed ? "border-green-500 bg-green-50" : ""}
              >
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    {txResult.isConfirmed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : txResult.isFailed ? (
                      <CircleAlert className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {txResult.isConfirmed ? "Transaction Confirmed" : 
                       txResult.isFailed ? "Transaction Failed" : 
                       "Transaction Pending"}
                    </AlertTitle>
                  </div>
                  
                  {txResult.blockExplorerUrl && (
                    <a 
                      href={txResult.blockExplorerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs flex items-center text-blue-600 hover:text-blue-800"
                    >
                      View on Explorer
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </div>
                <AlertDescription className="mt-2">
                  <div className="font-mono text-xs mb-2 truncate">
                    {txResult.transactionHash || "Transaction hash not available"}
                  </div>
                  {txResult.tokenType && txResult.tokenAmount && (
                    <div className="text-sm">
                      Sending {txResult.tokenAmount} {txResult.tokenType}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="purchase" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Items</CardTitle>
                <CardDescription>
                  Use VET or B3TR tokens to purchase sustainable products
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="mb-4">
                    <Label className="mb-2 block">Payment Method</Label>
                    <Select
                      value={selectedTokenForPurchase}
                      onValueChange={(value) => setSelectedTokenForPurchase(value as "VET" | "B3TR")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VET">
                          <div className="flex items-center">
                            <Wallet className="h-4 w-4 mr-2" />
                            VET ({balance} available)
                          </div>
                        </SelectItem>
                        <SelectItem value="B3TR">
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 mr-2" />
                            B3TR ({b3trBalance} available)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    {MOCK_ITEMS.map(item => (
                      <div key={item.id} className="border rounded-lg p-4 flex flex-col">
                        <div className="text-4xl mb-2 text-center">{item.image}</div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground mb-3">
                          Price: {item.price} {selectedTokenForPurchase}
                        </div>
                        
                        <Button 
                          onClick={() => handlePurchase(item.id, item.price)}
                          disabled={isPurchasing || parseFloat(selectedTokenForPurchase === "VET" ? balance : b3trBalance) < parseFloat(item.price)}
                          variant="outline"
                          className="mt-auto"
                        >
                          {isPurchasing ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              Buy Now
                            </>
                          )}
                        </Button>
                        
                        {parseFloat(selectedTokenForPurchase === "VET" ? balance : b3trBalance) < parseFloat(item.price) && (
                          <p className="text-xs text-red-500 mt-2">
                            Insufficient {selectedTokenForPurchase} balance
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Alert variant="default" className="bg-green-50 border-green-200">
                    <AlertTitle>Simulated Purchases</AlertTitle>
                    <AlertDescription>
                      These purchases are simulated for demonstration purposes. 
                      In a real application, these would interact with actual marketplace contracts.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Your recent transactions on VeChain
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {Object.keys(transactions).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.values(transactions).map((tx, index) => (
                      <div key={tx.transactionHash || index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium flex items-center gap-2">
                            {tx.tokenType === "B3TR" ? (
                              <Coins className="h-4 w-4" />
                            ) : (
                              <Wallet className="h-4 w-4" />
                            )}
                            {tx.purpose === "purchase" ? (
                              <span className="flex items-center gap-1">
                                <ShoppingBag className="h-4 w-4" />
                                Purchase
                              </span>
                            ) : (
                              <span>{tx.tokenType} Transaction</span>
                            )}
                          </div>
                          {renderStatusBadge(
                            tx.isPending ? "pending" : 
                            tx.isConfirmed ? "confirmed" : "failed"
                          )}
                        </div>
                        
                        <div className="font-mono text-xs mb-2 overflow-hidden text-ellipsis">
                          {tx.transactionHash}
                        </div>
                        
                        {tx.tokenAmount && (
                          <div className="text-sm font-medium mb-1">
                            Amount: {tx.tokenAmount} {tx.tokenType}
                          </div>
                        )}
                        
                        {tx.timestamp && (
                          <div className="text-xs text-muted-foreground mb-1">
                            Date: {formatTime(tx.timestamp)}
                          </div>
                        )}
                        
                        {tx.receipt && (
                          <div className="text-xs text-muted-foreground">
                            Block: {tx.receipt.blockNumber}
                          </div>
                        )}
                        
                        {tx.blockExplorerUrl && (
                          <div className="mt-2">
                            <a 
                              href={tx.blockExplorerUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs flex items-center text-blue-600 hover:text-blue-800"
                            >
                              View on Explorer
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Events</CardTitle>
                <CardDescription>
                  Recent events and notifications
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No notifications found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`border rounded-lg p-4 ${notification.read ? "" : "bg-primary/5 border-primary/20"}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">
                            {notification.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </div>
                        </div>
                        
                        <div className="text-sm mb-2">
                          {notification.message}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Event type: {notification.type}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 