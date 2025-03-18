"use client"

import { useTransaction } from "@/contexts/transaction-context"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, ArrowLeft, ExternalLink, Tag, Calendar, Clock } from "lucide-react"
import Link from "next/link"

export default function PurchasesPage() {
  const { transactions } = useTransaction()
  const { isConnected, connect } = useWallet()

  if (!isConnected) {
    return (
      <div className="container py-20 max-w-4xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="mb-6 text-muted-foreground">Please connect your wallet to view your purchase history.</p>
            <Button onClick={connect}>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getMarketplaceColor = (marketplace: string) => {
    switch (marketplace) {
      case "ebay":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "vinted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "etsy":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="container py-20 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link
          href="/profile"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Link>
        <h1 className="text-3xl font-bold ml-auto">Purchase History</h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="all">All Purchases</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="oldest">Oldest</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {transactions.length > 0 ? (
            <div className="space-y-6">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-32 h-32">
                        <img
                          src={transaction.productImage || "/placeholder.svg"}
                          alt={transaction.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <h3 className="font-medium">{transaction.productName}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getMarketplaceColor(transaction.marketplace)} variant="outline">
                              <Tag className="h-3 w-3 mr-1" />
                              {transaction.marketplace.charAt(0).toUpperCase() + transaction.marketplace.slice(1)}
                            </Badge>
                            <Badge variant="outline">
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Order ID</span>
                            <span className="text-sm font-mono">{transaction.orderId}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Date</span>
                            <span className="text-sm">{formatDate(transaction.timestamp)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Amount</span>
                            <span className="text-sm">
                              {transaction.currency} {transaction.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">B3TR Earned</span>
                            <span className="text-sm text-primary font-medium">
                              {transaction.tokensEarned.toFixed(2)} B3TR
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Transaction Hash</span>
                            <span className="text-sm font-mono truncate max-w-[200px]">
                              {transaction.txHash.substring(0, 18)}...
                            </span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={transaction.productLink} target="_blank" rel="noopener noreferrer">
                              View Product
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium mb-2">No purchases yet</h2>
                <p className="text-muted-foreground mb-6">You haven't made any purchases yet.</p>
                <Button asChild>
                  <Link href="/marketplace">Browse Marketplace</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recent">
          {transactions.length > 0 ? (
            <div className="space-y-6">
              {[...transactions]
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 5)
                .map((transaction) => (
                  <Card key={transaction.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-32 h-32">
                          <img
                            src={transaction.productImage || "/placeholder.svg"}
                            alt={transaction.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <h3 className="font-medium">{transaction.productName}</h3>
                            <div className="flex items-center gap-2">
                              <Badge className={getMarketplaceColor(transaction.marketplace)} variant="outline">
                                <Tag className="h-3 w-3 mr-1" />
                                {transaction.marketplace.charAt(0).toUpperCase() + transaction.marketplace.slice(1)}
                              </Badge>
                              <Badge variant="outline">
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Order ID</span>
                              <span className="text-sm font-mono">{transaction.orderId}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Date</span>
                              <span className="text-sm">{formatDate(transaction.timestamp)}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Amount</span>
                              <span className="text-sm">
                                {transaction.currency} {transaction.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">B3TR Earned</span>
                              <span className="text-sm text-primary font-medium">
                                {transaction.tokensEarned.toFixed(2)} B3TR
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Transaction Hash</span>
                              <span className="text-sm font-mono truncate max-w-[200px]">
                                {transaction.txHash.substring(0, 18)}...
                              </span>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={transaction.productLink} target="_blank" rel="noopener noreferrer">
                                View Product
                                <ExternalLink className="ml-2 h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium mb-2">No recent purchases</h2>
                <p className="text-muted-foreground mb-6">You haven't made any purchases recently.</p>
                <Button asChild>
                  <Link href="/marketplace">Browse Marketplace</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="oldest">
          {transactions.length > 0 ? (
            <div className="space-y-6">
              {[...transactions]
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((transaction) => (
                  <Card key={transaction.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-32 h-32">
                          <img
                            src={transaction.productImage || "/placeholder.svg"}
                            alt={transaction.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <h3 className="font-medium">{transaction.productName}</h3>
                            <div className="flex items-center gap-2">
                              <Badge className={getMarketplaceColor(transaction.marketplace)} variant="outline">
                                <Tag className="h-3 w-3 mr-1" />
                                {transaction.marketplace.charAt(0).toUpperCase() + transaction.marketplace.slice(1)}
                              </Badge>
                              <Badge variant="outline">
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Order ID</span>
                              <span className="text-sm font-mono">{transaction.orderId}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Date</span>
                              <span className="text-sm">{formatDate(transaction.timestamp)}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Amount</span>
                              <span className="text-sm">
                                {transaction.currency} {transaction.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">B3TR Earned</span>
                              <span className="text-sm text-primary font-medium">
                                {transaction.tokensEarned.toFixed(2)} B3TR
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Transaction Hash</span>
                              <span className="text-sm font-mono truncate max-w-[200px]">
                                {transaction.txHash.substring(0, 18)}...
                              </span>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={transaction.productLink} target="_blank" rel="noopener noreferrer">
                                View Product
                                <ExternalLink className="ml-2 h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium mb-2">No purchase history</h2>
                <p className="text-muted-foreground mb-6">You haven't made any purchases yet.</p>
                <Button asChild>
                  <Link href="/marketplace">Browse Marketplace</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

