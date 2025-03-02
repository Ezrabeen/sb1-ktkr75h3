import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, ShoppingBag, User } from 'lucide-react';
import { useVeChain } from '../hooks/useVeChain';

const Navbar = () => {
  const { account, balance, loading, connect } = useVeChain();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <span className="font-bold text-xl text-gray-900">ReVive</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/marketplace" className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors">
              <ShoppingBag className="h-5 w-5" />
              <span>Marketplace</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            {account ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <p className="text-gray-600">{account.slice(0, 6)}...{account.slice(-4)}</p>
                  {balance && (
                    <p className="text-green-600 font-medium">{parseFloat(balance.balance) / Math.pow(10, balance.decimals)} {balance.symbol}</p>
                  )}
                </div>
              </div>
            ) : (
              <button 
                onClick={connect}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;