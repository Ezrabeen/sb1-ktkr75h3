import React, { useState, useEffect } from 'react';
import { Wallet, Package, History, Star, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle, Clock, Smartphone, Shirt, BookOpen, Sofa, Headphones, Coins } from 'lucide-react';
import { useVeChain } from '../hooks/useVeChain';
import { useRewards } from '../hooks/useRewards';
import { getUserTransactions, Transaction } from '../services/transactions';

const Profile = () => {
  const { account } = useVeChain();
  const { getRewardBalance } = useRewards();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rewardBalance, setRewardBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account) {
      fetchUserData();
    }
  }, [account]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user transactions
      const userTransactions = await getUserTransactions(account || '');
      setTransactions(userTransactions);
      
      // Fetch reward balance
      const balance = await getRewardBalance();
      setRewardBalance(balance);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate sustainability score based on transaction history
  const calculateSustainabilityScore = () => {
    if (transactions.length === 0) return 0;
    
    const totalScore = transactions.reduce((sum, tx) => sum + (tx.sustainability_score || 0), 0);
    return Math.min(Math.round(totalScore / transactions.length), 100);
  };

  // Determine user level based on transaction count and sustainability score
  const getUserLevel = () => {
    const txCount = transactions.length;
    const score = calculateSustainabilityScore();
    
    if (txCount >= 20 && score >= 80) return 'Eco Warrior';
    if (txCount >= 10 && score >= 70) return 'Sustainability Champion';
    if (txCount >= 5 && score >= 60) return 'Eco-Conscious';
    return 'Beginner';
  };

  // Get verification status icon
  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('clothing') || lowerCategory.includes('apparel') || lowerCategory.includes('fashion')) {
      return <Shirt className="h-5 w-5 text-green-600" />;
    } else if (lowerCategory.includes('electronics') || lowerCategory.includes('phone') || lowerCategory.includes('computer')) {
      return <Smartphone className="h-5 w-5 text-green-600" />;
    } else if (lowerCategory.includes('book') || lowerCategory.includes('media')) {
      return <BookOpen className="h-5 w-5 text-green-600" />;
    } else if (lowerCategory.includes('furniture') || lowerCategory.includes('home')) {
      return <Sofa className="h-5 w-5 text-green-600" />;
    } else if (lowerCategory.includes('audio') || lowerCategory.includes('headphone') || lowerCategory.includes('speaker')) {
      return <Headphones className="h-5 w-5 text-green-600" />;
    } else {
      return <Package className="h-5 w-5 text-green-600" />;
    }
  };

  // Calculate environmental impact based on product category
  const calculateEnvironmentalImpact = () => {
    if (transactions.length === 0) return { co2: 0, water: 0, waste: 0 };
    
    let totalCO2 = 0;
    let totalWater = 0;
    let totalWaste = 0;
    
    transactions.forEach(tx => {
      const category = tx.product_details.category.toLowerCase();
      
      // Apply category-specific impact values based on VebetterDAO metrics
      if (category.includes('clothing') || category.includes('apparel') || category.includes('fashion')) {
        totalCO2 += 10.2;
        totalWater += 2700;
        totalWaste += 0.5;
      } else if (category.includes('electronics') || category.includes('phone') || category.includes('computer')) {
        totalCO2 += 80.5;
        totalWater += 12800;
        totalWaste += 0.15;
      } else if (category.includes('book') || category.includes('media')) {
        totalCO2 += 6.3;
        totalWater += 3400;
        totalWaste += 0.3;
      } else if (category.includes('furniture') || category.includes('home')) {
        totalCO2 += 100;
        totalWater += 5000;
        totalWaste += 25;
      } else if (category.includes('audio') || category.includes('headphone') || category.includes('speaker')) {
        totalCO2 += 25;
        totalWater += 4000;
        totalWaste += 0.3;
      } else {
        // Default values for other categories
        totalCO2 += 15;
        totalWater += 3000;
        totalWaste += 1;
      }
    });
    
    return {
      co2: totalCO2.toFixed(1),
      water: Math.round(totalWater).toLocaleString(),
      waste: totalWaste.toFixed(1)
    };
  };

  const impact = calculateEnvironmentalImpact();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">My Profile</h1>
          <p className="text-lg opacity-90">Manage your sustainable commerce journey</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!account ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-500 mb-6">Connect your wallet to view your profile and transaction history</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Connect Wallet
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Wallet className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">B3TR Balance</h2>
                    <p className="text-gray-500">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600">{rewardBalance} B3TR</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Sustainability Score</h2>
                    <p className="text-gray-500">Level: {getUserLevel()}</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600">{calculateSustainabilityScore()}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Total Items</h2>
                    <p className="text-gray-500">Purchased</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600">{transactions.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Transaction History</h3>
              </div>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No transactions yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start shopping to earn rewards!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rewards
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Impact
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Verification
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-md object-cover" src={tx.product_details.image} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 line-clamp-1">{tx.product_details.title}</div>
                                <div className="flex items-center text-sm text-gray-500">
                                  {getCategoryIcon(tx.product_details.category)}
                                  <span className="ml-1">{tx.product_details.category}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(tx.created_at).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500">{new Date(tx.created_at).toLocaleTimeString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">${tx.purchase_amount.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-green-600 font-medium">
                              <Coins className="h-4 w-4 mr-1" />
                              {tx.reward_amount} B3TR
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-500">
                              {tx.product_details.category.toLowerCase().includes('electronics') ? (
                                <span>80.5 kg CO₂ saved</span>
                              ) : tx.product_details.category.toLowerCase().includes('clothing') ? (
                                <span>10.2 kg CO₂ saved</span>
                              ) : tx.product_details.category.toLowerCase().includes('furniture') ? (
                                <span>100 kg CO₂ saved</span>
                              ) : tx.product_details.category.toLowerCase().includes('book') ? (
                                <span>6.3 kg CO₂ saved</span>
                              ) : tx.product_details.category.toLowerCase().includes('audio') ? (
                                <span>25 kg CO₂ saved</span>
                              ) : (
                                <span>15 kg CO₂ saved</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getVerificationStatusIcon(tx.verification_status)}
                              <span className="ml-1 text-sm text-gray-700 capitalize">{tx.verification_status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sustainability Impact</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">CO₂ Saved</h4>
                  <p className="text-2xl font-bold text-green-700">
                    {impact.co2} kg
                  </p>
                  <p className="text-sm text-green-600 mt-1">By purchasing second-hand items</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Water Saved</h4>
                  <p className="text-2xl font-bold text-green-700">
                    {impact.water} L
                  </p>
                  <p className="text-sm text-green-600 mt-1">Compared to new production</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Waste Reduced</h4>
                  <p className="text-2xl font-bold text-green-700">
                    {impact.waste} kg
                  </p>
                  <p className="text-sm text-green-600 mt-1">By extending product lifecycles</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;