"use client"

import { useState } from "react"
import Link from "next/link"
import { useWallet } from "@/contexts/wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { useToken } from "@/contexts/token-context"
import { useTransaction } from "@/contexts/transaction-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Leaf,
  CheckCircle,
  Loader2,
  AlertTriangle,
  CreditCard,
  Wallet,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/cart-context"
import { getProductById } from "@/data/products"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type PaymentMethod = "card" | "paypal" | "b3tr" | "vet"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const { isConnected, connect } = useWallet()
  const { network, isTestnetMaintenance } = useNetwork()
  const { calculateIncentive } = useToken()
  const { addTransaction } = useTransaction()
  const { toast } = useToast()

  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)

  // Calculate total token incentives
  const totalTokens = cartItems.reduce((total, item) => {
    const incentive = calculateIncentive(item.price, item.category)
    return total + incentive * item.quantity
  }, 0)

  const handleOpenPaymentModal = async () => {
    if (!isConnected) {
      await connect()
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out",
        variant: "destructive",
      })
      return
    }

    setIsPaymentModalOpen(true)
  }

  const handleCheckout = async () => {
    setIsPaymentProcessing(true)

    try {
      // Capture the total tokens before clearing the cart
      const earnedTokens = totalTokens

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Process each cart item as a transaction
      for (const item of cartItems) {
        const product = getProductById(item.productId)
        if (product) {
          await addTransaction({
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            productLink: product.productLink,
            price: item.price * item.quantity,
            currency: item.currency,
            tokensEarned: calculateIncentive(item.price, item.category) * item.quantity,
            orderId: `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            marketplace: item.marketplace,
            category: item.category,
          })
        }
      }

      // Close the payment modal
      setIsPaymentModalOpen(false)

      // Clear the cart after successful checkout
      clearCart()
      setIsComplete(true)

      toast({
        title: "Checkout Complete!",
        description: `You've earned ${earnedTokens.toFixed(2)} B3TR tokens`,
        variant: "success",
      })
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order",
        variant: "destructive",
      })
    } finally {
      setIsPaymentProcessing(false)
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

  if (isComplete) {
    return (
      <div className="container py-20 max-w-4xl mx-auto">
        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your order has been successfully processed. You've earned {totalTokens.toFixed(2)} B3TR tokens for your
              sustainable purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild variant="outline">
                <Link href="/marketplace">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild>
                <Link href="/profile/purchases">View Your Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-20">
      <div className="flex items-center mb-8">
        <Link
          href="/marketplace"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold ml-auto">Your Cart</h1>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-32 h-32">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {item.marketplace.charAt(0).toUpperCase() + item.marketplace.slice(1)}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                        <span className="font-bold">
                          {item.currency} {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {cartItems[0]?.currency} {cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    {cartItems[0]?.currency} {cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm flex items-center">
                        <Leaf className="h-4 w-4 mr-1 text-primary" />
                        B3TR Token Rewards
                      </h4>
                      <p className="text-xs text-muted-foreground">You'll earn tokens for this sustainable purchase</p>
                    </div>
                    <Badge className="bg-primary-500 text-white">{totalTokens.toFixed(2)} B3TR</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleOpenPaymentModal}
                  disabled={isProcessing || cartItems.length === 0 || (network === "testnet" && isTestnetMaintenance)}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : !isConnected ? (
                    "Connect Wallet to Checkout"
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
                {network === "testnet" && isTestnetMaintenance && (
                  <div className="mt-4">
                    <Alert
                      variant="warning"
                      className="border-amber-500 bg-amber-50 dark:bg-amber-950 dark:border-amber-800"
                    >
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                      <AlertTitle className="text-amber-800 dark:text-amber-400">Network Maintenance</AlertTitle>
                      <AlertDescription className="text-amber-700 dark:text-amber-300">
                        The testnet is currently under maintenance. Checkout is temporarily unavailable.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                {!isConnected && (
                  <p className="text-xs text-center text-muted-foreground">
                    You need to connect your wallet to complete your purchase
                  </p>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium">Your cart is empty</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Browse our marketplace to find sustainable
              products.
            </p>
            <Button asChild className="mt-4">
              <Link href="/marketplace">Browse Marketplace</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
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

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>
                  {cartItems[0]?.currency} {cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  {cartItems[0]?.currency} {cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">B3TR Tokens Reward:</span>
                <Badge className="bg-primary-500 text-white">{totalTokens.toFixed(2)} B3TR</Badge>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckout} disabled={isPaymentProcessing}>
              {isPaymentProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Purchase"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

