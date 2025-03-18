"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Search, Filter, Leaf } from "lucide-react"

// Data dummy untuk produk
const products = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    price: 45.99,
    seller: "VintageKing",
    image: "/placeholder.svg",
    category: "Clothing",
    condition: "Good",
    sustainability: "High",
    views: 128,
    likes: 24
  },
  {
    id: 2,
    name: "Eco-Friendly Water Bottle",
    price: 29.99,
    seller: "EcoStore",
    image: "/placeholder.svg",
    category: "Accessories",
    condition: "New",
    sustainability: "High",
    views: 256,
    likes: 45
  },
  {
    id: 3,
    name: "Recycled Notebook",
    price: 12.99,
    seller: "GreenMarket",
    image: "/placeholder.svg",
    category: "Stationery",
    condition: "New",
    sustainability: "Medium",
    views: 89,
    likes: 12
  },
  // Tambahkan lebih banyak produk dummy di sini
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [selectedSustainability, setSelectedSustainability] = useState("all")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Marketplace</h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Leaf className="h-4 w-4" />
            Sustainable Shopping
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="stationery">Stationery</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCondition} onValueChange={setSelectedCondition}>
            <SelectTrigger>
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSustainability} onValueChange={setSelectedSustainability}>
            <SelectTrigger>
              <SelectValue placeholder="Sustainability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="high">High Impact</SelectItem>
              <SelectItem value="medium">Medium Impact</SelectItem>
              <SelectItem value="low">Low Impact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
              />
              <Badge
                className="absolute top-2 right-2"
                variant={product.sustainability === "High" ? "default" : "secondary"}
              >
                {product.sustainability} Impact
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium mb-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">by {product.seller}</p>
              <div className="flex justify-between items-center">
                <p className="font-bold text-primary">{product.price} B3TR</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{product.views} views</span>
                  <span>•</span>
                  <span>{product.likes} likes</span>
                </div>
              </div>
              <Button className="w-full mt-4">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

