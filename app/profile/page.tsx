"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToken } from "@/contexts/token-context"
import { useTransaction } from "@/contexts/transaction-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Tag, ArrowRight, Coins, User, LogOut, ShoppingBag, WavesIcon as Wave } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ProfileManagement } from "@/components/profile-management"
import { CryptoWallet } from "@/components/crypto-wallet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoginModal } from "@/components/login-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { balance } = useToken()
  const { transactions } = useTransaction()
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [activeProfileTab, setActiveProfileTab] = useState("profile")
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
    router.push("/")
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Failed to logout")
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FAToggle = async () => {
    setIsLoading(true)
    try {
      // Simulasi proses 2FA
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIs2FAEnabled(!is2FAEnabled)
      toast.success(is2FAEnabled ? "2FA disabled" : "2FA enabled")
    } catch (error) {
      toast.error("Failed to update 2FA settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailVerification = async () => {
    setIsLoading(true)
    try {
      // Simulasi proses verifikasi email
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEmailVerified(true)
      toast.success("Email verification sent")
    } catch (error) {
      toast.error("Failed to send verification email")
    } finally {
      setIsLoading(false)
    }
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

  if (!isAuthenticated || !user) {
    return (
      <div className="container py-12 max-w-4xl mx-auto">
        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
            <p className="mb-6 text-muted-foreground">
              Please connect your wallet or login to view your profile, transaction history, and B3TR token rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setIsLoginModalOpen(true)} size="lg">
                Login
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary-600 flex items-center gap-2">
        <Wave className="h-6 w-6" /> Hello, {user?.username || "User"} <ShoppingBag className="h-6 w-6 ml-1" />
      </h1>

      <Tabs value={activeProfileTab} onValueChange={setActiveProfileTab} className="mb-8">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ProfileManagement />
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Coins className="h-5 w-5 text-primary mr-2" />
                  <h2 className="text-xl font-bold">B3TR Balance</h2>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{user?.b3trBalance?.toFixed(2) || "0.00"}</div>
                <p className="text-sm text-muted-foreground">Earned from sustainable purchases</p>

                <Separator className="my-4" />

                <Button variant="outline" className="w-full" onClick={() => setIsLogoutConfirmOpen(true)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="mt-6">
          <CryptoWallet />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={is2FAEnabled}
                  onCheckedChange={handle2FAToggle}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about your account activity
                  </p>
                </div>
                <Switch defaultChecked />
                </div>
              <div className="pt-4">
                <Button variant="destructive" onClick={handleLogout} disabled={isLoading}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Tabs defaultValue="purchases" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="purchases">Purchase History</TabsTrigger>
          <TabsTrigger value="rewards">Token Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases" className="mt-6">
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={transaction.productImage || "/placeholder.svg"}
                          alt={transaction.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
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
                <p className="text-muted-foreground mb-4">You haven't made any purchases yet.</p>
                <Button asChild>
                  <Link href="/">
                    Browse Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-secondary rounded-lg">
                  <div>
                    <h3 className="font-medium">Current Balance</h3>
                    <p className="text-sm text-muted-foreground">Your available B3TR tokens</p>
                  </div>
                  <div className="text-3xl font-bold text-primary">{user?.b3trBalance?.toFixed(2) || "0.00"} B3TR</div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Reward Rates by Environmental Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border">
                      <Badge className="bg-green-500 text-white mb-2">High Impact</Badge>
                      <p className="text-2xl font-bold">Higher</p>
                      <p className="text-sm text-muted-foreground">rewards</p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <Badge className="bg-green-400 text-white mb-2">Medium Impact</Badge>
                      <p className="text-2xl font-bold">Normal</p>
                      <p className="text-sm text-muted-foreground">rewards</p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <Badge className="bg-green-300 text-green-800 mb-2">Low Impact</Badge>
                      <p className="text-2xl font-bold">Lower</p>
                      <p className="text-sm text-muted-foreground">rewards</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Recent Token Earnings</h3>
                  {transactions.length > 0 ? (
                    <div className="space-y-2">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md overflow-hidden">
                              <img
                                src={transaction.productImage || "/placeholder.svg"}
                                alt={transaction.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium line-clamp-1">{transaction.productName}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(transaction.timestamp)}</p>
                            </div>
                          </div>
                          <Badge className="bg-primary text-white">+{transaction.tokensEarned.toFixed(2)} B3TR</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No token earnings yet. Make a purchase to earn B3TR tokens!
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to reconnect your wallet to access your profile again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsLogoutConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

