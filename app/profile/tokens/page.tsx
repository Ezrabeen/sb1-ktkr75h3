"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, ArrowUpRight, ArrowDownRight, History } from "lucide-react"

const tokenTransactions = [
  {
    id: 1,
    type: "earn",
    amount: 50,
    description: "Earned from sustainable purchase",
    date: "2024-03-15",
    status: "completed"
  },
  {
    id: 2,
    type: "spend",
    amount: 25,
    description: "Spent on eco-friendly product",
    date: "2024-03-14",
    status: "completed"
  },
  {
    id: 3,
    type: "earn",
    amount: 75,
    description: "Bonus for high sustainability rating",
    date: "2024-03-13",
    status: "completed"
  }
]

export default function TokensPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">B3TR Tokens</h1>
          <p className="text-xl text-muted-foreground">
            Your sustainable shopping rewards
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1,234.5 B3TR</p>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2,567 B3TR</p>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Withdraw Tokens</CardTitle>
            <CardDescription>
              Convert your B3TR tokens to fiat currency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (B3TR)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount to withdraw"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <Button className="w-full">
                Withdraw Tokens
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Your B3TR token activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="earn">Earned</TabsTrigger>
                <TabsTrigger value="spend">Spent</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {tokenTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === "earn" ? "bg-green-100" : "bg-red-100"
                      }`}>
                        {transaction.type === "earn" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className={`font-medium ${
                      transaction.type === "earn" ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.type === "earn" ? "+" : "-"}{transaction.amount} B3TR
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 