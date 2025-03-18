import { ethers } from "ethers"

// Example ABI - replace with your actual contract ABI
const contractABI = [
  // Replace with your contract ABI
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
]

// Get the contract instance based on network
export const getContract = async (signer: ethers.Signer) => {
  // Get contract address based on network
  const network = process.env.NEXT_PUBLIC_NETWORK || "testnet"
  const contractAddress = network === "mainnet" ? process.env.CONTRACT_ADDRESS : process.env.CONTRACT_ADDRESS // Same for now, you might have different addresses

  if (!contractAddress) {
    throw new Error("Contract address not defined")
  }

  // Create contract instance
  return new ethers.Contract(contractAddress, contractABI, signer)
}

// Get balance of an address
export const getBalance = async (contract: ethers.Contract, address: string) => {
  try {
    const balance = await contract.balanceOf(address)
    return ethers.formatEther(balance)
  } catch (error) {
    console.error("Error getting balance:", error)
    throw error
  }
}

// Transfer tokens
export const transferTokens = async (contract: ethers.Contract, toAddress: string, amount: string) => {
  try {
    const amountInWei = ethers.parseEther(amount)
    const tx = await contract.transfer(toAddress, amountInWei)
    return await tx.wait()
  } catch (error) {
    console.error("Error transferring tokens:", error)
    throw error
  }
}

