"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import dynamic from 'next/dynamic'

type VeWorldContextType = {
  isConnected: boolean
  account: string | null
  connex: any | null
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
  chainId: number | null
}

const VeWorldContext = createContext<VeWorldContextType>({
  isConnected: false,
  account: null,
  connex: null,
  balance: "0",
  connect: async () => {},
  disconnect: () => {},
  chainId: null,
})

export const useVeWorld = () => useContext(VeWorldContext)

// Helper to format VET balance
const formatVET = (wei: string): string => {
  const vet = Number(wei) / Math.pow(10, 18);
  return vet.toFixed(4);
}

export function VeWorldProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [connex, setConnex] = useState<any | null>(null)
  const [balance, setBalance] = useState("0")
  const [chainId, setChainId] = useState<number | null>(null)
  const [connexClass, setConnexClass] = useState<any>(null);

  // Initialize Connex
  useEffect(() => {
    const initConnex = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Menggunakan dynamic import dengan ssr: false untuk mencegah loading di server
        const Connex = (await import('@vechain/connex')).default;
        const newConnex = new Connex({
          node: 'https://testnet.vechain.org/',
          network: 'test'
        });
        setConnex(newConnex);
        setConnexClass(Connex);
        setChainId(40);
      } catch (error) {
        console.error("Failed to initialize Connex:", error);
      }
    };
    
    initConnex();
  }, []);

  // Connect to VeWorld wallet
  const connect = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      if (!connex) {
        alert("Connection to VeChain node failed. Please try again.");
        return;
      }

      const vendor = connexClass ? new connexClass.Vendor('test') : null;
      if (!vendor) return;

      try {
        const certificateResponse = await vendor.sign('cert', {
          purpose: 'identification',
          payload: {
            type: 'text',
            content: 'Please sign to connect to the app'
          }
        });
        
        const signer = certificateResponse.annex?.signer || 
                      (certificateResponse as any).signer;

        if (signer) {
          setAccount(signer);
          const account = connex.thor.account(signer);
          const accountInfo = await account.get();
          setBalance(formatVET(accountInfo.balance));
          
          setIsConnected(true);
        } else {
          console.error('Tidak dapat menemukan alamat signer');
        }
      } catch (error) {
        console.error("Error connecting with Connex:", error);
        alert("Failed to connect to VeWorld wallet. Make sure Sync2 is installed and unlocked.");
      }
    } catch (error) {
      console.error("Error connecting to VeWorld wallet:", error)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAccount(null)
    setBalance("0")
  }

  // Update balance periodically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let intervalId: NodeJS.Timeout;
    
    if (isConnected && connex && account) {
      const updateBalance = async () => {
        try {
          const accountObj = connex.thor.account(account);
          const accountInfo = await accountObj.get();
          setBalance(formatVET(accountInfo.balance));
        } catch (error) {
          console.error("Error updating balance:", error);
        }
      };
      
      // Update balance every 30 seconds
      intervalId = setInterval(updateBalance, 30000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isConnected, connex, account]);

  return (
    <VeWorldContext.Provider
      value={{
        isConnected,
        account,
        connex,
        balance,
        connect,
        disconnect,
        chainId,
      }}
    >
      {children}
    </VeWorldContext.Provider>
  )
}

