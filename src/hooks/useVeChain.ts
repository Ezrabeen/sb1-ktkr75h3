import { useState, useEffect, useCallback } from 'react';
import { connectWallet, getTokenBalance, TokenInfo } from '../services/vechain';

export function useVeChain() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const address = await connectWallet();
      setAccount(address);
      
      const tokenBalance = await getTokenBalance(address);
      setBalance(tokenBalance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (account) {
      const interval = setInterval(async () => {
        try {
          const tokenBalance = await getTokenBalance(account);
          setBalance(tokenBalance);
        } catch (err) {
          console.error('Failed to update balance:', err);
        }
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [account]);

  return {
    account,
    balance,
    loading,
    error,
    connect
  };
}