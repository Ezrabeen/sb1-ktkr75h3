"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ShoppingBag, Coins, Leaf, Shield, Users } from "lucide-react"

export default function HowItWorksPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How ReVive Works</h1>
          <p className="text-xl text-muted-foreground">
            Join our sustainable marketplace and earn rewards
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Buy & Sell
              </CardTitle>
              <CardDescription>
                Simple and secure transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                ReVive makes it easy to buy and sell pre-loved items:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Browse through quality items</li>
                <li>Secure payment system</li>
                <li>Easy listing process</li>
                <li>Real-time tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                Earn B3TR
              </CardTitle>
              <CardDescription>
                Our native cryptocurrency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Earn B3TR tokens for your participation:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Cashback on purchases</li>
                <li>Rewards for selling</li>
                <li>Special promotions</li>
                <li>Loyalty program</li>
              </ul>
              <Button variant="outline" onClick={() => router.push("/token")}>
                Learn More About B3TR
              </Button>
            </CardContent>
          </Card>
            </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Sustainable Shopping
            </CardTitle>
            <CardDescription>
              Make a positive impact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              By choosing ReVive, you're contributing to a more sustainable future:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Reduce waste</li>
              <li>Extend product lifecycles</li>
              <li>Support circular economy</li>
              <li>Earn rewards for sustainability</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Trust & Safety
            </CardTitle>
            <CardDescription>
              Your security is our priority
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We ensure a safe and reliable platform:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Secure payments</li>
              <li>Buyer protection</li>
              <li>Seller verification</li>
              <li>24/7 support</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Join Our Community
            </CardTitle>
            <CardDescription>
              Be part of something bigger
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Connect with like-minded individuals and grow together:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Share experiences</li>
              <li>Get tips and advice</li>
              <li>Participate in events</li>
              <li>Shape the future</li>
            </ul>
            <div className="flex gap-4">
              <Button onClick={() => router.push("/marketplace")}>
                Start Shopping
            </Button>
              <Button variant="outline" onClick={() => router.push("/register")}>
                Create Account
            </Button>
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

