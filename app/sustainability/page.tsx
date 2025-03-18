"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Recycle, TreePine, ShoppingBag, Wind } from "lucide-react"

const sustainabilityStats = [
  {
    title: "CO2 Saved",
    value: "1,234.5 kg",
    description: "Equivalent to planting 50 trees",
    icon: Wind
  },
  {
    title: "Items Recycled",
    value: "5,678",
    description: "Given a second life",
    icon: Recycle
  },
  {
    title: "Trees Equivalent",
    value: "89",
    description: "Environmental impact",
    icon: TreePine
  },
  {
    title: "Sustainable Purchases",
    value: "3,456",
    description: "Made through our platform",
    icon: ShoppingBag
  }
]

export default function SustainabilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Sustainability Impact</h1>
          <p className="text-xl text-muted-foreground">
            Making a difference through sustainable shopping
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {sustainabilityStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
              <CardDescription>
                Promoting sustainable consumption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At ReVive, we're committed to reducing environmental impact through sustainable shopping practices.
                Our platform encourages:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Reducing waste through second-hand shopping</li>
                <li>Supporting circular economy</li>
                <li>Promoting eco-friendly products</li>
                <li>Rewarding sustainable choices</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-primary" />
                How It Works
              </CardTitle>
              <CardDescription>
                Making sustainable choices easier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We make sustainable shopping accessible and rewarding:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Earn B3TR tokens for sustainable purchases</li>
                <li>Track your environmental impact</li>
                <li>Join a community of eco-conscious shoppers</li>
                <li>Support verified sustainable sellers</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Your Impact</CardTitle>
            <CardDescription>
              Start making a difference today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p>
                Every purchase you make through ReVive contributes to a more sustainable future.
                Join our community of eco-conscious shoppers and earn rewards while making a positive impact.
              </p>
              <div className="flex gap-4">
                <Button>
                  Start Shopping
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 