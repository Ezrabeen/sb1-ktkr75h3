"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useWallet } from "@/contexts/wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { useToken } from "@/contexts/token-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ArrowLeft, AlertTriangle, Tag, ExternalLink, ShoppingCart, Check } from "lucide-react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getProductById } from "@/data/products"
import { CheckoutModal } from "@/components/checkout-modal"
import { useToast } from "@/components/ui/use-toast"
import { LoginModal } from "@/components/login-modal"
import { products } from "@/data/products"

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString()
  }))
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const { isConnected } = useWallet()
  const { network, isTestnetMaintenance } = useNetwork()
  const { calculateIncentive, getImpactCategory } = useToken()
  const { addToCart, isInCart, isPurchased } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // Find the product by ID
  const product = getProductById(id as string)

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  const alreadyInCart = isInCart(product.id)
  const alreadyPurchased = isPurchased(product.id)
  const isWishlisted = isInWishlist(product.id)

  const handleToggleWishlist = () => {
    if (!isAuthenticated || !user) {
      setIsLoginModalOpen(true)
      return
    }

    if (product) {
      toggleWishlist(product)
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated || !user) {
      setIsLoginModalOpen(true)
      return
    }

    if (product) {
      addToCart(product)
    }
  }

  const handleBuy = async () => {
    if (!isAuthenticated || !user) {
      setIsLoginModalOpen(true)
      return
    }

    setIsCheckoutOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const impactCategory = getImpactCategory(product.category)
  const tokenIncentive = calculateIncentive(product.price, product.category)

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-green-500 text-white"
      case "medium":
        return "bg-green-400 text-white"
      case "low":
        return "bg-green-300 text-green-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case "high":
        return "High Impact - Higher Rewards"
      case "medium":
        return "Medium Impact - Medium Rewards"
      case "low":
        return "Low Impact - Lower Rewards"
      default:
        return "Standard Reward"
    }
  }

  return (
    <div className="container py-20">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/categories/${product.category.toLowerCase()}`}>{product.category}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/categories/${product.category.toLowerCase()}/${product.subcategory.toLowerCase()}`}>
              {product.subcategory}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {network === "testnet" && isTestnetMaintenance && (
        <Alert variant="warning" className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">Network Maintenance</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            The testnet is currently under maintenance. Purchases and other features are temporarily unavailable.
          </AlertDescription>
        </Alert>
      )}

      {alreadyPurchased && (
        <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
          <AlertTitle className="text-green-800 dark:text-green-400">Already Purchased</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            You've already purchased this item. View your purchase history in your profile.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <img
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Pre-owned</Badge>
              <Badge className={getImpactBadge(impactCategory)}>{getImpactLabel(impactCategory)}</Badge>
            </div>
            <Badge className="absolute top-4 right-4 bg-white text-black hover:bg-gray-100" variant="outline">
              <Tag className="h-3 w-3 mr-1" />
              {product.marketplace.charAt(0).toUpperCase() + product.marketplace.slice(1)}
            </Badge>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative rounded-md overflow-hidden border-2 ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <div className="w-20 h-20">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <span className="text-2xl font-bold text-primary">
                {product.currency} {product.price.toFixed(2)}
              </span>
              <Badge variant="outline">{product.condition}</Badge>
            </div>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="bg-secondary p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Environmental Impact</h3>
                <p className="text-sm text-muted-foreground">Earn B3TR tokens for this sustainable purchase</p>
              </div>
              <Badge className={getImpactBadge(impactCategory)}>{tokenIncentive.toFixed(2)} B3TR</Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {alreadyPurchased ? (
              <Button className="flex-1" disabled>
                Already Purchased
              </Button>
            ) : alreadyInCart ? (
              <Button className="flex-1" variant="outline" asChild>
                <Link href="/cart">
                  <Check className="mr-2 h-4 w-4" />
                  View in Cart
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={alreadyPurchased || (network === "testnet" && isTestnetMaintenance)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBuy}
                  disabled={alreadyPurchased || (network === "testnet" && isTestnetMaintenance)}
                >
                  Buy Now
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleWishlist}
              className={isWishlisted ? "text-red-500" : ""}
              disabled={network === "testnet" && isTestnetMaintenance}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              <span className="sr-only">{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</span>
            </Button>

            <Button variant="outline" size="icon" asChild>
              <a href={product.productLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-5 w-5" />
                <span className="sr-only">View on {product.marketplace}</span>
              </a>
            </Button>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Seller:</span>
              <span className="text-sm">
                {product.sellerName} ({formatAddress(product.seller)})
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm font-medium">Rating:</span>
              <div className="flex items-center">
                <span className="text-sm">{product.sellerRating}/5</span>
                <div className="flex ml-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.sellerRating)
                          ? "text-yellow-400"
                          : i < product.sellerRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm font-medium">Listed:</span>
              <span className="text-sm">{formatDate(product.listedDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="history">Price History</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.details).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="font-medium capitalize">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Shipping Methods</span>
                <span>{product.shipping.methods.join(", ")}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Ships To</span>
                <span>{product.shipping.locations.join(", ")}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Shipping Cost</span>
                <span>
                  {product.currency} {product.shipping.cost.toFixed(2)}
                </span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history" className="pt-4">
            <div className="space-y-4">
              {product.history.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <div>
                    <span className="font-medium">{item.event}</span>
                    <span className="text-sm text-muted-foreground ml-2">{formatDate(item.date)}</span>
                  </div>
                  <span>
                    {product.currency} {item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CheckoutModal product={product} isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}

