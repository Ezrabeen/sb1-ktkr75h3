"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Trophy, Users, ShoppingBag, Leaf } from "lucide-react"

// Data dummy untuk grafik
const rewardData = [
  { date: "2024-01", amount: 100 },
  { date: "2024-02", amount: 150 },
  { date: "2024-03", amount: 200 },
  { date: "2024-04", amount: 250 },
  { date: "2024-05", amount: 300 },
]

const transactionData = [
  { date: "2024-01", count: 5 },
  { date: "2024-02", count: 8 },
  { date: "2024-03", count: 12 },
  { date: "2024-04", count: 15 },
  { date: "2024-05", count: 20 },
]

// Data dummy untuk leaderboard
const topContributors = [
  { username: "EcoWarrior", totalB3TR: 2847.32, transactions: 47, impact: "High" },
  { username: "GreenLife", totalB3TR: 2156.89, transactions: 42, impact: "High" },
  { username: "Sustainable", totalB3TR: 1876.45, transactions: 35, impact: "Medium" },
  { username: "RecyclePro", totalB3TR: 1567.23, transactions: 31, impact: "Medium" },
  { username: "EcoFriendly", totalB3TR: 1245.67, transactions: 28, impact: "Low" },
]

const topSellers = [
  { username: "VintageKing", totalSales: 127, totalB3TR: 3247.89, rating: 4.9 },
  { username: "EcoStore", totalSales: 103, totalB3TR: 2876.54, rating: 4.8 },
  { username: "GreenMarket", totalSales: 92, totalB3TR: 2456.78, rating: 4.7 },
  { username: "RecycleHub", totalSales: 78, totalB3TR: 1987.65, rating: 4.6 },
  { username: "SustainableShop", totalSales: 68, totalB3TR: 1789.43, rating: 4.5 },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("rewards")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234.56 B3TR</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">300 B3TR</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div key={contributor.username} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{contributor.username}</p>
                      <p className="text-sm text-muted-foreground">{contributor.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{contributor.totalB3TR} B3TR</p>
                    <p className="text-sm text-muted-foreground">{contributor.impact} Impact</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Top Sellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellers.map((seller, index) => (
                <div key={seller.username} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{seller.username}</p>
                      <p className="text-sm text-muted-foreground">{seller.totalSales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{seller.totalB3TR} B3TR</p>
                    <p className="text-sm text-muted-foreground">⭐ {seller.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rewards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>B3TR Rewards Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rewardData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Dummy listing data */}
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Product {item}</h3>
                      <p className="text-sm text-muted-foreground">Listed on May {item}, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(100 + item * 10).toFixed(2)} B3TR</p>
                      <p className="text-sm text-muted-foreground">3 views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

