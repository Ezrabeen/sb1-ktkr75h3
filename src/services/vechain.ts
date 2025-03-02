import { Framework } from '@vechain/connex-framework';

let connex: Framework | null = null;

export async function initializeVeChain() {
  // In browser environment, we use the window.connex object
  if (typeof window !== 'undefined' && window.connex) {
    connex = window.connex;
  }
  return connex;
}

export interface TokenInfo {
  symbol: string;
  balance: string;
  decimals: number;
}

export async function getTokenBalance(address: string): Promise<TokenInfo> {
  const connex = await initializeVeChain();
  if (!connex) {
    throw new Error('Connex not initialized');
  }
  
  // VET token balance
  const account = await connex.thor.account(address).get();
  const vetBalance = account.balance;
  
  return {
    symbol: 'VET',
    balance: vetBalance.toString(),
    decimals: 18
  };
}

export async function sendTransaction(to: string, amount: string) {
  const connex = await initializeVeChain();
  if (!connex) {
    throw new Error('Connex not initialized');
  }
  
  try {
    const clause = {
      to,
      value: amount,
      data: '0x'
    };
    
    const signingService = connex.vendor.sign('tx', [clause]);
    const result = await signingService.request();
    return result.txid;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

export async function connectWallet(): Promise<string> {
  if (typeof window === 'undefined' || !window.connex) {
    throw new Error('Please install VeChain Sync2 wallet');
  }

  try {
    const certificateResponse = await window.connex.vendor
      .sign('cert', { purpose: 'identification' })
      .request();
    
    return certificateResponse.annex.signer;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw new Error('Failed to connect wallet');
  }
}