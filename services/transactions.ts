// Mock data for transactions
const mockTransactions = {
  "0x1234567890abcdef1234567890abcdef12345678": [
    {
      id: "tx1",
      type: "buy",
      amount: "100",
      timestamp: Date.now() - 86400000, // 1 day ago
      status: "completed",
      itemName: "Digital Artwork #1",
    },
    {
      id: "tx2",
      type: "sell",
      amount: "250",
      timestamp: Date.now() - 172800000, // 2 days ago
      status: "completed",
      itemName: "Collectible NFT",
    },
    {
      id: "tx3",
      type: "buy",
      amount: "75",
      timestamp: Date.now() - 259200000, // 3 days ago
      status: "pending",
      itemName: "Game Item",
    },
  ],
  "0x9876543210abcdef1234567890abcdef12345678": [
    {
      id: "tx4",
      type: "sell",
      amount: "500",
      timestamp: Date.now() - 86400000, // 1 day ago
      status: "completed",
      itemName: "Virtual Land",
    },
    {
      id: "tx5",
      type: "buy",
      amount: "150",
      timestamp: Date.now() - 172800000, // 2 days ago
      status: "failed",
      itemName: "Music NFT",
    },
  ],
} as Record<
  string,
  Array<{
    id: string
    type: "buy" | "sell"
    amount: string
    timestamp: number
    status: "completed" | "pending" | "failed"
    itemName?: string
  }>
>

export async function getTransactions(address: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In a real application, this would fetch data from an API or blockchain
  return mockTransactions[address] || []
}

export async function getTransactionDetails(txId: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real application, this would fetch detailed transaction data
  // For now, we'll just return a mock transaction
  return {
    id: txId,
    type: "buy",
    amount: "100",
    timestamp: Date.now() - 86400000,
    status: "completed",
    itemName: "Digital Artwork #1",
    from: "0x1234567890abcdef1234567890abcdef12345678",
    to: "0x9876543210abcdef1234567890abcdef12345678",
    blockNumber: 12345678,
    gasUsed: "21000",
    gasPrice: "5",
  }
}

