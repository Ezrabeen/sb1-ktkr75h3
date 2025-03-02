import { useState, useCallback } from 'react';
import { calculateRewards, RewardDistributor } from '../services/rewards';
import { useVeChain } from './useVeChain';

// Contract ABI for B3TR token
const B3TR_ABI = [
  "function distributeRewards(address to, uint256 amount) external",
  "function balanceOf(address account) external view returns (uint256)"
];

// Initialize reward distributor with contract details
const rewardDistributor = new RewardDistributor(
  import.meta.env.VITE_REWARD_CONTRACT_ADDRESS || '',
  B3TR_ABI,
  import.meta.env.VITE_VECHAIN_NODE_URL || ''
);

export function useRewards() {
  const { account } = useVeChain();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimRewards = useCallback(async (purchaseAmount: number) => {
    if (!account) {
      setError('Wallet not connected');
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      setLoading(true);
      setError(null);

      // Calculate rewards based on purchase
      const rewardAmount = calculateRewards({
        purchaseAmount,
        sustainabilityScore: 85, // TODO: Get from user profile
        userLevel: 'Eco Warrior',
        dailyRewardsAccumulated: 0 // TODO: Track daily rewards
      });

      // Mock transaction for development
      // In production, this should interact with the actual smart contract
      const txHash = '0x' + Array(64).fill('0').join('');
      
      // Simulate contract interaction delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        rewardAmount,
        txHash
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim rewards';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [account]);

  const getRewardBalance = useCallback(async () => {
    if (!account) return 0;
    try {
      return await rewardDistributor.getUserRewardBalance(account);
    } catch (error) {
      console.error('Error fetching reward balance:', error);
      return 0;
    }
  }, [account]);

  return {
    claimRewards,
    getRewardBalance,
    loading,
    error
  };
}