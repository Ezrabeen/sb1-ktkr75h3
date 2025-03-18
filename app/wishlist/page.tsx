"use client"

import { useWishlist } from "@/contexts/wishlist-context"
import { getProductById } from "@/data/products"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function WishlistPage() {
  const { wishlist, wishlistCount } = useWishlist()

  // Get products from wishlist IDs
  const wishlistProducts = wishlist.map((id) => getProductById(id)).filter((product) => product !== undefined)

  return (
    <div className="container py-20">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      {wishlistCount > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(
              (product) =>
                product && (
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
                ),
            )}
          </div>
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium">Your wishlist is empty</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              You haven't added any items to your wishlist yet. Browse our marketplace to find sustainable products you
              love.
            </p>
            <Button asChild className="mt-4">
              <Link href="/marketplace">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Marketplace
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

