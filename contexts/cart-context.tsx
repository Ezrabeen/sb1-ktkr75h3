"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useTransaction } from "@/contexts/transaction-context"
import type { Product } from "@/data/products"
import { useToast } from "@/components/ui/use-toast"

export type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  currency: string
  image: string
  quantity: number
  marketplace: "ebay" | "vinted" | "etsy" | "other"
  category: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
  isPurchased: (productId: string) => boolean
  cartTotal: number
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isInCart: () => false,
  isPurchased: () => false,
  cartTotal: 0,
})

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [purchasedItems, setPurchasedItems] = useState<string[]>([])
  const { transactions } = useTransaction()
  const { toast } = useToast()

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error)
        }
      }
    }
  }, [])

  // Update localStorage when cart changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems])

  // Extract purchased product IDs from transactions
  useEffect(() => {
    const purchasedProductIds = transactions.map((tx) => tx.productId)
    setPurchasedItems(purchasedProductIds)
  }, [transactions])

  // Add product to cart
  const addToCart = (product: Product) => {
    // Guard clause to handle undefined product or missing id
    if (!product || !product.id) {
      console.error("Invalid product passed to addToCart:", product)
      toast({
        title: "Error",
        description: "Could not add to cart. Invalid product.",
        variant: "destructive",
      })
      return
    }

    // Check if product is already purchased
    if (isPurchased(product.id)) {
      toast({
        title: "Already Purchased",
        description: "You've already purchased this item.",
        variant: "destructive",
      })
      return
    }

    // Check if product is already in cart
    const existingItem = cartItems.find((item) => item.productId === product.id)

    if (existingItem) {
      // Update quantity if already in cart
      updateQuantity(existingItem.id, existingItem.quantity + 1)
      toast({
        title: "Quantity Updated",
        description: `${product.name} quantity increased to ${existingItem.quantity + 1}`,
      })
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image: product.images[0],
        quantity: 1,
        marketplace: product.marketplace,
        category: product.category,
      }

      setCartItems((prev) => [...prev, newItem])
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      })
    }
  }

  // Remove item from cart
  const removeFromCart = (id: string) => {
    if (!id) return
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (!id || quantity < 1) return

    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Check if product is in cart
  const isInCart = (productId: string) => {
    if (!productId) return false
    return cartItems.some((item) => item.productId === productId)
  }

  // Check if product is already purchased
  const isPurchased = (productId: string) => {
    if (!productId) return false
    return purchasedItems.includes(productId)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        isPurchased,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

