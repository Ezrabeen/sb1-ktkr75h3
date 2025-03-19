/**
 * Contract Utilities
 * 
 * This module provides utility functions for interacting with smart contracts
 * on the VeChain blockchain. It includes functionality for:
 * 
 * - Connecting to smart contracts
 * - Calling contract methods
 * - Encoding contract data
 * - Handling contract events
 * - Managing token transfers
 * - Decoding blockchain responses
 * 
 * These utilities abstract the complexity of direct blockchain interaction
 * and provide a simplified interface for the application's features.
 */

import Connex from '@vechain/connex'
import { formatEther } from './utils';

// ABI for token contract
const tokenABI = {
  "functions": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "events": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    }
  ]
}

// Helper function to convert amount to wei
const toWei = (amount: string): string => {
  const amountFloat = parseFloat(amount);
  const amountBigInt = BigInt(Math.floor(amountFloat * 10**18));
  return amountBigInt.toString();
}

// Helper function to format wei to readable amount
const fromWei = (wei: string): string => {
  const amount = Number(wei) / Math.pow(10, 18);
  return amount.toFixed(4);
}

// Get contract instance
export const getContractAccount = (connex: Connex, contractAddress: string) => {
  // Get the contract account
  return connex.thor.account(contractAddress);
}

// Get balance of an address
export const getBalance = async (connex: Connex, contractAddress: string, ownerAddress: string) => {
  try {
    const contractAccount = getContractAccount(connex, contractAddress);
    const balanceMethod = contractAccount.method(tokenABI.functions[0]);
    const result = await balanceMethod.call(ownerAddress);
    return fromWei(result.decoded.toString());
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
}

// Transfer tokens
export const transferTokens = async (
  connex: Connex, 
  contractAddress: string, 
  account: string,
  toAddress: string, 
  amount: string
) => {
  try {
    const amountInWei = toWei(amount);
    
    // Create a transfer clause
    const transferClause = {
      to: contractAddress,
      value: '0',
      data: connex.thor.account(contractAddress)
        .method(tokenABI.functions[1])
        .asClause(toAddress, amountInWei)
        .data
    };
    
    // Sign and send transaction
    const vendor = new Connex.Vendor('test');
    // Use type assertion for the response
    const txResponse = await vendor.sign('tx', [transferClause]) as any;
    
    return {
      txid: txResponse.txid || ''
    };
  } catch (error) {
    console.error("Error transferring tokens:", error);
    throw error;
  }
}

// VeChain contract utilities

// Standard ERC20 ABI (simplified)
export const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transferFrom",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "name": "owner", "type": "address"}, {"indexed": true, "name": "spender", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"}],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "name": "from", "type": "address"}, {"indexed": true, "name": "to", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"}],
    "name": "Transfer",
    "type": "event"
  }
];

// Contract addresses
export const CONTRACT_ADDRESSES = {
  // Use testnet addresses for development
  tokenContract: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || '0x039893ebe092a2d22b08e2b029735d211bff7f50'
};

/**
 * Get ERC20 token balance for an address
 * @param connex - Connex instance
 * @param tokenAddress - ERC20 token contract address
 * @param walletAddress - Wallet address to check balance for
 * @returns Formatted balance with decimals
 */
export const getTokenBalance = async (connex: any, tokenAddress: string, walletAddress: string): Promise<string> => {
  if (!connex || !tokenAddress || !walletAddress) {
    return '0';
  }

  try {
    // Create contract instance
    const tokenContract = connex.thor.account(tokenAddress);
    
    // Call balanceOf method
    const balanceOfABI = ERC20_ABI.find(x => x.name === 'balanceOf');
    if (!balanceOfABI) throw new Error('balanceOf method not found in ABI');
    
    const balanceOfMethod = tokenContract.method(balanceOfABI as any);
    const result = await balanceOfMethod.call(walletAddress);
    
    if (result && result.decoded && result.decoded.balance) {
      return formatEther(result.decoded.balance.toString());
    }
    
    return '0';
  } catch (error) {
    console.error('Error getting token balance:', error);
    return '0';
  }
};

/**
 * Create a token transfer transaction clause
 * @param tokenAddress - ERC20 token contract address
 * @param toAddress - Recipient address
 * @param amount - Amount to transfer (in token units, not wei)
 * @returns Transaction clause
 */
export const createTokenTransferClause = (
  tokenAddress: string, 
  toAddress: string, 
  amount: string
): any => {
  // Find transfer method in ABI
  const transferABI = ERC20_ABI.find(x => x.name === 'transfer');
  if (!transferABI) throw new Error('transfer method not found in ABI');
  
  // Convert amount to wei (assuming 18 decimals)
  const amountInWei = BigInt(parseFloat(amount) * 10**18).toString();
  
  // Encode method call
  const data = {
    abi: transferABI,
    params: [toAddress, amountInWei]
  };
  
  return {
    to: tokenAddress,
    value: '0x0', // No VET is transferred for token transfers
    data: data
  };
};

/**
 * Encode contract method call 
 * @param methodABI - Method ABI object
 * @param params - Method parameters
 * @returns Encoded method call data
 */
export const encodeMethod = (connex: any, methodABI: any, params: any[]): string => {
  if (!connex) throw new Error('Connex instance is required');
  
  try {
    // Create ABI object for encoding
    const abi = { name: methodABI.name, inputs: methodABI.inputs };
    
    // Encode method call
    return connex.thor.account(null).method(abi).encode(...params);
  } catch (error) {
    console.error('Error encoding method call:', error);
    throw error;
  }
};

// VeChain network configurations
export const NETWORK_CONFIG = {
  main: {
    name: 'Main',
    url: 'https://mainnet.vechain.org/',
    explorerUrl: 'https://explore.vechain.org'
  },
  test: {
    name: 'Test',
    url: 'https://testnet.vechain.org/',
    explorerUrl: 'https://explore-testnet.vechain.org'
  }
};

/**
 * Get transaction URL on the explorer
 * @param txId - Transaction ID
 * @param network - Network name ('main' or 'test')
 * @returns Explorer URL for the transaction
 */
export const getExplorerTxUrl = (txId: string, network: 'main' | 'test' = 'test'): string => {
  return `${NETWORK_CONFIG[network].explorerUrl}/transactions/${txId}`;
};

