import { createClient } from '@supabase/supabase-js';
import { EbayProduct } from './ebay';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface Transaction {
  id: string;
  user_address: string;
  product_id: string;
  product_details: EbayProduct;
  purchase_amount: number;
  reward_amount: number;
  tx_hash: string;
  platform: string;
  status: 'pending' | 'completed' | 'failed';
  verification_status: 'unverified' | 'verified' | 'rejected';
  sustainability_score: number;
  created_at: string;
}

export async function recordTransaction(
  userAddress: string,
  product: EbayProduct,
  purchaseAmount: number,
  rewardAmount: number,
  txHash: string
): Promise<Transaction> {
  // Calculate sustainability score based on product condition and category
  const sustainabilityScore = calculateSustainabilityScore(product);
  
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_address: userAddress,
      product_id: product.id,
      product_details: product,
      purchase_amount: purchaseAmount,
      reward_amount: rewardAmount,
      tx_hash: txHash,
      platform: 'ebay',
      status: 'completed',
      verification_status: 'unverified', // Initial status
      sustainability_score: sustainabilityScore
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to record transaction: ${error.message}`);
  }

  // Trigger verification process
  verifyTransaction(data.id, product).catch(err => 
    console.error('Transaction verification failed:', err)
  );

  return data;
}

export async function getUserTransactions(userAddress: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_address', userAddress)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  return data || [];
}

export async function verifyTransaction(transactionId: string, product: EbayProduct): Promise<boolean> {
  try {
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verification logic:
    // 1. Check if product is second-hand (based on condition)
    const isSecondHand = ['used', 'refurbished', 'pre-owned', 'good', 'fair', 'excellent'].includes(
      product.condition.toLowerCase()
    );
    
    // 2. Verify product exists on the platform
    // In production, this would make an API call to eBay to verify the product
    const productExists = true; // Simulated for now
    
    // 3. Update verification status
    if (isSecondHand && productExists) {
      const { error } = await supabase
        .from('transactions')
        .update({ verification_status: 'verified' })
        .eq('id', transactionId);
        
      if (error) throw error;
      return true;
    } else {
      const { error } = await supabase
        .from('transactions')
        .update({ verification_status: 'rejected' })
        .eq('id', transactionId);
        
      if (error) throw error;
      return false;
    }
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}

// Calculate sustainability score based on product attributes
function calculateSustainabilityScore(product: EbayProduct): number {
  let score = 0;
  
  // Base score for second-hand items
  score += 50;
  
  // Condition-based scoring
  switch (product.condition.toLowerCase()) {
    case 'like new':
    case 'excellent':
      score += 30;
      break;
    case 'good':
      score += 25;
      break;
    case 'fair':
      score += 20;
      break;
    default:
      score += 15;
  }
  
  // Category-based scoring with VebetterDAO impact levels
  const category = product.category.toLowerCase();
  
  if (category.includes('electronics') || category.includes('phone') || category.includes('computer')) {
    // Very high impact category
    score += 20;
  } else if (category.includes('furniture') || category.includes('home')) {
    // Very high impact category
    score += 20;
  } else if (category.includes('clothing') || category.includes('apparel') || category.includes('fashion')) {
    // High impact category
    score += 15;
  } else if (category.includes('audio') || category.includes('headphone') || category.includes('speaker')) {
    // High impact category
    score += 15;
  } else if (category.includes('book') || category.includes('media')) {
    // Medium impact category
    score += 10;
  } else {
    // Default for other categories
    score += 5;
  }
  
  // Cap at 100
  return Math.min(score, 100);
}

export async function getTransactionVerificationStatus(transactionId: string): Promise<string> {
  const { data, error } = await supabase
    .from('transactions')
    .select('verification_status')
    .eq('id', transactionId)
    .single();
    
  if (error) {
    throw new Error(`Failed to get verification status: ${error.message}`);
  }
  
  return data.verification_status;
}