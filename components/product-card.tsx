"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Tag, Leaf, ShoppingCart, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useWallet } from "@/contexts/wallet-context"
import { useToken } from "@/contexts/token-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import type { Product } from "@/data/products"
import { useToast } from "@/components/ui/use-toast"

/**
 * Product Card Component
 * 
 * Displays individual product information in a card format throughout the marketplace.
 * This component includes:
 * 
 * - Product image with optimized loading
 * - Product details (name, price, sustainability score)
 * - Add to cart functionality
 * - Add to wishlist toggle
 * - Quick view options
 * - Sustainability indicators
 * 
 * The component is responsive and adapts to different screen sizes while
 * maintaining consistent styling and functionality.
 */

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  condition: string
  seller: string
  category: string
  marketplace: "ebay" | "vinted" | "etsy" | "other"
  product?: Product
}

export function ProductCard({
  id,
  name,
  description,
  price,
  currency,
  image,
  condition,
  seller,
  category,
  marketplace,
  product,
}: ProductCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const { isConnected, network } = useWallet()
  const { getImpactCategory } = useToken()
  const { addToCart, isInCart, isPurchased } = useCart()
  const { isInWishlist, toggleWishlist, isTestnetMaintenance } = useWishlist()
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()

  const impactCategory = getImpactCategory(category.toLowerCase())
  const alreadyInCart = isInCart(id)
  const alreadyPurchased = isPurchased(id)
  const isWishlisted = isInWishlist(id)

  // Create a complete product object if one wasn't passed
  const productData: Product = product || {
    id,
    name,
    description,
    price,
    currency,
    images: [image],
    condition,
    seller,
    sellerName: "Unknown Seller",
    sellerRating: 0,
    category,
    subcategory: "",
    listedDate: new Date().toISOString(),
    marketplace,
    productLink: "",
    details: {},
    shipping: {
      methods: [],
      locations: [],
      cost: 0,
    },
    history: [],
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your wishlist",
        variant: "destructive",
      })
      return
    }

    toggleWishlist(productData)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      })
      router.push("/profile")
      return
    }

    addToCart(productData)
  }

  const handleCardClick = () => {
    router.push(`/product/${id}`)
  }

  const handleViewCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/cart")
  }

  const getMarketplaceColor = (marketplace: string) => {
    switch (marketplace) {
      case "ebay":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "vinted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "etsy":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getImpactBadge = (impact: string) => {
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

  return (
    <Card
      className={cn(
        "overflow-hidden h-full transition-all duration-300 hover:shadow-card flex flex-col border-transparent hover:border-primary-200 dark:hover:border-primary-900 cursor-pointer",
        alreadyPurchased && "opacity-70",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className={cn("object-cover w-full h-full transition-transform duration-500", isHovered && "scale-105")}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Pre-loved</Badge>
          <Badge className={getImpactBadge(impactCategory)}>
            <Leaf className="h-3 w-3 mr-1" />
            {impactCategory.charAt(0).toUpperCase() + impactCategory.slice(1)} Impact
          </Badge>
        </div>
        <Badge className={cn("absolute top-2 right-12", getMarketplaceColor(marketplace))} variant="outline">
          <Tag className="h-3 w-3 mr-1" />
          {marketplace.charAt(0).toUpperCase() + marketplace.slice(1)}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm dark:bg-gray-900/80",
            isWishlisted ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-600",
          )}
          onClick={handleToggleWishlist}
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
          <span className="sr-only">{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</span>
        </Button>

        {alreadyPurchased && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge className="bg-green-500 text-white text-lg py-2 px-4">
              <Check className="h-5 w-5 mr-2" />
              Purchased
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-lg text-primary">
            {currency} {price.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground">{condition}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t">
        {alreadyPurchased ? (
          <Button className="w-full" variant="outline" disabled>
            Already Purchased
          </Button>
        ) : alreadyInCart ? (
          <Button className="w-full" variant="outline" onClick={handleViewCart}>
            <Check className="mr-2 h-4 w-4" />
            View in Cart
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={!isAuthenticated || (network === "testnet" && isTestnetMaintenance)}
            variant={isAuthenticated ? "default" : "outline"}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAuthenticated ? "Add to Cart" : "Login to Purchase"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

