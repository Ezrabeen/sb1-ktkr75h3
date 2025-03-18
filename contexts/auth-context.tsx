"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useDemoWallet } from "@/providers/demo-wallet-provider"
import { useToast } from "@/components/ui/use-toast"

// Define user profile type
export type UserProfile = {
  id: string
  username: string
  email: string | null
  phone: string | null
  walletAddress: string
  createdAt: Date
  b3trBalance?: number // Added B3TR balance
}

// Define authentication context type
interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  register: (username: string, email: string, password: string) => Promise<boolean>
  login: (identifier: string, password: string) => Promise<boolean>
  loginWithSocial: (provider: "veworld" | "x" | "google" | "phone", identifier: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<Omit<UserProfile, "id" | "walletAddress" | "createdAt">>) => Promise<boolean>
  updateB3TRBalance: (amount: number) => void // Added method to update B3TR balance
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  register: async () => false,
  login: async () => false,
  loginWithSocial: async () => false,
  logout: () => {},
  updateProfile: async () => false,
  updateB3TRBalance: () => {},
})

// Generate a mock wallet address
const generateWalletAddress = (): string => {
  return `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
}

// Generate a unique user ID
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Generate random B3TR balance
const generateRandomB3TRBalance = (): number => {
  return Math.floor(Math.random() * 1000) + 100 // Random balance between 100 and 1100
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const demoWallet = useDemoWallet()
  const { toast } = useToast()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Periksa apakah ada data user di localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)

          // Add B3TR balance if it doesn't exist
          if (!parsedUser.b3trBalance) {
            parsedUser.b3trBalance = generateRandomB3TRBalance()
          }

          setUser(parsedUser)

          // Connect the demo wallet with the stored wallet address
          if (parsedUser.walletAddress) {
            await demoWallet.connect(parsedUser.walletAddress)
          }
        }
      } catch (error) {
        console.error("Error checking session:", error)
        // Jangan hapus user state jika terjadi error
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [demoWallet])

  // Update B3TR balance
  const updateB3TRBalance = (amount: number) => {
    if (!user) return

    const updatedUser = {
      ...user,
      b3trBalance: amount,
    }

    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  // Register a new user
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Generate a unique wallet address
      const walletAddress = generateWalletAddress()

      // Create a new user profile
      const newUser: UserProfile = {
        id: generateUserId(),
        username,
        email,
        phone: null,
        walletAddress,
        createdAt: new Date(),
        b3trBalance: generateRandomB3TRBalance(),
      }

      // Store user in localStorage (in a real app, this would be a server call)
      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)

      // Connect the demo wallet
      await demoWallet.connect(walletAddress)
      demoWallet.setUserProfile({ username, email })

      toast({
        title: "Registration successful",
        description: "Your account has been created and wallet generated",
      })

      return true
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "There was an error creating your account",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Login with email/username and password
  const login = async (identifier: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // In a real app, this would validate credentials against a server
      // For demo purposes, we'll create a mock user if one doesn't exist

      // Check if user exists in localStorage
      const storedUser = localStorage.getItem("user")
      let userToLogin: UserProfile

      if (storedUser) {
        userToLogin = JSON.parse(storedUser)

        // Add B3TR balance if it doesn't exist
        if (!userToLogin.b3trBalance) {
          userToLogin.b3trBalance = generateRandomB3TRBalance()
        }
      } else {
        // Create a new user if one doesn't exist (for demo purposes)
        const walletAddress = generateWalletAddress()
        userToLogin = {
          id: generateUserId(),
          username: identifier.includes("@") ? identifier.split("@")[0] : identifier,
          email: identifier.includes("@") ? identifier : null,
          phone: null,
          walletAddress,
          createdAt: new Date(),
          b3trBalance: generateRandomB3TRBalance(),
        }
      }

      // Simpan user ke localStorage
      localStorage.setItem("user", JSON.stringify(userToLogin))

      // Update state
      setUser(userToLogin)

      // Connect the demo wallet
      await demoWallet.connect(userToLogin.walletAddress)
      demoWallet.setUserProfile({
        username: userToLogin.username,
        email: userToLogin.email || "",
      })

      console.log("Login successful, user state updated:", userToLogin)

      toast({
        title: "Login successful",
        description: "Welcome back!",
      })

      return true
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Login with social provider
  const loginWithSocial = async (
    provider: "veworld" | "x" | "google" | "phone",
    identifier: string,
  ): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Generate user data based on provider
      let username: string
      let email: string | null = null
      let phone: string | null = null

      switch (provider) {
        case "veworld":
          username = "VeWorld_User"
          email = "veworld_user@example.com"
          break
        case "x":
          // Randomly choose between veHunt and veHunt3r
          if (Math.random() > 0.5) {
            username = "veHunt"
            email = "vehunt@example.com"
          } else {
            username = "veHunt3r"
            email = "vehunt3r@gmail.com"
          }
          break
        case "google":
          // Randomly choose between the provided email and hershel
          if (Math.random() > 0.5) {
            username = identifier.split("@")[0]
            email = identifier
          } else {
            username = "hershel"
            email = "hershelbeen@gmail.com"
          }
          break
        case "phone":
          username = `user_${identifier.replace(/\D/g, "").slice(-4)}`
          phone = identifier
          break
        default:
          username = "user"
      }

      // Generate a unique wallet address
      const walletAddress = generateWalletAddress()

      // Create a new user profile
      const newUser: UserProfile = {
        id: generateUserId(),
        username,
        email,
        phone,
        walletAddress,
        createdAt: new Date(),
        b3trBalance: generateRandomB3TRBalance(),
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(newUser))

      // Update state
      setUser(newUser)

      // Connect the demo wallet
      await demoWallet.connect(walletAddress)
      demoWallet.setUserProfile({
        username,
        email: email || "",
      })

      console.log("Social login successful, user state updated:", newUser)

      toast({
        title: "Login successful",
        description: `Welcome, ${username}!`,
      })

      return true
    } catch (error) {
      console.error("Social login error:", error)
      toast({
        title: "Login failed",
        description: "There was an error with social login",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    demoWallet.disconnect()
    localStorage.removeItem("user")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  // Update user profile
  const updateProfile = async (
    data: Partial<Omit<UserProfile, "id" | "walletAddress" | "createdAt">>,
  ): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)
    try {
      // Update user data
      const updatedUser = {
        ...user,
        ...data,
      }

      // Store updated user in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      // Update demo wallet profile
      demoWallet.setUserProfile({
        username: updatedUser.username,
        email: updatedUser.email || "",
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      })

      return true
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        register,
        login,
        loginWithSocial,
        logout,
        updateProfile,
        updateB3TRBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext)

