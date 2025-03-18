"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { products } from "@/data/products"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export function SearchItems({ className }: { className?: string }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<typeof products>([])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!searchTerm.trim()) {
      setIsSearching(false)
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Search in products
    const results = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setSearchResults(results)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
    setIsSearching(false)
    setSearchResults([])
  }

  // Navigate to product page
  const navigateToProduct = (productId: string) => {
    router.push(`/product/${productId}`)
    clearSearch()
  }

  // Search when search term changes
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm) {
        handleSearch()
      } else {
        setIsSearching(false)
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [searchTerm])

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="search"
          placeholder="Search pre-loved items..."
          className="pl-10 pr-10 w-full rounded-md border-gray-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="absolute right-0 top-0 h-full rounded-r-md"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isSearching && searchResults.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-[400px] overflow-y-auto shadow-lg border-gray-200">
          <CardContent className="p-2">
            <div className="space-y-0.5">
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  className="w-full text-left p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md flex items-center gap-3 transition-colors"
                  onClick={() => navigateToProduct(product.id)}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <p className="font-medium truncate text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {product.currency} {product.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isSearching && searchResults.length === 0 && searchTerm && (
        <Card className="absolute z-50 w-full mt-1">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground">No items found matching "{searchTerm}"</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/marketplace">Browse all items</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

