"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

interface WishlistContextProps {
  children: ReactNode
}

interface WishlistContextValue {
  wishlist: string[]
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

export const WishlistProvider: React.FC<WishlistContextProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return []
    }
    const storedWishlist = localStorage.getItem("wishlist")
    return storedWishlist ? JSON.parse(storedWishlist) : []
  })

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (productId: string) => {
    if (!wishlist.includes(productId)) {
      setWishlist([...wishlist, productId])
      toast.success("Item added to wishlist!")
    }
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist(wishlist.filter((id) => id !== productId))
    toast.success("Item removed from wishlist!")
  }

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId)
  }

  const value: WishlistContextValue = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const WishlistEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-10 w-10 text-muted-foreground mb-4"
      >
        <path d="M19 14c1.49 0 3 1.34 3 3.02 0 1.68-3 5.02-3 5.02-2.5 0-5-3.34-5-5.02 0-1.68 1.51-3.02 3-3.02h4z" />
        <path d="M5 14c-1.49 0-3 1.34-3 3.02 0 1.68 3 5.02 3 5.02 2.5 0 5-3.34 5-5.02 0-1.68-1.51-3.02-3-3.02h-4z" />
        <path d="M12 14v9" />
        <path d="M8 2h8" />
        <path d="M3 2h18" />
        <path d="M5 2v12" />
        <path d="M19 2v12" />
      </svg>
      <h3 className="text-xl font-semibold">Your wishlist is empty</h3>
      <p className="text-muted-foreground max-w-[600px] mx-auto">
        You haven't added any items to your wishlist yet. Browse our marketplace to find sustainable products you love.
      </p>
    </div>
  )
}

