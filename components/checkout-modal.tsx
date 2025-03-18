"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { useToken } from "@/contexts/token-context"
import { useTransaction } from "@/contexts/transaction-context"
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
import { Loader2, CheckCircle, AlertCircle, Leaf, CreditCard, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface CheckoutModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

type PaymentMethod = "card" | "paypal" | "b3tr" | "vet"

export function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  const { isConnected, connect } = useWallet()
  const { calculateIncentive, getImpactCategory } = useToken()
  const { addTransaction } = useTransaction()
  const { toast } = useToast()

  const [checkoutStep, setCheckoutStep] = useState<"details" | "payment" | "processing" | "success" | "error">(
    "details",
  )
  const [transaction, setTransaction] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")

  const impactCategory = getImpactCategory(product.category)
  const tokenIncentive = calculateIncentive(product.price, product.category)

  const totalPrice = product.price + product.shipping.cost

  const handleContinueToPayment = async () => {
    if (!isConnected) {
      await connect()
      return
    }
    setCheckoutStep("payment")
  }

  const handleCheckout = async () => {
    setCheckoutStep("processing")

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create a new transaction
      const newTransaction = await addTransaction({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0],
        productLink: product.productLink,
        price: totalPrice,
        currency: product.currency,
        tokensEarned: tokenIncentive,
        orderId: `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        marketplace: product.marketplace,
        category: product.category,
      })

      setTransaction(newTransaction)
      setCheckoutStep("success")

      toast({
        title: "Purchase Successful!",
        description: `You've earned ${tokenIncentive.toFixed(2)} B3TR tokens`,
        variant: "success",
      })
    } catch (error) {
      console.error("Checkout error:", error)
      setCheckoutStep("error")

      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase",
        variant: "destructive",
      })
    }
  }

  const handleClose = () => {
    // Reset state when closing
    setCheckoutStep("details")
    setTransaction(null)
    setPaymentMethod("card")
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
        return <Wallet className="h-4 w-4 mr-2" />
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
        return "VET"
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

            <div className="py-4 space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="card" id="payment-card" />
                    <Label htmlFor="payment-card" className="flex items-center cursor-pointer flex-1">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit/Debit Card
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="paypal" id="payment-paypal" />
                    <Label htmlFor="payment-paypal" className="flex items-center cursor-pointer flex-1">
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 4.643-5.813 4.643h-2.189c-.11 0-.217.022-.316.058l-.55 3.488c-.05.312.2.587.516.587h3.617c.43 0 .796-.312.863-.737l.035-.166.672-4.28.044-.236c.067-.425.434-.736.863-.736h.543c3.523 0 6.277-1.44 7.086-5.557.341-1.724.174-3.16-.733-4.171a2.782 2.782 0 0 0-.99-.606z" />
                      </svg>
                      PayPal
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="b3tr" id="payment-b3tr" />
                    <Label htmlFor="payment-b3tr" className="flex items-center cursor-pointer flex-1">
                      <Leaf className="h-4 w-4 mr-2" />
                      B3TR Token
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="vet" id="payment-vet" />
                    <Label htmlFor="payment-vet" className="flex items-center cursor-pointer flex-1">
                      <Wallet className="h-4 w-4 mr-2" />
                      VET
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center">
                  {getPaymentMethodIcon(paymentMethod)}
                  <span className="font-medium">{getPaymentMethodLabel(paymentMethod)} Payment</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This is a simulated payment for demonstration purposes. No actual payment will be processed.
                </p>
              </div>

              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  {product.currency} {totalPrice.toFixed(2)}
                </span>
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
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium">Processing Your Order</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Please wait while we process your {getPaymentMethodLabel(paymentMethod)} payment...
            </p>
          </div>
        )}

        {checkoutStep === "success" && transaction && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-5 w-5" />
                Purchase Successful!
              </DialogTitle>
              <DialogDescription>Your order has been confirmed and processed.</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <h4 className="font-medium text-green-800 dark:text-green-300 text-lg mb-2">
                  Thank You For Your Purchase!
                </h4>
                <p className="text-green-700 dark:text-green-400 mb-4">
                  Your order has been successfully processed. You've earned{" "}
                  <strong>{tokenIncentive.toFixed(2)} B3TR tokens</strong> for your sustainable purchase.
                </p>
                <div className="text-sm text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-900/40 p-2 rounded">
                  <p className="font-medium">Payment Method: {getPaymentMethodLabel(paymentMethod)}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono">{transaction.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction Hash:</span>
                  <span className="font-mono truncate max-w-[200px]">{transaction.txHash.substring(0, 10)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">B3TR Tokens Earned:</span>
                  <span className="font-medium text-primary">{transaction.tokensEarned.toFixed(2)} B3TR</span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="sm:flex-1" onClick={handleClose}>
                Close
              </Button>
              <Button className="sm:flex-1" asChild>
                <Link href="/profile">View in Profile</Link>
              </Button>
            </DialogFooter>
          </>
        )}

        {checkoutStep === "error" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <AlertCircle className="mr-2 h-5 w-5" />
                Transaction Failed
              </DialogTitle>
              <DialogDescription>We couldn't process your purchase. Please try again.</DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <p className="text-sm text-center text-muted-foreground">
                If this problem persists, please contact support.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={() => setCheckoutStep("details")}>Try Again</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

