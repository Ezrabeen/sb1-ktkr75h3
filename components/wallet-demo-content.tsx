"use client"

import { WalletStatus } from "@/components/wallet-status"
import { WalletActions } from "@/components/wallet-actions"
import { TransactionDemo } from "@/components/transaction-demo"

export default function WalletDemoContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Wallet Demo</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <WalletStatus />
        </div>

        <div className="space-y-8">
          <WalletActions />
          <TransactionDemo />
        </div>
      </div>
    </div>
  )
} 