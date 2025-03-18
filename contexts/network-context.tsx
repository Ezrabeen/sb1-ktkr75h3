"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type NetworkType = "testnet" | "demo"

interface NetworkContextType {
  network: NetworkType
  setNetwork: (network: NetworkType) => void
  isTestnetMaintenance: boolean
  toggleTestnetMaintenance: () => void // Added function to toggle maintenance mode
}

const NetworkContext = createContext<NetworkContextType>({
  network: "demo",
  setNetwork: () => {},
  isTestnetMaintenance: false,
  toggleTestnetMaintenance: () => {},
})

export const useNetwork = () => useContext(NetworkContext)

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<NetworkType>("demo")
  const [isTestnetMaintenance, setIsTestnetMaintenance] = useState(false)

  // Function to toggle testnet maintenance mode
  const toggleTestnetMaintenance = () => {
    setIsTestnetMaintenance((prev) => !prev)
  }

  // Load network settings from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNetwork = localStorage.getItem("network")
      const savedMaintenance = localStorage.getItem("testnetMaintenance")

      if (savedNetwork === "testnet" || savedNetwork === "demo") {
        setNetwork(savedNetwork)
      }

      if (savedMaintenance === "true") {
        setIsTestnetMaintenance(true)
      }
    }
  }, [])

  // Save network settings to localStorage when changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("network", network)
      localStorage.setItem("testnetMaintenance", isTestnetMaintenance.toString())
    }
  }, [network, isTestnetMaintenance])

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
        isTestnetMaintenance,
        toggleTestnetMaintenance,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

