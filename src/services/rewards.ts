import { ethers } from 'ethers';

// Constants for reward calculation
const BASE_REWARD_RATE = 0.02; // 2% of purchase price
const SUSTAINABILITY_MULTIPLIER = 1.5;
const MAX_DAILY_REWARDS = 100; // Maximum B3TR tokens per day
const MIN_PURCHASE_AMOUNT = 5; // Minimum USD for rewards

interface RewardParameters {
  purchaseAmount: number;
  sustainabilityScore: number;
  userLevel: string;
  dailyRewardsAccumulated: number;
}

// Level multipliers
const LEVEL_MULTIPLIERS = {
  'Beginner': 1.0,
  'Eco-Conscious': 1.2,
  'Sustainability Champion': 1.5,
  'Eco Warrior': 2.0
};

export function calculateRewards({
  purchaseAmount,
  sustainabilityScore,
  userLevel,
  dailyRewardsAccumulated
}: RewardParameters): number {
  // Check minimum purchase amount
  if (purchaseAmount < MIN_PURCHASE_AMOUNT) {
    return 0;
  }

  // Base reward calculation
  let reward = purchaseAmount * BASE_REWARD_RATE;

  // Apply sustainability score multiplier (normalized to 0-1 range)
  const normalizedScore = Math.min(sustainabilityScore / 100, 1);
  reward *= (1 + (normalizedScore * SUSTAINABILITY_MULTIPLIER));

  // Apply level multiplier
  const levelMultiplier = LEVEL_MULTIPLIERS[userLevel as keyof typeof LEVEL_MULTIPLIERS] || 1.0;
  reward *= levelMultiplier;

  // Check daily rewards cap
  const remainingDailyRewards = MAX_DAILY_REWARDS - dailyRewardsAccumulated;
  reward = Math.min(reward, remainingDailyRewards);

  // Round to 2 decimal places
  return Math.round(reward * 100) / 100;
}

// Smart contract interaction
export class RewardDistributor {
  private contract: ethers.Contract;
  private provider: ethers.Provider;

  constructor(contractAddress: string, abi: any, providerUrl: string) {
    this.provider = new ethers.JsonRpcProvider(providerUrl);
    this.contract = new ethers.Contract(contractAddress, abi, this.provider);
  }

  async distributeRewards(userAddress: string, amount: number): Promise<string> {
    try {
      // Security checks
      if (!ethers.isAddress(userAddress)) {
        throw new Error('Invalid user address');
      }
      if (amount <= 0) {
        throw new Error('Invalid reward amount');
      }

      const tx = await this.contract.distributeRewards(userAddress, amount);
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error distributing rewards:', error);
      throw error;
    }
  }

  async getUserRewardBalance(userAddress: string): Promise<number> {
    try {
      const balance = await this.contract.balanceOf(userAddress);
      return Number(ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error('Error getting user reward balance:', error);
      throw error;
    }
  }
}