"use client"

import { useState, useEffect } from "react"

export function useWalletDetection() {
  const [isWalletAvailable, setIsWalletAvailable] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkWalletAvailability = () => {
      if (typeof window === "undefined") {
        setIsWalletAvailable(false)
        setIsLoading(false)
        return
      }

      // Check for VeWorld browser extension
      const hasVeWorldExtension = !!window.ethereum?.isVeWorld

      // Check for VeWorld mobile app
      const hasVeWorldMobile = !!window.vechain?.thor

      // Check for generic ethereum provider that might be VeWorld
      const hasGenericProvider = !!(window.ethereum && !window.ethereum.isMetaMask)

      setIsWalletAvailable(hasVeWorldExtension || hasVeWorldMobile || hasGenericProvider)
      setIsLoading(false)
    }

    checkWalletAvailability()

    // Re-check when window is focused
    const handleFocus = () => {
      checkWalletAvailability()
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  return { isWalletAvailable, isLoading }
}

