import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Recycle, ShieldCheck, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="pt-16">
        <div className="container">
          <div className="relative mb-16 text-center">
            <div className="relative">
              <h1 className="text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-tight font-serif">
                <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 text-transparent bg-clip-text animate-float inline-block">
                  ReVive
                </span>
              </h1>
              <div className="absolute -z-10 inset-0 blur-3xl opacity-20 bg-primary-300 rounded-full transform scale-150"></div>
            </div>

            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-primary-50 text-primary-600 mt-4">
              <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
              Sustainable Marketplace
            </div>

            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-300 mx-auto my-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Give Pre-owned Items a <span className="text-primary inline-block">Second Life</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-[600px]">
                ReVive is a sustainable marketplace for pre-loved items. Buy and sell quality second-hand products with
                secure blockchain transactions and earn rewards for your eco-friendly choices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2">
                  Browse Marketplace
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-card">
              <img
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
                alt="Sustainable marketplace"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="text-lg font-medium">Reduce waste, save money, earn rewards</p>
                  <p className="text-sm opacity-80">Every purchase helps the environment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="container">
          <ProductGrid />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              ReVive makes buying and selling pre-loved items simple, secure, and sustainable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-xl shadow-soft text-center relative">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Connect Your Wallet</h3>
              <p className="text-muted-foreground">
                Link your blockchain wallet to securely buy and sell items on our platform.
              </p>
            </div>

            <div className="bg-background p-8 rounded-xl shadow-soft text-center relative">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Browse or List Items</h3>
              <p className="text-muted-foreground">Find quality pre-owned products or list your own items for sale.</p>
            </div>

            <div className="bg-background p-8 rounded-xl shadow-soft text-center relative">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Earn B3TR Tokens</h3>
              <p className="text-muted-foreground">
                Get rewarded with B3TR tokens for every sustainable purchase you make.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Choose ReVive?</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Our platform offers unique benefits for eco-conscious shoppers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border rounded-xl hover:border-primary-200 transition-colors">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Secure Transactions</h3>
              <p className="text-muted-foreground">
                All transactions are secured by blockchain technology, ensuring transparency and immutability.
              </p>
            </div>

            <div className="p-6 border rounded-xl hover:border-primary-200 transition-colors">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <Recycle className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Sustainable Marketplace</h3>
              <p className="text-muted-foreground">
                Our platform promotes sustainable and ethically sourced products, reducing environmental impact.
              </p>
            </div>

            <div className="p-6 border rounded-xl hover:border-primary-200 transition-colors">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Token Rewards</h3>
              <p className="text-muted-foreground">
                Earn B3TR tokens for every purchase based on the environmental impact of your choices.
              </p>
            </div>

            <div className="p-6 border rounded-xl hover:border-primary-200 transition-colors">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Fast & Efficient</h3>
              <p className="text-muted-foreground">
                Experience quick transaction times and low fees on our blockchain-based platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16 rounded-3xl mx-4 sm:mx-8">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-primary-50 mb-8">
              Join thousands of eco-conscious shoppers who are reducing waste and earning rewards through sustainable
              shopping.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50">
              <Link href="/marketplace">Start Shopping Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

