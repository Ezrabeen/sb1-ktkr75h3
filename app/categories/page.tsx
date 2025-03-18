import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shirt, Smartphone, Sofa, BookOpen, Gamepad2, Dumbbell, Watch, Gift } from "lucide-react"

const categories = [
  {
    id: "clothing",
    name: "Clothing",
    description: "Pre-owned clothing items including vintage and designer pieces",
    icon: Shirt,
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    impact: "high",
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Refurbished and second-hand electronics in excellent condition",
    icon: Smartphone,
    image:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2101&q=80",
    impact: "high",
  },
  {
    id: "furniture",
    name: "Furniture",
    description: "Quality second-hand and vintage furniture pieces",
    icon: Sofa,
    image:
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    impact: "high",
  },
  {
    id: "books",
    name: "Books",
    description: "Pre-loved books in good condition across all genres",
    icon: BookOpen,
    image:
      "https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    impact: "medium",
  },
  {
    id: "toys",
    name: "Toys & Games",
    description: "Second-hand toys and games for all ages",
    icon: Gamepad2,
    image:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    impact: "medium",
  },
  {
    id: "sports",
    name: "Sports Equipment",
    description: "Pre-owned sports and fitness equipment in good condition",
    icon: Dumbbell,
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    impact: "medium",
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Second-hand accessories including bags, jewelry, and more",
    icon: Watch,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    impact: "low",
  },
  {
    id: "other",
    name: "Other Items",
    description: "Miscellaneous pre-owned items that don't fit other categories",
    icon: Gift,
    image:
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    impact: "low",
  },
]

export default function CategoriesPage() {
  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Product Categories</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse our selection of sustainable pre-loved items by category
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary-200">
              <div className="aspect-video relative">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <div className="flex items-center">
                      <category.icon className="h-5 w-5 mr-2" />
                      <h3 className="font-medium">{category.name}</h3>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description.replace("pre-owned", "pre-loved")}
                </p>
                <div className="flex items-center justify-between">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.impact === "high"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : category.impact === "medium"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {category.impact.charAt(0).toUpperCase() + category.impact.slice(1)} Impact
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

