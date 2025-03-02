import React from 'react';
import { ArrowRight, Leaf, RefreshCw, Coins, ShieldCheck, Recycle, ShoppingBag, CheckCircle, Wallet, Smartphone, Shirt, BookOpen, Sofa, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="relative bg-green-600 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1530653333484-d02d0faff9bf"
            alt="Sustainable Products"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              ReVive Your Lifestyle
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Give pre-loved items a second life. From fashion to furniture, electronics to accessories - join our sustainable marketplace and earn B3TR tokens for every eco-conscious transaction.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/marketplace"
                className="inline-flex items-center bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/about"
                className="inline-flex items-center border-2 border-white px-8 py-3 rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ReVive?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're revolutionizing sustainable commerce through blockchain technology and circular economy principles.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <Leaf className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-gray-600">
              Reduce waste and environmental impact by giving products a second life
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <RefreshCw className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Circular Economy</h3>
            <p className="text-gray-600">
              Transform how we consume by making reuse the new standard
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <Coins className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">B3TR Rewards</h3>
            <p className="text-gray-600">
              Earn tokens for every sustainable transaction you make
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <ShieldCheck className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verified Items</h3>
            <p className="text-gray-600">
              Quality-checked products from our trusted community
            </p>
          </div>
        </div>

        {/* Enhanced Visual How ReVive Works Section */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How ReVive Works</h2>
            <p className="text-gray-600">Bridging sustainable commerce with blockchain rewards</p>
          </div>
          
          {/* Visual Flow Diagram */}
          <div className="relative">
            {/* Connection Lines - Desktop Only */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-green-200 -translate-y-1/2 z-0"></div>
            <div className="hidden md:block absolute top-1/2 left-[25%] h-16 w-1 bg-green-200 -translate-y-full z-0"></div>
            <div className="hidden md:block absolute top-1/2 left-[50%] h-16 w-1 bg-green-200 -translate-y-full z-0"></div>
            <div className="hidden md:block absolute top-1/2 left-[75%] h-16 w-1 bg-green-200 -translate-y-full z-0"></div>
            
            {/* Steps */}
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1: Connect Wallet */}
              <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-gray-600 mb-4">Link your VeChain wallet to start your sustainable journey</p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold">1</span>
                </div>
              </div>
              
              {/* Step 2: Browse & Verify */}
              <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse & Verify</h3>
                <p className="text-gray-600 mb-4">Discover second-hand items from eBay and verify their authenticity</p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold">2</span>
                </div>
              </div>
              
              {/* Step 3: Purchase */}
              <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Purchase</h3>
                <p className="text-gray-600 mb-4">Buy verified second-hand items with transaction recorded on blockchain</p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold">3</span>
                </div>
              </div>
              
              {/* Step 4: Earn Rewards */}
              <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
                <p className="text-gray-600 mb-4">Receive B3TR tokens from VebetterDAO for your sustainable choices</p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold">4</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual Diagram of the Bridge */}
          <div className="mt-16 bg-white rounded-xl shadow-md p-6 overflow-hidden">
            <h3 className="text-xl font-semibold mb-6 text-center">ReVive: Bridging Traditional Commerce with Web3</h3>
            
            <div className="relative">
              {/* Bridge Visual */}
              <div className="flex flex-col md:flex-row items-center justify-between relative">
                {/* Left Side: Traditional Commerce */}
                <div className="bg-gray-100 rounded-lg p-4 md:w-1/3 text-center mb-8 md:mb-0 z-10">
                  <h4 className="font-semibold mb-2">Traditional Marketplaces</h4>
                  <div className="flex justify-center space-x-2 mb-3">
                    <div className="bg-white p-2 rounded-full">
                      <ShoppingBag className="h-6 w-6 text-gray-700" />
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 text-left space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      Second-hand products
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      Seller verification
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      Product listings
                    </li>
                  </ul>
                </div>
                
                {/* Bridge */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 hidden md:block">
                  <div className="h-4 bg-gradient-to-r from-gray-300 via-green-500 to-green-600 rounded-full"></div>
                </div>
                
                {/* Middle: ReVive */}
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 md:w-1/4 text-center mb-8 md:mb-0 z-20 transform md:translate-y-8">
                  <h4 className="font-semibold mb-2 text-green-700">ReVive</h4>
                  <div className="flex justify-center mb-3">
                    <div className="bg-green-600 p-2 rounded-full">
                      <Recycle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <ul className="text-sm text-green-700 text-left space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      Verification
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      Blockchain recording
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      Reward calculation
                    </li>
                  </ul>
                </div>
                
                {/* Right Side: Web3 */}
                <div className="bg-green-600 text-white rounded-lg p-4 md:w-1/3 text-center z-10">
                  <h4 className="font-semibold mb-2">VebetterDAO Ecosystem</h4>
                  <div className="flex justify-center space-x-2 mb-3">
                    <div className="bg-white p-2 rounded-full">
                      <Coins className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <ul className="text-sm text-white text-left space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                      B3TR token rewards
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                      Sustainability tracking
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                      Environmental impact
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Data Flow Arrows */}
              <div className="hidden md:block">
                <div className="absolute top-1/3 left-[30%] transform -translate-x-1/2 -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-green-600" />
                </div>
                <div className="absolute top-1/3 left-[70%] transform -translate-x-1/2 -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VebetterDAO Sustainability Proof Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-8">Sustainability Impact by Category</h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Each second-hand purchase through ReVive contributes to measurable environmental benefits. 
            Below are the verified sustainability metrics based on VebetterDAO's impact assessment framework.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Clothing Category */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-3">
                  <Shirt className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Clothing</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">CO₂ Reduction</span>
                    <span className="text-green-600 font-bold">10.2 kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Compared to 12 kg CO₂ for new production
                  </p>
                </div>
                
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Water Saved</span>
                    <span className="text-green-600 font-bold">2,700 L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Equivalent to 18 days of drinking water for one person
                  </p>
                </div>
                
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Waste Reduction</span>
                    <span className="text-green-600 font-bold">0.5 kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Textile waste diverted from landfill
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">VebetterDAO Verified</span>
                  <span className="text-sm font-medium text-green-600">High Impact</span>
                </div>
              </div>
            </div>
            
            {/* Electronics Category */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-3">
                  <Smartphone className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Electronics</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">CO₂ Reduction</span>
                    <span className="text-green-600 font-bold">80.5 kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Compared to 85 kg CO₂ for new smartphone production
                  </p>
                </div>
                
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Water Saved</span>
                    <span className="text-green-600 font-bold">12,800 L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Water required for semiconductor production
                  </p>
                </div>
                
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">E-Waste Reduction</span>
                    <span className="text-green-600 font-bold">0.15 kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Toxic materials kept out of landfills
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">VebetterDAO Verified</span>
                  <span className="text-sm font-medium text-green-600">Very High Impact</span>
                </div>
              </div>
            </div>
            
            {/* Books Category */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-3">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Books</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">CO₂ Reduction</span>
                    <span className="text-green-600 font-bold">6.3 kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Per book, compared to new production
                  </p>
                </div>
                
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Water Saved</span>
                    <span className="text-green-600 font-bold">3,400 L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Water used in paper production and printing
                  </p>
                </div>
                
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Trees Saved</span>
                    <span className="text-green-600 font-bold">0.6 trees</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Per 20 books purchased second-hand
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">VebetterDAO Verified</span>
                  <span className="text-sm font-medium text-green-600">Medium Impact</span>
                </div>
              </div>
            </div>
            
            {/* Furniture Category */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-3">
                  <Sofa className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Furniture</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">CO₂ Reduction</span>
                    <span className="text-green-600 font-bold">100 kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Average per furniture item
                  </p>
                </div>
                
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Wood Saved</span>
                    <span className="text-green-600 font-bold">20 kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Raw materials preserved
                  </p>
                </div>
                
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Waste Reduction</span>
                    <span className="text-green-600 font-bold">25 kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Bulky waste diverted from landfill
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">VebetterDAO Verified</span>
                  <span className="text-sm font-medium text-green-600">Very High Impact</span>
                </div>
              </div>
            </div>
            
            {/* Audio Equipment Category */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-3">
                  <Headphones className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Audio Equipment</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">CO₂ Reduction</span>
                    <span className="text-green-600 font-bold">25 kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Per audio device (headphones, speakers)
                  </p>
                </div>
                
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Rare Metals Saved</span>
                    <span className="text-green-600 font-bold">5 g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Including neodymium and other rare earth elements
                  </p>
                </div>
                
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">E-Waste Reduction</span>
                    <span className="text-green-600 font-bold">0.3 kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Electronic components kept in circulation
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">VebetterDAO Verified</span>
                  <span className="text-sm font-medium text-green-600">High Impact</span>
                </div>
              </div>
            </div>
            
            {/* Methodology Card */}
            <div className="bg-white rounded-lg p-6 border-2 border-dashed border-green-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">VebetterDAO Verification Methodology</h3>
              <p className="text-gray-600 mb-4">
                All sustainability metrics are calculated using VebetterDAO's standardized impact assessment framework, which includes:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Life Cycle Assessment (LCA) data from peer-reviewed studies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Product-specific material composition analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Manufacturing energy and resource consumption data</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Transportation and packaging impact calculations</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link to="/about" className="text-green-600 hover:text-green-700 font-medium flex items-center">
                  Learn more about our methodology
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Make a Difference?</h2>
          <Link
            to="/marketplace"
            className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Explore Marketplace
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;