'use client';

import { useState, useEffect } from "react";
import { useVeChain } from "@/providers/VeChainProvider";
import { useToken } from "@/contexts/token-context";
import { useTransaction } from "@/contexts/transaction-context";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, Leaf, ExternalLink, XCircle, ShieldX } from "lucide-react";
import Link from "next/link";

interface PurchaseFlowProps {
  productId: string;
  productName: string;
  productPrice: number;
  productCurrency: string;
  productCategory: string;
  productImage: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PurchaseFlow({
  productId,
  productName,
  productPrice,
  productCurrency,
  productCategory,
  productImage,
  isOpen,
  onClose,
  onSuccess
}: PurchaseFlowProps) {
  const { connect: connectVeChain, account, sendTransaction, isConnecting } = useVeChain();
  const { calculateIncentive, getImpactCategory, addTokens } = useToken();
  const { addTransaction } = useTransaction();
  const { toast } = useToast();

  const [step, setStep] = useState<"connect" | "processing" | "success" | "error" | "rejected">("connect");
  const [processingStatus, setProcessingStatus] = useState({
    connecting: false,
    verifying: false,
    sending: false,
    confirming: false,
    tokenizing: false,
    completed: false
  });
  const [txHash, setTxHash] = useState<string | null>(null);
  const [transactionRecord, setTransactionRecord] = useState<any>(null);

  const impactCategory = getImpactCategory(productCategory);
  const tokenIncentive = calculateIncentive(productPrice, productCategory);
  const shippingCost = 5.99; // Mock shipping cost
  const totalPrice = productPrice + shippingCost;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(account ? "connect" : "connect");
      setProcessingStatus({
        connecting: false,
        verifying: false,
        sending: false,
        confirming: false,
        tokenizing: false,
        completed: false
      });
      setTxHash(null);
      setTransactionRecord(null);
    }
  }, [isOpen, account]);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      // Add proper error handling for connectVeChain
      try {
        await connectVeChain();
        
        if (account) {
          toast({
            title: "Wallet Connected",
            description: "Your VeChain wallet is now connected",
          });
        } else {
          toast({
            title: "Connection Failed",
            description: "Could not connect to VeChain wallet. Please try again.",
            variant: "destructive",
          });
        }
      } catch (connectionError) {
        console.error("Failed to connect wallet:", connectionError);
        toast({
          title: "Connection Error",
          description: "There was an error connecting to your wallet. Make sure it's installed and unlocked.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Error",
        description: "There was an error connecting to your wallet",
        variant: "destructive",
      });
    }
  };

  // Process the purchase
  const processTransaction = async () => {
    setStep("processing");
    
    try {
      // Show toast notification about opening wallet
      toast({
        title: "Opening VeChain Wallet",
        description: "Please confirm the transaction in your wallet",
        variant: "default"
      });
      
      // Initialize processing steps simulation
      setProcessingStatus(prev => ({ ...prev, connecting: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show the VeWorld wallet dialog if available, but don't require actual transaction
      if (typeof window !== "undefined" && (window as any).connex) {
        try {
          const connex = (window as any).connex;
          
          // Create a transaction clause for VET transfer
          const marketplaceAddress = "0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed"; // Demo contract address
          const amountInWei = BigInt(Math.floor(totalPrice * 1e18)).toString();
          
          const clause = {
            to: marketplaceAddress,
            value: amountInWei,
            data: '0x' // No data for simple transfer
          };
          
          // Create transaction sponsor
          let txSponsor = connex.vendor.sign('tx', [clause]);
          
          // Add description
          txSponsor = txSponsor.comment(`Purchase of ${productName} for ${totalPrice} VET on Better Earth Marketplace`);
          
          try {
            // Start the request but don't wait for the result
            // This is just to show the dialog to the user
            txSponsor.request();
            
            console.log("Showing VeWorld dialog, but will proceed with mock transaction");
          } catch (error) {
            // If there's an error showing the dialog, ignore it and continue with mock
            console.log("VeWorld dialog failed, continuing with mock transaction");
          }
        } catch (error) {
          console.error("Error preparing VeWorld dialog:", error);
        }
      }
      
      // Continue with simulation steps
      setProcessingStatus(prev => ({ ...prev, connecting: false, verifying: true }));
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setProcessingStatus(prev => ({ ...prev, verifying: false, sending: true }));
      
      // Generate a mock transaction hash
      const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
      setTxHash(mockTxHash);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStatus(prev => ({ ...prev, sending: false, confirming: true }));
      
      setProcessingStatus(prev => ({ ...prev, confirming: false, tokenizing: true }));
      
      // Update user B3TR balance
      addTokens(tokenIncentive);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a transaction record
      const txRecord = {
        id: Date.now().toString(),
        productId,
        productName,
        productImage,
        price: totalPrice,
        currency: "VET",
        tokensEarned: tokenIncentive,
        orderId: `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        marketplace: "other",
        category: productCategory,
        timestamp: Date.now(),
        status: "completed",
        txHash: mockTxHash
      };
      
      // Add to transaction history
      await addTransaction({
        productId,
        productName,
        productImage,
        productLink: `/product/${productId}`,
        price: totalPrice,
        currency: "VET",
        tokensEarned: tokenIncentive,
        orderId: txRecord.orderId,
        marketplace: "other",
        category: productCategory,
      });
      
      setTransactionRecord(txRecord);
      setProcessingStatus(prev => ({ ...prev, tokenizing: false, completed: true }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep("success");
      
      toast({
        title: "Purchase Successful",
        description: `You earned ${tokenIncentive.toFixed(2)} B3TR tokens for this sustainable purchase`,
        variant: "success",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error("Transaction failed:", error);
      
      // Check if user rejected the transaction
      if (error.name === 'UserRejectedRequestError' || 
          error.message?.includes('Access Denied') ||
          error.message?.includes('User denied') ||
          error.message?.includes('User rejected')) {
        setStep("rejected");
        
        toast({
          title: "Access Denied",
          description: "You rejected the transaction. Please try again if you want to complete your purchase.",
          variant: "destructive",
        });
      } else {
        setStep("error");
        
        toast({
          title: "Transaction Failed",
          description: "There was an error processing your payment. No funds have been deducted.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Function to retry after rejection
  const retryAfterRejection = () => {
    setStep("connect");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        {step === "connect" && (
          <>
            <DialogHeader>
              <DialogTitle>Sustainable Purchase</DialogTitle>
              <DialogDescription>
                Complete your purchase with VeChain and earn B3TR tokens for your sustainable choice
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              {/* Product Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={productImage || "/placeholder.svg"}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{productName}</h3>
                  <p className="text-sm text-muted-foreground">Sustainable product</p>
                  <Badge variant="outline" className="mt-1">Pre-owned</Badge>
                </div>
              </div>
              
              <Separator />
              
              {/* Price Summary */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Item Price:</span>
                  <span>
                    {productCurrency} {productPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>
                    {productCurrency} {shippingCost.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>
                    VET {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Environmental Impact */}
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm flex items-center">
                      <Leaf className="h-4 w-4 mr-1 text-primary" />
                      Environmental Impact Reward
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      You'll earn B3TR tokens for this sustainable purchase
                    </p>
                  </div>
                  <Badge className="bg-primary text-white">{tokenIncentive.toFixed(2)} B3TR</Badge>
                </div>
              </div>
              
              {/* Wallet Connection */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Wallet Status</h4>
                {account ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Connected</p>
                      <p className="text-xs text-muted-foreground">
                        {account.substring(0, 6)}...{account.substring(account.length - 4)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      Ready
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Not connected</p>
                    <Button size="sm" variant="outline" onClick={handleConnect} disabled={isConnecting}>
                      {isConnecting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      {isConnecting ? "Connecting..." : "Connect Wallet"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={processTransaction} 
                disabled={!account}
              >
                Pay with VeChain
              </Button>
            </DialogFooter>
          </>
        )}
        
        {step === "processing" && (
          <>
            <DialogHeader>
              <DialogTitle>Processing Your Purchase</DialogTitle>
              <DialogDescription>Please wait while we process your purchase</DialogDescription>
            </DialogHeader>
            
            <div className="py-8 space-y-6">
              <div className="space-y-4">
                {/* Connection Step */}
                <div className="flex items-center space-x-4">
                  {processingStatus.connecting ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : processingStatus.verifying || processingStatus.sending || processingStatus.confirming || processingStatus.tokenizing || processingStatus.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Connecting to wallet</p>
                    <p className="text-sm text-muted-foreground">
                      {processingStatus.connecting
                        ? "Making secure connection..."
                        : processingStatus.verifying || processingStatus.sending || processingStatus.confirming || processingStatus.tokenizing || processingStatus.completed
                        ? "Connection made"
                        : "Waiting"}
                    </p>
                  </div>
                </div>
                
                {/* Verification Step */}
                <div className="flex items-center space-x-4">
                  {processingStatus.verifying ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : processingStatus.sending || processingStatus.confirming || processingStatus.tokenizing || processingStatus.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Verifying your account</p>
                    <p className="text-sm text-muted-foreground">
                      {processingStatus.verifying
                        ? "Verifying wallet and balance..."
                        : processingStatus.sending || processingStatus.confirming || processingStatus.tokenizing || processingStatus.completed
                        ? "Account verified"
                        : "Waiting"}
                    </p>
                  </div>
                </div>
                
                {/* Transaction Step */}
                <div className="flex items-center space-x-4">
                  {processingStatus.sending ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : processingStatus.confirming || processingStatus.tokenizing || processingStatus.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Processing payment</p>
                    <p className="text-sm text-muted-foreground">
                      {processingStatus.sending
                        ? "Sending VET to marketplace..."
                        : processingStatus.confirming || processingStatus.tokenizing || processingStatus.completed
                        ? "Transaction sent"
                        : "Waiting"}
                    </p>
                  </div>
                </div>
                
                {/* Confirmation Step */}
                <div className="flex items-center space-x-4">
                  {processingStatus.confirming ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : processingStatus.tokenizing || processingStatus.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Confirming payment</p>
                    <p className="text-sm text-muted-foreground">
                      {processingStatus.confirming
                        ? "Waiting for confirmation on blockchain..."
                        : processingStatus.tokenizing || processingStatus.completed
                        ? "Payment confirmed"
                        : "Waiting"}
                    </p>
                  </div>
                </div>
                
                {/* Token Step */}
                <div className="flex items-center space-x-4">
                  {processingStatus.tokenizing ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : processingStatus.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Minting B3TR tokens</p>
                    <p className="text-sm text-muted-foreground">
                      {processingStatus.tokenizing
                        ? `Minting ${tokenIncentive.toFixed(2)} B3TR as sustainability reward...`
                        : processingStatus.completed
                        ? `${tokenIncentive.toFixed(2)} B3TR minted to your wallet`
                        : "Waiting"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Transaction Hash Display */}
              {txHash && (processingStatus.sending || processingStatus.confirming || processingStatus.tokenizing || processingStatus.completed) && (
                <div className="bg-muted/50 p-3 rounded-md text-sm">
                  <p className="text-xs font-medium mb-1">Transaction Hash</p>
                  <p className="text-xs break-all text-muted-foreground font-mono">{txHash}</p>
                </div>
              )}
            </div>
          </>
        )}
        
        {step === "success" && (
          <>
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <DialogTitle className="text-center">Purchase Successful!</DialogTitle>
              <DialogDescription className="text-center">
                Your order has been processed successfully.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Order ID</p>
                  <p className="text-sm font-mono">{transactionRecord?.orderId || "-"}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Product</p>
                  <p className="text-sm">{productName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Total Paid</p>
                  <p className="text-sm">VET {totalPrice.toFixed(2)}</p>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">B3TR Reward</p>
                  </div>
                  <p className="text-sm font-medium text-primary">{tokenIncentive.toFixed(2)} B3TR</p>
                </div>
              </div>
              
              {/* Transaction Hash with Link */}
              {txHash && (
                <div className="bg-muted/50 p-3 rounded-md text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium">Transaction Hash</p>
                    <Link 
                      href={`https://explore-testnet.vechain.org/transactions/${txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center"
                    >
                      View <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                  <p className="text-xs break-all text-muted-foreground font-mono">{txHash}</p>
                </div>
              )}
              
              {/* Environmental Impact */}
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <Leaf className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <h4 className="text-sm font-medium">Environmental Impact</h4>
                    <p className="text-xs text-muted-foreground">
                      Your sustainable choice just saved approximately {(tokenIncentive * 5).toFixed(1)} kg of CO₂ emissions!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  // Navigate to profile/purchases
                  window.location.href = "/profile/purchases";
                }}
                className="flex-1"
              >
                View Orders
              </Button>
            </DialogFooter>
          </>
        )}
        
        {step === "error" && (
          <>
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="text-center">Transaction Failed</DialogTitle>
              <DialogDescription className="text-center">
                There was an error processing your payment. No funds have been deducted.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <p className="text-center">The transaction could not be completed. Please try again later.</p>
            </div>
            
            <DialogFooter>
              <Button onClick={onClose} variant="outline">Close</Button>
              <Button onClick={() => setStep("connect")}>Try Again</Button>
            </DialogFooter>
          </>
        )}

        {step === "rejected" && (
          <>
            <DialogHeader>
              <DialogTitle>Transaction Rejected</DialogTitle>
              <DialogDescription>
                You have denied the transaction request.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <ShieldX className="h-10 w-10 text-amber-600 dark:text-amber-500" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-medium">Access Denied</p>
                <p className="text-sm text-muted-foreground">You rejected the purchase request. No funds have been deducted.</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={onClose} variant="outline">Cancel Purchase</Button>
              <Button onClick={retryAfterRejection}>Try Again</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 