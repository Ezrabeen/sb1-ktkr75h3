"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { Product } from "@/data/products"
import { useNetwork } from "@/contexts/network-context"

interface WishlistContextType {
  wishlist: string[]
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product | undefined) => void
  wishlistCount: number
  isTestnetMaintenance: boolean
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  toggleWishlist: () => {},
  wishlistCount: 0,
  isTestnetMaintenance: false,
})

export const useWishlist = () => useContext(WishlistContext)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const { toast } = useToast()
  const { isTestnetMaintenance } = useNetwork()

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist))
        } catch (error) {
          console.error("Failed to parse wishlist from localStorage:", error)
        }
      }
    }
  }, [])

  // Update localStorage when wishlist changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist])

  // Add product to wishlist
  const addToWishlist = (productId: string) => {
    if (!productId) return
    setWishlist((prev) => [...prev, productId])
  }

  // Remove product from wishlist
  const removeFromWishlist = (productId: string) => {
    if (!productId) return
    setWishlist((prev) => prev.filter((id) => id !== productId))
  }

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    if (!productId) return false
    return wishlist.includes(productId)
  }

  // Toggle product in wishlist
  const toggleWishlist = (product: Product | undefined) => {
    // Guard clause to handle undefined product or missing id
    if (!product || !product.id) {
      console.error("Invalid product passed to toggleWishlist:", product)
      toast({
        title: "Error",
        description: "Could not update wishlist. Invalid product.",
        variant: "destructive",
      })
      return
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist`,
      })
    } else {
      addToWishlist(product.id)
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist`,
      })
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlist.length,
        isTestnetMaintenance,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

