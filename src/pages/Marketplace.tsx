import React, { useEffect, useState } from 'react';
import { Search, Filter, Tag, Star, Coins, ExternalLink, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useVeChain } from '../hooks/useVeChain';
import { useRewards } from '../hooks/useRewards';
import { searchProducts, EbayProduct, verifyProduct } from '../services/ebay';
import { recordTransaction, getTransactionVerificationStatus } from '../services/transactions';
import toast from 'react-hot-toast';

const Marketplace = () => {
  const { account } = useVeChain();
  const { claimRewards } = useRewards();
  const [products, setProducts] = useState<EbayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<EbayProduct | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<{
    isVerified: boolean;
    isSecondHand: boolean;
    verificationDetails?: string;
  } | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, category, condition, minPrice, maxPrice]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const items = await searchProducts(searchQuery, {
        category,
        condition,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
      });
      setProducts(items);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyProduct = async (product: EbayProduct) => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setVerifying(true);
      setSelectedProduct(product);
      
      // Verify the product is second-hand and authentic
      const verification = await verifyProduct(product.id);
      setVerificationStatus(verification);
      
      if (!verification.isSecondHand) {
        toast.error('This product is not eligible for rewards as it is not second-hand');
      } else if (!verification.isVerified) {
        toast.error('Product verification failed');
      } else {
        toast.success('Product verified! You can now proceed with purchase');
      }
    } catch (error) {
      console.error('Error verifying product:', error);
      toast.error('Failed to verify product');
    } finally {
      setVerifying(false);
    }
  };

  const handleBuy = async (product: EbayProduct) => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    // If product hasn't been verified yet, verify it first
    if (selectedProduct?.id !== product.id || !verificationStatus) {
      await handleVerifyProduct(product);
      return;
    }

    // Check if product is eligible for rewards
    if (!verificationStatus.isSecondHand) {
      toast.error('This product is not eligible for rewards as it is not second-hand');
      return;
    }

    if (!verificationStatus.isVerified) {
      toast.error('Product verification failed');
      return;
    }

    try {
      setLoading(true);
      
      // Calculate rewards
      const { success, rewardAmount, txHash, error } = await claimRewards(product.price.value);
      
      if (success && txHash) {
        // Record the transaction
        const transaction = await recordTransaction(
          account,
          product,
          product.price.value,
          rewardAmount || 0,
          txHash
        );

        toast.success(
          <div>
            <p>Purchase successful!</p>
            <p>Earned {rewardAmount} B3TR tokens</p>
            <a 
              href={`https://explore.vechain.org/transactions/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 flex items-center mt-1"
            >
              View Transaction <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        );

        // Check transaction verification status after a delay
        setTimeout(async () => {
          try {
            const status = await getTransactionVerificationStatus(transaction.id);
            if (status === 'verified') {
              toast.success('Transaction verified by VebetterDAO!');
            }
          } catch (err) {
            console.error('Error checking verification status:', err);
          }
        }, 3000);

        // Redirect to eBay product page
        window.open(product.url, '_blank');
      } else {
        toast.error(`Failed to process purchase: ${error}`);
      }
    } catch (error) {
      toast.error('Failed to complete purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">Sustainable Marketplace</h1>
          <p className="text-lg opacity-90">Shop sustainably and earn B3TR tokens with every purchase</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sustainable products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                <option value="clothing">Clothing</option>
                <option value="footwear">Footwear</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="bags">Bags</option>
                <option value="music">Music</option>
              </select>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Conditions</option>
                <option value="like new">Like New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min $"
                className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max $"
                className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Verification info banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800">How ReVive Verification Works</h3>
              <p className="text-green-700 mt-1">
                We verify each product to ensure it's genuinely second-hand and eligible for sustainability rewards. 
                After purchase, your transaction is recorded on the VeChain blockchain and validated by VebetterDAO.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sustainable products...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-green-600 shadow-sm">
                    {product.condition}
                  </div>
                  {product.isSecondHand && (
                    <div className="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded-full text-sm font-medium text-white shadow-sm flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Second-hand
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.seller.feedbackScore}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>
                  
                  {/* Product specifics */}
                  {product.productSpecifics && (
                    <div className="mb-3 text-xs text-gray-500 space-y-1">
                      {Object.entries(product.productSpecifics).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex items-center">
                          <span className="font-medium capitalize">{key}:</span>
                          <span className="ml-1">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price.value.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-1 text-green-600">
                        <Coins className="h-4 w-4" />
                        <span className="font-medium">+{Math.round(product.price.value * 0.02)} B3TR</span>
                      </div>
                    </div>
                    
                    {/* Verification status */}
                    {selectedProduct?.id === product.id && verificationStatus && (
                      <div className={`text-sm p-2 rounded ${
                        verificationStatus.isVerified && verificationStatus.isSecondHand 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        <div className="flex items-center">
                          {verificationStatus.isVerified && verificationStatus.isSecondHand ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <AlertCircle className="h-4 w-4 mr-1" />
                          )}
                          <span>{verificationStatus.verificationDetails}</span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => selectedProduct?.id === product.id && verificationStatus?.isVerified && verificationStatus?.isSecondHand 
                        ? handleBuy(product) 
                        : handleVerifyProduct(product)
                      }
                      disabled={loading || verifying || !account}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading || verifying 
                        ? 'Processing...' 
                        : selectedProduct?.id === product.id && verificationStatus?.isVerified && verificationStatus?.isSecondHand
                          ? 'Buy Now'
                          : 'Verify & Buy'
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;