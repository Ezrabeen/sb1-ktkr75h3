"use client"

import { useParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { products } from "@/data/products"

export default function CategoryPage() {
  const params = useParams()
  const { category } = params

  // Filter products by category
  const categoryProducts = products.filter(
    (product) => product.category.toLowerCase() === category || product.subcategory.toLowerCase() === category,
  )

  // Get category name with proper capitalization
  const getCategoryName = () => {
    if (typeof category !== "string") return "Category"
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <div className="container py-20">
      <div className="flex items-center mb-8">
        <Link
          href="/categories"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold ml-auto">{getCategoryName()}</h1>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              currency={product.currency}
              image={product.images[0]}
              condition={product.condition}
              seller={product.seller}
              category={product.category}
              marketplace={product.marketplace}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-lg font-medium mb-2">No products found</p>
          <p className="text-muted-foreground mb-6">There are currently no products in this category.</p>
          <Button asChild>
            <Link href="/marketplace">Browse All Products</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

