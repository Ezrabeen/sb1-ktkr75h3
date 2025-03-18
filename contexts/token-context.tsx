"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define environmental impact categories
export type ImpactCategory = "high" | "medium" | "low"

// Define token incentive rates based on impact category
const TOKEN_INCENTIVE_RATES: Record<ImpactCategory, number> = {
  high: 0.1, // 10% of purchase price
  medium: 0.05, // 5% of purchase price
  low: 0.02, // 2% of purchase price
}

// Define category impact mappings
export const CATEGORY_IMPACT_MAP: Record<string, ImpactCategory> = {
  clothing: "high",
  electronics: "high",
  furniture: "high",
  books: "medium",
  toys: "medium",
  sports: "medium",
  accessories: "low",
  other: "low",
}

interface TokenContextType {
  balance: number
  addTokens: (amount: number) => void
  withdrawTokens: (amount: number) => Promise<boolean>
  calculateIncentive: (price: number, category: string) => number
  getImpactCategory: (category: string) => ImpactCategory
}

const TokenContext = createContext<TokenContextType>({
  balance: 0,
  addTokens: () => {},
  withdrawTokens: async () => false,
  calculateIncentive: () => 0,
  getImpactCategory: () => "low",
})

export const useToken = () => useContext(TokenContext)

export function TokenProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0)

  const addTokens = (amount: number) => {
    setBalance((prev) => prev + amount)
  }

  const withdrawTokens = async (amount: number): Promise<boolean> => {
    if (amount > balance) return false

    // Simulate withdrawal delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setBalance((prev) => prev - amount)
    return true
  }

  const getImpactCategory = (category: string): ImpactCategory => {
    return CATEGORY_IMPACT_MAP[category.toLowerCase()] || "low"
  }

  const calculateIncentive = (price: number, category: string): number => {
    const impactCategory = getImpactCategory(category)
    const rate = TOKEN_INCENTIVE_RATES[impactCategory]
    return price * rate
  }

  return (
    <TokenContext.Provider
      value={{
        balance,
        addTokens,
        withdrawTokens,
        calculateIncentive,
        getImpactCategory,
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}

