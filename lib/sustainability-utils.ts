/**
 * Sustainability Utilities
 * 
 * This module provides functions for interacting with sustainability-related features
 * on the VeChain blockchain. It includes functionality for:
 * 
 * - Calculating carbon offsets
 * - Tracking user sustainability scores
 * - Verifying sustainable product attributes
 * - Managing sustainability credentials
 * - Generating impact reports
 * 
 * These utilities help verify and track the environmental impact of products
 * and user activities within the marketplace.
 */

import { CONTRACT_ADDRESSES } from './contract-utils';

// Sustainability contract ABI (simplified for demo)
const SUSTAINABILITY_TRACKING_ABI = {
  functions: [
    {
      name: 'getProductSustainabilityScore',
      inputs: [{ name: 'productId', type: 'uint256' }],
      outputs: [{ name: 'score', type: 'uint256' }]
    },
    {
      name: 'getUserSustainabilityScore',
      inputs: [{ name: 'userAddress', type: 'address' }],
      outputs: [{ name: 'score', type: 'uint256' }]
    },
    {
      name: 'setProductSustainabilityScore',
      inputs: [
        { name: 'productId', type: 'uint256' },
        { name: 'score', type: 'uint256' }
      ],
      outputs: [{ name: 'success', type: 'bool' }]
    }
  ]
};

// Type for sustainability data
export interface SustainabilityData {
  co2Saved: number;         // in kg
  itemsRecycled: number;    // number of items
  treesEquivalent: number;  // number of trees equivalent to CO2 reduction
  sustainablePurchases: number; // number of sustainable purchases
}

// Conversions for calculating environmental impact
const IMPACT_CONVERSIONS = {
  CO2_PER_TREE_PER_YEAR: 25, // kg CO2 absorbed by 1 tree per year
  CO2_PER_RECYCLED_ITEM: 2.5, // kg CO2 saved per recycled item
};

// Get sustainability score for a product
export const getProductSustainabilityScore = async (
  connex: any,
  productId: number
): Promise<number> => {
  try {
    if (!connex) return 0;
    
    // Get sustainability contract address
    const contractAddress = CONTRACT_ADDRESSES?.tokenContract || '';
    
    // Create contract instance
    const contract = connex.thor.account(contractAddress);
    
    // Find getProductSustainabilityScore method in ABI
    const scoreFunc = SUSTAINABILITY_TRACKING_ABI.functions.find(
      (func: any) => func.name === 'getProductSustainabilityScore'
    );
    if (!scoreFunc) throw new Error('getProductSustainabilityScore method not found in ABI');
    
    // Call method
    const method = contract.method(scoreFunc);
    const result = await method.call(productId);
    
    // Return score
    return Number(result.decoded[0]);
  } catch (error) {
    console.error("Error getting product sustainability score:", error);
    return 0; // Default score if error
  }
};

// Get sustainability score for a user
export const getUserSustainabilityScore = async (
  connex: any,
  userAddress: string
): Promise<number> => {
  try {
    if (!connex || !userAddress) return 0;
    
    // Get sustainability contract address
    const contractAddress = CONTRACT_ADDRESSES?.tokenContract || '';
    
    // Create contract instance
    const contract = connex.thor.account(contractAddress);
    
    // Find getUserSustainabilityScore method in ABI
    const scoreFunc = SUSTAINABILITY_TRACKING_ABI.functions.find(
      (func: any) => func.name === 'getUserSustainabilityScore'
    );
    if (!scoreFunc) throw new Error('getUserSustainabilityScore method not found in ABI');
    
    // Call method
    const method = contract.method(scoreFunc);
    const result = await method.call(userAddress);
    
    // Return score
    return Number(result.decoded[0]);
  } catch (error) {
    console.error("Error getting user sustainability score:", error);
    return 0; // Default score if error
  }
};

// Update sustainability score for a product
export const updateProductSustainabilityScore = async (
  connex: any,
  productId: number,
  score: number
): Promise<boolean> => {
  try {
    if (!connex) return false;
    
    // Get contract address
    const contractAddress = CONTRACT_ADDRESSES?.tokenContract || '';
    
    // Find setProductSustainabilityScore method in ABI
    const scoreFunc = SUSTAINABILITY_TRACKING_ABI.functions.find(
      (func: any) => func.name === 'setProductSustainabilityScore'
    );
    if (!scoreFunc) throw new Error('setProductSustainabilityScore method not found in ABI');
    
    // Create transaction clause
    const clause = {
      to: contractAddress,
      value: '0',
      data: connex.thor.account(contractAddress)
        .method(scoreFunc)
        .asClause(productId, score)
        .data
    };
    
    // Sign and send transaction
    const vendor = new (connex as any).Vendor('test');
    const txResponse = await vendor.sign('tx', [clause]);
    
    return !!txResponse.txid;
  } catch (error) {
    console.error("Error updating product sustainability score:", error);
    return false;
  }
};

// Calculate sustainability impact based on purchases
export const calculateSustainabilityImpact = (purchaseCount: number): SustainabilityData => {
  // Assumptions for each purchase
  const avgCO2PerPurchase = 5; // kg
  const avgRecycledItemsPerPurchase = 1.5; // items
  
  const co2Saved = purchaseCount * avgCO2PerPurchase;
  const itemsRecycled = Math.floor(purchaseCount * avgRecycledItemsPerPurchase);
  const treesEquivalent = Math.ceil(co2Saved / IMPACT_CONVERSIONS.CO2_PER_TREE_PER_YEAR);
  
  return {
    co2Saved,
    itemsRecycled,
    treesEquivalent,
    sustainablePurchases: purchaseCount
  };
};

// Fetch total sustainability impact from blockchain
export const fetchSustainabilityData = async (connex: any): Promise<SustainabilityData> => {
  try {
    // Mock data for now, ideally this would be fetched from blockchain
    // This data would be calculated through aggregation of blockchain data
    const totalPurchases = 3456;
    return calculateSustainabilityImpact(totalPurchases);
  } catch (error) {
    console.error("Error fetching sustainability data:", error);
    return {
      co2Saved: 1234.5,
      itemsRecycled: 5678,
      treesEquivalent: 89,
      sustainablePurchases: 3456
    };
  }
}; 