import { products } from "@/data/products"
import { CategoryClient } from "./category-client"

// Add static params generation
export function generateStaticParams() {
  return [
    { category: "clothing" },
    { category: "electronics" },
    { category: "furniture" },
    { category: "books" },
    { category: "toys" },
    { category: "sports" }
  ]
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  // Filter products by category
  const categoryProducts = products.filter(
    (product) => product.category.toLowerCase() === params.category || product.subcategory.toLowerCase() === params.category
  )

  return <CategoryClient category={params.category} products={categoryProducts} />
}

