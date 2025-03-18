"use client"

import { useState, useEffect } from "react"
import { useVeWorld } from "@/providers/veworld-provider"
import { getMarketplaceItems } from "@/services/marketplace"

type MarketplaceItem = {
  id: string
  name: string
  description: string
  price: string
  image: string
  seller: string
}

export function MarketplaceClient() {
  const { isConnected } = useVeWorld()
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true)
        const marketplaceItems = await getMarketplaceItems()
        setItems(marketplaceItems)
      } catch (error) {
        console.error("Error loading marketplace items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [])

  if (!isConnected) {
    return (
      <div className="text-center py-10">
        <p className="text-xl mb-4">Please connect your wallet to view the marketplace</p>
        <p>You need to connect your VeWorld wallet to browse and purchase items.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-xl">Loading marketplace items...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl mb-4">No items found</p>
        <p>There are currently no items available in the marketplace.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg overflow-hidden shadow-md">
          <img
            src={item.image || `/placeholder.svg?height=200&width=400`}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">{item.price} VET</span>
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

