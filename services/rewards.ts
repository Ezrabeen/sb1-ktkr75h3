// Mock data for rewards
const mockRewards = {
  "0x1234567890abcdef1234567890abcdef12345678": [
    {
      id: "reward1",
      amount: "10",
      reason: "First purchase",
      timestamp: Date.now() - 86400000, // 1 day ago
    },
    {
      id: "reward2",
      amount: "5",
      reason: "Daily login",
      timestamp: Date.now() - 172800000, // 2 days ago
    },
    {
      id: "reward3",
      amount: "20",
      reason: "Referral bonus",
      timestamp: Date.now() - 259200000, // 3 days ago
    },
  ],
  "0x9876543210abcdef1234567890abcdef12345678": [
    {
      id: "reward4",
      amount: "15",
      reason: "Community contribution",
      timestamp: Date.now() - 86400000, // 1 day ago
    },
    {
      id: "reward5",
      amount: "5",
      reason: "Daily login",
      timestamp: Date.now() - 172800000, // 2 days ago
    },
  ],
} as Record<
  string,
  Array<{
    id: string
    amount: string
    reason: string
    timestamp: number
  }>
>

export async function getRewards(address: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In a real application, this would fetch data from an API or blockchain
  return mockRewards[address] || []
}

export async function claimReward(rewardId: string, address: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // In a real application, this would interact with a smart contract
  return {
    success: true,
    transactionHash: `0x${Math.random().toString(16).substring(2, 42)}`,
  }
}

