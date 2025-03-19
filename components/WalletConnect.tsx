'use client';

import { Button } from "@/components/ui/button";
import { useVeChain } from "@/providers/VeChainProvider";
import { useEffect, useState } from "react";

export function WalletConnect() {
  const { account, balance, connect, disconnect, isConnecting } = useVeChain();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format wallet address to short format (0x12..abcd)
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      await connect();
    } catch (err) {
      setError("Failed to connect wallet. Make sure you have VeWorld or Sync2 installed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {account ? (
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <p className="font-medium">{formatWalletAddress(account)}</p>
            <p className="text-muted-foreground">{balance ? `${balance} VET` : '0 VET'}</p>
          </div>
          <Button variant="outline" onClick={disconnect}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          onClick={handleConnect} 
          disabled={loading || isConnecting}
          className="flex items-center gap-2"
        >
          {(loading || isConnecting) ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Connecting...
            </>
          ) : (
            <>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MvAahbVuY5U7kkd2xfevPJCjFFZFu2.png"
                alt="VeWorld"
                className="h-4 w-auto"
              />
              Connect Wallet
            </>
          )}
        </Button>
      )}
    </div>
  );
} 