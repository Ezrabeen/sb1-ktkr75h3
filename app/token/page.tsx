"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Coins, Gift, Shield, TrendingUp } from "lucide-react"

export default function TokenPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">B3TR Token</h1>
          <p className="text-xl text-muted-foreground">
            The native cryptocurrency of ReVive marketplace
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                What is B3TR?
              </CardTitle>
              <CardDescription>
                Understanding our native cryptocurrency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                B3TR is the native cryptocurrency of the ReVive marketplace, designed to facilitate
                transactions and reward active participants in our ecosystem. It's a digital asset
                with real monetary value that can be used for:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Purchasing items from sellers</li>
                <li>Receiving rewards for selling items</li>
                <li>Participating in special promotions</li>
                <li>Accessing premium features</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Benefits
              </CardTitle>
              <CardDescription>
                Why use B3TR?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Using B3TR comes with several advantages for both buyers and sellers:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Lower transaction fees</li>
                <li>Instant payments</li>
                <li>Secure transactions</li>
                <li>Earn rewards for participation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Seller Loyalty Program
            </CardTitle>
            <CardDescription>
              Earn more with B3TR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Cashback Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Earn 2% cashback in B3TR for every successful sale
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Tier Benefits</h3>
                <p className="text-sm text-muted-foreground">
                  Higher tiers unlock more rewards and features
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">How to Participate</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Connect your VeWorld wallet</li>
                <li>Start selling items on ReVive</li>
                <li>Receive B3TR rewards automatically</li>
                <li>Use rewards for purchases or withdraw</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security & Transparency
            </CardTitle>
            <CardDescription>
              Your assets are safe with us
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We prioritize the security and transparency of B3TR transactions:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>All transactions are recorded on the blockchain</li>
              <li>Smart contract security audits</li>
              <li>Regular transparency reports</li>
              <li>Community governance participation</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          {isAuthenticated ? (
            <Button size="lg" onClick={() => router.push("/dashboard")}>
              View Your B3TR Balance
            </Button>
          ) : (
            <Button size="lg" onClick={() => router.push("/login")}>
              Get Started with B3TR
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 