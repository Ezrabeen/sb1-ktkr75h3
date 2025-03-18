import { Leaf, Award, Recycle, Shield, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container py-20">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h1 className="text-5xl font-bold mb-6">About ReVive</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-300 mx-auto mb-8 rounded-full"></div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A revolutionary platform connecting eco-conscious buyers and sellers, creating a circular economy for
          pre-loved items.
        </p>
      </div>

      {/* Main Image */}
      <div className="my-16 relative rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2874&q=80"
          alt="Sustainable marketplace"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-12 text-white max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Every purchase makes a difference</h2>
            <p className="text-lg">
              By choosing pre-loved items, you're reducing waste, conserving resources, and building a more sustainable
              future.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-4xl mx-auto my-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <Globe className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold">Our Mission</h2>
        </div>

        <div className="bg-primary-50 dark:bg-primary-900/20 p-8 rounded-xl">
          <p className="text-lg mb-6">
            At ReVive, we believe that sustainability shouldn't be a compromise. Our mission is to extend the lifecycle
            of quality products, reduce waste, and reward consumers for making environmentally conscious choices.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-3 flex items-center">
                <Recycle className="h-5 w-5 text-primary-600 mr-2" />
                Reduce Manufacturing Demand
              </h3>
              <p>
                Every pre-loved item purchased is one less new item that needs to be manufactured, saving resources and
                energy.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-3 flex items-center">
                <Shield className="h-5 w-5 text-primary-600 mr-2" />
                Minimize Landfill Waste
              </h3>
              <p>
                By giving items a second life, we keep valuable materials out of landfills and reduce environmental
                pollution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-4xl mx-auto my-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <Zap className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold">How ReVive Works</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 border p-8 rounded-xl shadow-sm">
          <p className="text-lg mb-8">
            Our platform leverages blockchain technology to create a transparent, secure marketplace where buyers can
            purchase quality pre-loved items from trusted sources like eBay, Vinted, and Etsy.
          </p>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-primary-100 dark:bg-primary-900/20"></div>

            <div className="relative z-10 mb-12">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-600">1</span>
                  </div>
                </div>
                <div className="ml-8">
                  <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
                  <p className="text-muted-foreground">
                    Link your blockchain wallet to securely buy and sell items on our platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mb-12">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-600">2</span>
                  </div>
                </div>
                <div className="ml-8">
                  <h3 className="text-xl font-medium mb-2">Browse Sustainable Products</h3>
                  <p className="text-muted-foreground">
                    Explore our curated selection of pre-loved items from trusted marketplaces.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-600">3</span>
                  </div>
                </div>
                <div className="ml-8">
                  <h3 className="text-xl font-medium mb-2">Earn B3TR Tokens</h3>
                  <p className="text-muted-foreground">
                    Get rewarded with B3TR tokens for every sustainable purchase you make.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* B3TR Tokens Section */}
      <div className="max-w-4xl mx-auto my-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <Award className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold">B3TR Token Rewards</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg mb-6">
              What makes ReVive unique is our B3TR token reward system. Every purchase earns you B3TR tokens based on
              the environmental impact of your choice. The more sustainable your purchase, the more tokens you earn!
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-1">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium">High Impact Items</h4>
                  <p className="text-muted-foreground">
                    Items like clothing, electronics, and furniture earn the highest token rewards.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-1">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium">Medium Impact Items</h4>
                  <p className="text-muted-foreground">
                    Books, toys, and sports equipment provide moderate token rewards.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-1">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium">Low Impact Items</h4>
                  <p className="text-muted-foreground">
                    Accessories and decorative items still earn rewards, but at a lower rate.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 p-8 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Award className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">B3TR Tokens</h3>
              <p className="text-muted-foreground mb-4">
                Tokens can be accumulated and withdrawn to your wallet. They represent your contribution to
                sustainability and can be used for future features.
              </p>
              <Button asChild>
                <Link href="/how-it-works">Learn More About Tokens</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="max-w-4xl mx-auto my-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold">Our Technology</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 border p-8 rounded-xl shadow-sm">
          <p className="text-lg mb-6">
            ReVive is built on the VeChain Thor blockchain, chosen for its energy-efficient proof-of-authority consensus
            mechanism. This makes our platform not only functional but also environmentally responsible in its
            operations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h4 className="text-lg font-medium mb-3">Secure Wallet Integration</h4>
              <p className="text-muted-foreground">
                Connect your VeChain wallet securely to access all platform features.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h4 className="text-lg font-medium mb-3">Transparent Transactions</h4>
              <p className="text-muted-foreground">
                All transactions are recorded on the blockchain for complete transparency.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h4 className="text-lg font-medium mb-3">Smart Contract Rewards</h4>
              <p className="text-muted-foreground">B3TR tokens are automatically awarded through smart contracts.</p>
            </div>

            <div className="border rounded-lg p-6">
              <h4 className="text-lg font-medium mb-3">Marketplace Integration</h4>
              <p className="text-muted-foreground">
                Seamless connection with established marketplaces like eBay, Vinted, and Etsy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto my-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          ReVive isn't just a marketplace—it's a movement toward more conscious consumption. By choosing pre-loved
          items, you're voting for a more sustainable future with your wallet.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/how-it-works">Learn How It Works</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

