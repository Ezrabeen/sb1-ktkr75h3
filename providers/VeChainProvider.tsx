'use client';

import { createContext, useContext, useEffect, useState } from 'react';

/**
 * VeChainProvider
 * 
 * This provider integrates with VeChain blockchain by creating and managing the Connex instance.
 * It handles wallet connection, transaction signing, and blockchain interaction.
 * 
 * Key responsibilities:
 * - Initialize connection to the VeChain network
 * - Manage wallet connection state
 * - Provide blockchain interaction methods to child components
 * - Handle network switching between mainnet and testnet
 */

// Types for wallets
interface WalletAccount {
  address: string;
}

interface VeChainContextType {
  connex: any | null;
  account: string | null;
  balance: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendTransaction: (clauses: any[]) => Promise<string>;
}

const VeChainContext = createContext<VeChainContextType | null>(null);

// Helper to format wei to VET
const formatVET = (wei: string): string => {
  const vet = Number(wei) / Math.pow(10, 18);
  return vet.toFixed(4);
}

export function VeChainProvider({ children }: { children: React.ReactNode }) {
  const [connex, setConnex] = useState<any | null>(null);
  const [vendor, setVendor] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize Connex only on client side
  useEffect(() => {
    const initConnex = async () => {
      try {
        // Dynamic import to avoid server-side errors
        const { default: Connex } = await import('@vechain/connex');
        
        // Explicitly set to testnet for testing
        const nodeUrl = 'https://testnet.vechain.org/';
        const network = 'test';
        
        console.log('Initializing Connex with testnet:', nodeUrl);
        
        // Initialize for testnet
        const newConnex = new Connex({
          node: nodeUrl,
          network: network
        });
        setConnex(newConnex);
        
        // Initialize vendor
        setVendor(new Connex.Vendor(network));
        
        console.log('Connex initialized successfully with testnet network');
      } catch (error) {
        console.error('Failed to initialize Connex:', error);
      }
    };

    if (typeof window !== 'undefined') {
      initConnex();
    }
  }, []);

  const connect = async () => {
    if (typeof window === 'undefined') return;
    
    setIsConnecting(true);
    
    try {
      // Check for VeWorld availability
      if ((window as any).vechain) {
        try {
          console.log('Connecting to VeWorld on testnet...');
          
          // Use a try/catch block specifically for the request method
          try {
            const accounts = await (window as any).vechain.request({ method: 'eth_requestAccounts' });
            if (accounts && accounts.length > 0) {
              const address = accounts[0];
              console.log('VeWorld connected with address:', address);
              
              setAccount(address);
              setIsConnected(true);
              
              // Get balance if connex is available
              if (connex) {
                const acc = connex.thor.account(address);
                const accInfo = await acc.get();
                const formattedBalance = formatVET(accInfo.balance);
                setBalance(formattedBalance);
                console.log('Account balance:', formattedBalance, 'VET');
              }
              
              console.log('Successfully connected to VeWorld on testnet');
              return;
            }
          } catch (requestError: any) {
            console.error('VeWorld request error:', requestError);
            
            // Check if user rejected the request
            if (requestError.code === 4001 || 
                requestError.message?.includes('User denied') || 
                requestError.message?.includes('User rejected')) {
              const error = new Error('Access Denied: User rejected the connection request');
              error.name = 'UserRejectedRequestError';
              throw error;
            }
            
            // Don't throw here for other errors, fall through to Sync2
          }
        } catch (error: any) {
          // Only re-throw if it's a user rejection
          if (error.name === 'UserRejectedRequestError') {
            throw error;
          }
          console.error('Failed to connect to VeWorld:', error);
        }
      } 
      
      // Fallback to Sync2 if VeWorld is not available or failed
      if (connex && vendor) {
        try {
          console.log('Connecting to Sync2...');
          
          try {
            const certResponse = await vendor.sign('cert', {
              purpose: 'identification',
              payload: {
                type: 'text',
                content: 'Please sign to connect to ReVive marketplace'
              }
            });
            
            // Handle the response safely
            if (certResponse && typeof certResponse === 'object') {
              // Access annex and signer safely with optional chaining
              const signer = certResponse.annex?.signer || 
                            (certResponse as any).signer || 
                            null;
              
              if (signer) {
                setAccount(signer);
                setIsConnected(true);
                
                // Get balance
                const account = connex.thor.account(signer);
                const accountInfo = await account.get();
                setBalance(formatVET(accountInfo.balance));
                console.log('Connected to Sync2:', signer);
              } else {
                throw new Error('No signer address found in certificate response');
              }
            } else {
              throw new Error('Invalid certificate response');
            }
          } catch (certError: any) {
            // Check if user rejected the sign request
            if (certError.message?.includes('User cancelled') || 
                certError.message?.includes('User rejected') ||
                certError.message?.includes('denied')) {
              const error = new Error('Access Denied: User rejected the signature request');
              error.name = 'UserRejectedRequestError';
              throw error;
            }
            throw certError;
          }
        } catch (error) {
          console.error('Failed to connect to Sync2:', error);
          throw error; // Rethrow as we've exhausted all options
        }
      } else {
        throw new Error('No wallet connector available');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    // No explicit method to disconnect in VeWorld/Sync2
    // Just clear the state
    setAccount(null);
    setBalance(null);
    setIsConnected(false);
  };

  const sendTransaction = async (clauses: any[]): Promise<string> => {
    if (typeof window === 'undefined') throw new Error('Cannot send transaction server-side');
    if (!account) throw new Error('Wallet not connected');
    
    try {
      // Check for VeWorld availability
      if ((window as any).vechain) {
        try {
          console.log('Sending transaction via VeWorld...');
          const txParams = {
            clauses: clauses.map(clause => ({
              to: clause.to,
              value: clause.value || '0x0',
              data: clause.data || '0x'
            })),
            gas: 80000, // Gas estimate
          };
          
          // Safe request handling
          try {
            const txHash = await (window as any).vechain.request({
              method: 'eth_sendTransaction',
              params: [txParams]
            });
            
            if (txHash) {
              return txHash;
            } else {
              throw new Error('No transaction hash returned');
            }
          } catch (requestError: any) {
            console.error('VeWorld transaction request error:', requestError);
            
            // Check if user rejected the transaction
            if (requestError.code === 4001 || 
                requestError.message?.includes('User denied') || 
                requestError.message?.includes('User rejected')) {
              const error = new Error('Access Denied: User rejected the transaction');
              error.name = 'UserRejectedRequestError';
              throw error;
            }
            
            // Format the error message properly
            throw new Error(requestError.message || 'VeWorld transaction request failed');
          }
        } catch (error: any) {
          console.error('VeWorld transaction failed:', error);
          throw error;
        }
      }
      
      // Fallback to Sync2
      if (!vendor) throw new Error('Wallet not initialized');
      
      try {
        console.log('Sending transaction via Sync2...');
        try {
          const response = await vendor.sign('tx', clauses);
          return response.txid;
        } catch (certError: any) {
          // Check if user rejected the transaction
          if (certError.message?.includes('User cancelled') || 
              certError.message?.includes('User rejected') ||
              certError.message?.includes('denied')) {
            const error = new Error('Access Denied: User rejected the transaction');
            error.name = 'UserRejectedRequestError';
            throw error;
          }
          throw certError;
        }
      } catch (error) {
        console.error('Sync2 transaction failed:', error);
        throw error;
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  return (
    <VeChainContext.Provider
      value={{
        connex,
        account,
        balance,
        isConnecting,
        isConnected,
        connect,
        disconnect,
        sendTransaction
      }}
    >
      {children}
    </VeChainContext.Provider>
  );
}

export const useVeChain = () => {
  const context = useContext(VeChainContext);
  if (!context) {
    throw new Error('useVeChain must be used within a VeChainProvider');
  }
  return context;
}; 