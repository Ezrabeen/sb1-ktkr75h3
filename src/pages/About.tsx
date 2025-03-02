import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Leaf, ArrowRight, Globe, Coins, ShoppingBag } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-center mb-8">
            <Recycle className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Bridging Sustainable Commerce with Web3
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto opacity-90">
            ReVive is revolutionizing the way we think about second-hand commerce by connecting traditional marketplaces with the VebetterDAO ecosystem.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              We believe in creating a more sustainable future by incentivizing and rewarding eco-conscious consumer behavior. By bridging traditional e-commerce with blockchain technology, we're building a platform that makes sustainable shopping both rewarding and accessible.
            </p>
            <p className="text-lg text-gray-600">
              Every purchase through ReVive not only gives pre-loved items a second life but also earns you B3TR tokens, connecting you to the broader VebetterDAO ecosystem of sustainable initiatives.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Globe className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Environmental Impact</h3>
              <p className="text-gray-600">Reducing waste through circular economy principles</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Coins className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Token Rewards</h3>
              <p className="text-gray-600">Earn B3TR tokens for sustainable choices</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <ShoppingBag className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
              <p className="text-gray-600">Seamless connection with existing marketplaces</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Leaf className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">Supporting eco-friendly consumer behavior</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How ReVive Works with VebetterDAO</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Shop Sustainably</h3>
              <p className="text-gray-600">
                Browse and purchase pre-loved items from connected marketplaces like eBay through our platform.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Recycle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Verify Transactions</h3>
              <p className="text-gray-600">
                Each purchase is verified and recorded on the blockchain, ensuring transparency and trust.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coins className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Earn Rewards</h3>
              <p className="text-gray-600">
                Receive B3TR tokens for your sustainable purchases, which can be used within the VebetterDAO ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Benefits of Using ReVive</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4">For Shoppers</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="ml-3">Earn B3TR tokens for sustainable shopping</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="ml-3">Access to verified pre-loved items</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="ml-3">Contribute to environmental sustainability</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4">For the Environment</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="ml-3">Reduced waste through item reuse</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="ml-3">Lower carbon footprint from manufacturing</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="ml-3">Support for circular economy initiatives</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Sustainable Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join ReVive today and become part of the sustainable commerce revolution while earning rewards for your eco-conscious choices.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors"
          >
            Start Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;