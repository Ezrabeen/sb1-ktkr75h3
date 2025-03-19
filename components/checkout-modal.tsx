"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { useToken } from "@/contexts/token-context"
import { useTransaction } from "@/contexts/transaction-context"
import { useVeChain } from "@/providers/VeChainProvider"
import { useToast } from "@/components/ui/use-toast"
import type { Product } from "@/data/products"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle, Leaf, CreditCard, Wallet, ArrowRightCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

interface CheckoutModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

type PaymentMethod = "card" | "paypal" | "b3tr" | "vet"

export function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  const { isConnected, connect } = useWallet()
  const { calculateIncentive, getImpactCategory, addTokens } = useToken()
  const { addTransaction } = useTransaction()
  const { connect: connectVeChain, account: veChainAccount, sendTransaction } = useVeChain()
  const { toast } = useToast()

  const [checkoutStep, setCheckoutStep] = useState<"details" | "payment" | "processing" | "success" | "error">(
    "details",
  )
  const [transaction, setTransaction] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("vet")
  const [processingSteps, setProcessingSteps] = useState({
    connecting: false,
    verifying: false,
    sending: false,
    confirming: false,
    tokenizing: false,
    completed: false,
  })
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  const impactCategory = getImpactCategory(product.category)
  const tokenIncentive = calculateIncentive(product.price, product.category)

  const totalPrice = product.price + product.shipping.cost

  const handleContinueToPayment = async () => {
    if (!isConnected) {
      await connect()
      return
    }
    
    // Check if VeChain wallet is connected
    if (!veChainAccount) {
      try {
        await connectVeChain();
        toast({
          title: "Wallet Connected",
          description: "VeChain wallet connected successfully",
        });
      } catch (error) {
        toast({
          title: "Wallet Connection Failed",
          description: "Please make sure you have Sync2 wallet installed and unlocked.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setCheckoutStep("payment")
  }

  const handleCheckout = async () => {
    setCheckoutStep("processing");
    
    try {
      // Step 1: Connecting to wallet
      setProcessingSteps((prev) => ({ ...prev, connecting: true }));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // If VET is selected as payment method, try to connect VeChain wallet if not already connected
      if (paymentMethod === "vet" && !veChainAccount) {
        await connectVeChain();
      }
      
      setProcessingSteps((prev) => ({ ...prev, connecting: false, verifying: true }));
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      // Step 2: Create transaction
      setProcessingSteps((prev) => ({ ...prev, verifying: false, sending: true }));
      
      // If paying with VET, create a mock VeChain transaction
      let txHash = "";
      if (paymentMethod === "vet") {
        try {
          // Mock transaction data for sending VET
          const mockClause = [{
            to: "0x7567d83b7b8d80addcb281a71d54fc7b3364ffed", // Demo marketplace address
            value: "0x" + (totalPrice * 10**18).toString(16), // Convert to wei-equivalent
            data: "0x" // No data for simple transfer
          }];
          
          // Send the transaction
          txHash = await sendTransaction(mockClause);
          setTransactionHash(txHash);
        } catch (error) {
          console.error("VeChain transaction error:", error);
          throw new Error("Failed to send VeChain transaction");
        }
      } else {
        // For other payment methods, generate a mock hash
        txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
        setTransactionHash(txHash);
      }
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Step 3: Confirm transaction
      setProcessingSteps((prev) => ({ ...prev, sending: false, confirming: true }));
      
      // Step 4: Mint B3TR tokens as reward
      setProcessingSteps((prev) => ({ ...prev, confirming: false, tokenizing: true }));
      
      // Add tokens to user's balance
      addTokens(tokenIncentive);
      
      await new Promise((resolve) => setTimeout(resolve, 1800));
      
      // Step 5: Complete transaction
      setProcessingSteps((prev) => ({ ...prev, tokenizing: false, completed: true }));

      // Create a new transaction record
      const newTransaction = await addTransaction({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0],
        productLink: product.productLink,
        price: totalPrice,
        currency: paymentMethod === "vet" ? "VET" : product.currency,
        tokensEarned: tokenIncentive,
        orderId: `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        marketplace: product.marketplace,
        category: product.category,
      })

      setTransaction(newTransaction)
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCheckoutStep("success")

      toast({
        title: "Purchase Successful!",
        description: `You've earned ${tokenIncentive.toFixed(2)} B3TR tokens for this sustainable purchase`,
        variant: "success",
      })
    } catch (error) {
      console.error("Checkout error:", error)
      setCheckoutStep("error")

      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleClose = () => {
    // Reset state when closing
    setCheckoutStep("details")
    setTransaction(null)
    setPaymentMethod("vet")
    setProcessingSteps({
      connecting: false,
      verifying: false,
      sending: false,
      confirming: false,
      tokenizing: false,
      completed: false,
    });
    setTransactionHash(null);
    onClose()
  }

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case "high":
        return "High Impact - 10% B3TR Reward"
      case "medium":
        return "Medium Impact - 5% B3TR Reward"
      case "low":
        return "Low Impact - 2% B3TR Reward"
      default:
        return "Standard Reward"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-primary-500 text-white"
      case "medium":
        return "bg-primary-400 text-white"
      case "low":
        return "bg-primary-300 text-primary-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4 mr-2" />
      case "paypal":
        return (
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 4.643-5.813 4.643h-2.189c-.11 0-.217.022-.316.058l-.55 3.488c-.05.312.2.587.516.587h3.617c.43 0 .796-.312.863-.737l.035-.166.672-4.28.044-.236c.067-.425.434-.736.863-.736h.543c3.523 0 6.277-1.44 7.086-5.557.341-1.724.174-3.16-.733-4.171a2.782 2.782 0 0 0-.99-.606z" />
          </svg>
        )
      case "b3tr":
        return <Leaf className="h-4 w-4 mr-2" />
      case "vet":
        return <img src="/vechain-logo.png" alt="VeChain" className="h-4 w-4 mr-2" />
      default:
        return null
    }
  }

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card"
      case "paypal":
        return "PayPal"
      case "b3tr":
        return "B3TR Token"
      case "vet":
        return "VET (VeChain)"
      default:
        return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {checkoutStep === "details" && (
          <>
            <DialogHeader>
              <DialogTitle>Complete Your Purchase</DialogTitle>
              <DialogDescription>Review your order details before continuing to payment.</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">Condition: {product.condition}</p>
                  <Badge variant="outline" className="mt-1">
                    {product.marketplace.charAt(0).toUpperCase() + product.marketplace.slice(1)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Item Price:</span>
                  <span>
                    {product.currency} {product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>
                    {product.currency} {product.shipping.cost.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>
                    {product.currency} {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm flex items-center">
                      <Leaf className="h-4 w-4 mr-1 text-primary" />
                      Environmental Impact Reward
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      You'll earn B3TR tokens for this sustainable purchase
                    </p>
                  </div>
                  <Badge className={getImpactColor(impactCategory)}>{tokenIncentive.toFixed(2)} B3TR</Badge>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleContinueToPayment}>
                {isConnected ? "Continue to Payment" : "Connect Wallet"}
              </Button>
            </DialogFooter>
          </>
        )}

        {checkoutStep === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle>Select Payment Method</DialogTitle>
              <DialogDescription>Choose how you'd like to pay for your purchase.</DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <RadioGroup
                defaultValue={paymentMethod}
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="vet" id="payment-vet" />
                  <Label htmlFor="payment-vet" className="flex items-center cursor-pointer flex-1">
                    <img src="/vechain-logo.png" alt="VeChain" className="h-4 w-4 mr-2" />
                    VET
                  </Label>
                  <span className="text-xs text-muted-foreground">Recommended</span>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="card" id="payment-card" />
                  <Label htmlFor="payment-card" className="flex items-center cursor-pointer flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="paypal" id="payment-paypal" />
                  <Label htmlFor="payment-paypal" className="flex items-center cursor-pointer flex-1">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 4.643-5.813 4.643h-2.189c-.11 0-.217.022-.316.058l-.55 3.488c-.05.312.2.587.516.587h3.617c.43 0 .796-.312.863-.737l.035-.166.672-4.28.044-.236c.067-.425.434-.736.863-.736h.543c3.523 0 6.277-1.44 7.086-5.557.341-1.724.174-3.16-.733-4.171a2.782 2.782 0 0 0-.99-.606z" />
                    </svg>
                    PayPal
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="b3tr" id="payment-b3tr" />
                  <Label htmlFor="payment-b3tr" className="flex items-center cursor-pointer flex-1">
                    <Leaf className="h-4 w-4 mr-2" />
                    B3TR Token
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Order Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>
                      {product.currency} {product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span>
                      {product.currency} {product.shipping.cost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2">
                    <span>Total:</span>
                    <span>
                      {paymentMethod === "vet" ? "VET" : product.currency} {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCheckoutStep("details")}>
                Back
              </Button>
              <Button onClick={handleCheckout}>Complete Purchase</Button>
            </DialogFooter>
          </>
        )}

        {checkoutStep === "processing" && (
          <>
            <DialogHeader>
              <DialogTitle>Processing Your Purchase</DialogTitle>
              <DialogDescription>Please wait while we process your transaction.</DialogDescription>
            </DialogHeader>

            <div className="py-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {processingSteps.connecting ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : processingSteps.verifying || processingSteps.sending || processingSteps.confirming || processingSteps.tokenizing || processingSteps.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Connecting to wallet</p>
                    <p className="text-sm text-muted-foreground">
                      {processingSteps.connecting
                        ? "Establishing secure connection..."
                        : processingSteps.verifying || processingSteps.sending || processingSteps.confirming || processingSteps.tokenizing || processingSteps.completed
                        ? "Connection established"
                        : "Waiting"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {processingSteps.verifying ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : processingSteps.sending || processingSteps.confirming || processingSteps.tokenizing || processingSteps.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Verifying your account</p>
                    <p className="text-sm text-muted-foreground">
                      {processingSteps.verifying
                        ? "Verifying wallet and balance..."
                        : processingSteps.sending || processingSteps.confirming || processingSteps.tokenizing || processingSteps.completed
                        ? "Account verified"
                        : "Waiting"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {processingSteps.sending ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : processingSteps.confirming || processingSteps.tokenizing || processingSteps.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Processing payment</p>
                    <p className="text-sm text-muted-foreground">
                      {processingSteps.sending
                        ? `Sending ${paymentMethod === "vet" ? "VET" : "payment"} to marketplace...`
                        : processingSteps.confirming || processingSteps.tokenizing || processingSteps.completed
                        ? `Transaction sent`
                        : "Waiting"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {processingSteps.confirming ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : processingSteps.tokenizing || processingSteps.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Confirming payment</p>
                    <p className="text-sm text-muted-foreground">
                      {processingSteps.confirming
                        ? "Waiting for confirmation on blockchain..."
                        : processingSteps.tokenizing || processingSteps.completed
                        ? "Payment confirmed"
                        : "Waiting"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {processingSteps.tokenizing ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : processingSteps.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Minting B3TR tokens</p>
                    <p className="text-sm text-muted-foreground">
                      {processingSteps.tokenizing
                        ? `Minting ${tokenIncentive.toFixed(2)} B3TR as sustainability reward...`
                        : processingSteps.completed
                        ? `${tokenIncentive.toFixed(2)} B3TR minted to your wallet`
                        : "Waiting"}
                    </p>
                  </div>
                </div>
              </div>

              {transactionHash && (processingSteps.sending || processingSteps.confirming || processingSteps.tokenizing || processingSteps.completed) && (
                <div className="bg-muted/50 p-3 rounded-md text-sm">
                  <p className="text-xs font-medium mb-1">Transaction Hash</p>
                  <p className="text-xs break-all text-muted-foreground font-mono">{transactionHash}</p>
                </div>
              )}
            </div>
          </>
        )}

        {checkoutStep === "success" && (
          <>
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <DialogTitle className="text-center">Purchase Successful!</DialogTitle>
              <DialogDescription className="text-center">
                Your order has been processed successfully.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Order ID</p>
                  <p className="text-sm font-mono">{transaction?.orderId || "-"}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Product</p>
                  <p className="text-sm">{product.name}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Total Paid</p>
                  <p className="text-sm">{paymentMethod === "vet" ? "VET" : product.currency} {totalPrice.toFixed(2)}</p>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">B3TR Reward</p>
                  </div>
                  <p className="text-sm font-medium text-primary">{tokenIncentive.toFixed(2)} B3TR</p>
                </div>
              </div>

              {transactionHash && (
                <div className="bg-muted/50 p-3 rounded-md text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium">Transaction Hash</p>
                    <Link 
                      href={`https://explore-testnet.vechain.org/transactions/${transactionHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center"
                    >
                      View <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                  <p className="text-xs break-all text-muted-foreground font-mono">{transactionHash}</p>
                </div>
              )}
              
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <Leaf className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <h4 className="text-sm font-medium">Environmental Impact</h4>
                    <p className="text-xs text-muted-foreground">
                      Your sustainable choice just saved approximately {(tokenIncentive * 5).toFixed(1)} kg of CO₂ emissions!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Close
              </Button>
              <Button
                onClick={() => {
                  handleClose()
                  // Navigate to profile/purchases
                  window.location.href = "/profile/purchases"
                }}
                className="flex-1"
              >
                View Orders
              </Button>
            </DialogFooter>
          </>
        )}

        {checkoutStep === "error" && (
          <>
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="text-center">Payment Failed</DialogTitle>
              <DialogDescription className="text-center">
                There was an error processing your payment. No funds have been deducted.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Please check your wallet connection and try again. If the problem persists, try using a different
                  payment method or contact support.
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setCheckoutStep("payment")} className="flex-1">
                Try Again
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

