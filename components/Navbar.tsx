"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useNetwork } from "@/contexts/network-context"
import { useToken } from "@/contexts/token-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { Button } from "@/components/ui/button"
import { Heart, User, Menu, X, Leaf, ChevronDown, ShoppingCart, LayoutDashboard } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LoginModal } from "@/components/login-modal"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const { network, isTestnetMaintenance } = useNetwork()
  const { balance } = useToken()
  const { cartItems } = useCart()
  const { wishlistCount } = useWishlist()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "About", path: "/about", className: "ml-2" },
  ]

  const handleNavLinkClick = (path: string) => {
    setIsMobileMenuOpen(false)
    router.push(path)
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    console.log("Auth status:", { isAuthenticated, user })
  }, [isAuthenticated, user])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-200",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b"
          : "bg-transparent border-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex items-center mb-8">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Leaf className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl font-serif bg-gradient-to-r from-primary-600 to-primary-400 text-transparent bg-clip-text">
                      ReVive
                    </span>
                  </Link>
                  <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                <nav className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <button
                        key={link.path}
                        onClick={() => handleNavLinkClick(link.path)}
                        className={cn(
                          "text-base font-medium transition-colors text-left px-2 py-1.5 rounded",
                          pathname === link.path
                            ? "text-primary bg-primary-50/50"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                          link.className,
                        )}
                      >
                        {link.name}
                      </button>
                    ))}
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-4">Categories</p>
                    <div className="grid grid-cols-2 gap-3">
                      {["Clothing", "Electronics", "Furniture", "Books", "Toys", "Sports"].map((category) => (
                        <button
                          key={category}
                          onClick={() => handleNavLinkClick(`/categories/${category.toLowerCase()}`)}
                          className="text-sm hover:text-primary transition-colors text-left"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-4">Account</p>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleNavLinkClick("/profile")}
                        className="flex items-center text-sm hover:text-primary transition-colors text-left w-full"
                      >
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </button>
                      <button
                        onClick={() => handleNavLinkClick("/wishlist")}
                        className="flex items-center text-sm hover:text-primary transition-colors text-left w-full"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist
                      </button>
                      <button
                        onClick={() => handleNavLinkClick("/cart")}
                        className="flex items-center text-sm hover:text-primary transition-colors text-left w-full"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Cart
                      </button>
                      <button
                        onClick={() => handleNavLinkClick("/dashboard")}
                        className="flex items-center text-sm hover:text-primary transition-colors text-left w-full"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </button>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2.5">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl font-serif bg-gradient-to-r from-primary-600 to-primary-400 text-transparent bg-clip-text">
                ReVive
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.path ? "text-primary" : "text-muted-foreground",
                    link.className,
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    Categories
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {["Clothing", "Electronics", "Furniture", "Books", "Toys", "Sports"].map((category) => (
                    <DropdownMenuItem key={category} asChild>
                      <Link href={`/categories/${category.toLowerCase()}`} className="w-full">
                        {category}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative" aria-label="Shopping Cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>
              </Link>

              <ThemeToggle />

              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative" aria-label="User menu">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2 border-b">
                      <p className="text-sm font-medium">{user?.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.walletAddress}</p>
                    </div>
                    <div className="p-2 border-b">
                      <p className="text-xs text-muted-foreground">B3TR Balance</p>
                      <p className="text-sm font-medium text-primary">{balance.toFixed(2)} B3TR</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/purchases">Purchase History</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/tokens">Token Rewards</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden md:flex items-center gap-2"
                  disabled={network === "testnet" && isTestnetMaintenance}
                >
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MvAahbVuY5U7kkd2xfevPJCjFFZFu2.png"
                    alt="VeWorld"
                    className="h-4 w-auto object-contain"
                  />
                  Connect VeWorld
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {network === "testnet" && isTestnetMaintenance && (
        <div className="bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 py-1 text-center text-xs">
          <div className="container">Network maintenance in progress. Some features may be limited.</div>
        </div>
      )}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  )
}

