import Link from "next/link"
import { Leaf, Twitter, Instagram, Facebook, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">ReVive</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              A sustainable marketplace for pre-loved items. Buy, sell, and earn rewards for making eco-friendly
              choices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-base mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/marketplace"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/category/clothing"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  href="/category/electronics"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/category/furniture"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Furniture
                </Link>
              </li>
              <li>
                <Link
                  href="/category/books"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Books
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-base mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/profile/purchases"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Purchase History
                </Link>
              </li>
              <li>
                <Link
                  href="/profile/tokens"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  B3TR Tokens
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-base mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About ReVive
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Sustainability Impact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ReVive. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

