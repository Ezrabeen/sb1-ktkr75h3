"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useWallet } from "@/contexts/wallet-context"
import { useVeChain } from "@/providers/VeChainProvider"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState("veworld")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [walletConnecting, setWalletConnecting] = useState(false)
  const { login, register, loginWithSocial } = useAuth()
  const { connect: connectWallet } = useWallet()
  const { connect: connectVeChain, account: veChainAccount, isConnecting } = useVeChain()
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        // Connect wallet automatically after login
        await connectWallet()
        toast({
          title: "Login successful",
          description: "You have been logged in successfully",
        })
        onClose()
        // Force a refresh to ensure all components update
        router.refresh()
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "There was an error logging in",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await register(username, email, password)
      if (success) {
        // Connect wallet automatically after registration
        await connectWallet()
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully",
        })
        onClose()
        // Force a refresh to ensure all components update
        router.refresh()
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "There was an error creating your account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "veworld" | "x" | "google" | "phone") => {
    setIsLoading(true)

    try {
      const identifier = provider === "google" ? "user@example.com" : provider === "phone" ? "+1234567890" : ""
      const success = await loginWithSocial(provider, identifier)

      if (success) {
        // Connect wallet automatically after social login
        await connectWallet()
        toast({
          title: "Login successful",
          description: `You have been logged in with ${provider}`,
        })
        onClose()
        // Force a refresh to ensure all components update
        router.refresh()
      }
    } catch (error) {
      console.error(`${provider} login error:`, error)
      toast({
        title: "Login failed",
        description: `There was an error logging in with ${provider}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVeWorldLogin = async () => {
    setWalletConnecting(true);
    try {
      // Connect to VeWorld/Sync2 with proper error handling
      try {
        await connectVeChain();
        
        if (veChainAccount) {
          console.log('Wallet connected, proceeding with login:', veChainAccount);
          
          // Store the wallet address in a variable for clarity
          const walletAddress = veChainAccount;
          
          // Login with the connected wallet address
          const success = await loginWithSocial("veworld", walletAddress);
          
          if (success) {
            toast({
              title: "Login successful",
              description: `Connected with wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
            });
            
            // Additional logging for testnet confirmation
            console.log('Connected to testnet with wallet:', walletAddress);
            
            onClose();
            router.refresh();
          } else {
            toast({
              title: "Login failed",
              description: "There was an error logging in with wallet",
              variant: "destructive",
            });
          }
        } else {
          console.error('No wallet account after connect');
          toast({
            title: "Wallet connection failed",
            description: "Please make sure VeWorld wallet is installed and unlocked",
            variant: "destructive",
          });
        }
      } catch (connectionError: any) {
        console.error("Wallet connection error:", connectionError);
        
        // Check for user rejection errors
        if (connectionError.name === 'UserRejectedRequestError' || 
            connectionError.message?.includes('Access Denied') ||
            connectionError.message?.includes('User denied') ||
            connectionError.message?.includes('User rejected')) {
          toast({
            title: "Access Denied",
            description: "You have rejected the connection request. Please try again and approve the connection.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Connection failed",
            description: "Could not connect to VeWorld wallet. Please check if it's installed and unlocked.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("VeWorld login error:", error);
      toast({
        title: "Login failed",
        description: "There was an error connecting to VeWorld wallet",
        variant: "destructive",
      });
    } finally {
      setWalletConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Access</DialogTitle>
          <DialogDescription>
            Connect with VeWorld wallet or login with email and password.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="veworld" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="veworld">VeWorld</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="veworld" className="space-y-4 py-4">
            <div className="p-4 border rounded-lg bg-muted/30 text-center space-y-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MvAahbVuY5U7kkd2xfevPJCjFFZFu2.png"
                alt="VeWorld"
                className="h-12 w-auto mx-auto"
              />
              <p className="text-sm text-muted-foreground">
                The simplest way to log in is with VeWorld wallet. You'll be prompted to sign a message to verify your identity.
              </p>
              
              <Button 
                onClick={handleVeWorldLogin} 
                className="w-full"
                disabled={walletConnecting || isConnecting}
              >
                {(walletConnecting || isConnecting) ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MvAahbVuY5U7kkd2xfevPJCjFFZFu2.png"
                    alt="VeWorld"
                    className="h-4 w-auto mr-2"
                  />
                )}
                {walletConnecting || isConnecting ? "Connecting..." : "Connect with VeWorld"}
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                Don't have VeWorld wallet? <a href="https://www.veworld.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Download here</a>
              </p>
              
              <div className="pt-4 border-t mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Alternative: If you don't have VeWorld, you can also use Sync2
                </p>
                <a href="https://sync.vecha.in/" target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">
                  Download Sync2
                </a>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="login" className="space-y-4 py-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Login
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => setActiveTab("veworld")}
                className="flex items-center justify-center gap-2"
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MvAahbVuY5U7kkd2xfevPJCjFFZFu2.png"
                  alt="VeWorld"
                  className="h-4 w-auto"
                />
                VeWorld
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 py-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Register
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

