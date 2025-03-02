import axios from 'axios';

// Interface for eBay API response
interface EbayApiResponse {
  itemSummaries: Array<{
    itemId: string;
    title: string;
    price: {
      value: string;
      currency: string;
    };
    image?: {
      imageUrl: string;
    };
    condition: string;
    seller: {
      username: string;
      feedbackScore: number;
    };
    categories?: Array<{
      categoryName: string;
    }>;
    itemLocation: {
      country: string;
    };
    itemWebUrl: string;
  }>;
}

export interface EbayProduct {
  id: string;
  title: string;
  price: {
    value: number;
    currency: string;
  };
  image: string;
  condition: string;
  seller: {
    username: string;
    feedbackScore: number;
  };
  category: string;
  location: string;
  url: string;
  isSecondHand: boolean;
  listedDate?: string;
  productSpecifics?: Record<string, string>;
}

// Mock data for development
const mockProducts: EbayProduct[] = [
  {
    id: '1',
    title: 'Vintage Levi\'s Denim Jacket',
    price: {
      value: 45.99,
      currency: 'USD'
    },
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0',
    condition: 'Excellent',
    seller: {
      username: 'eco_seller',
      feedbackScore: 4.5
    },
    category: 'Clothing',
    location: 'US',
    url: 'https://www.ebay.com/itm/example1',
    isSecondHand: true,
    listedDate: '2025-02-15',
    productSpecifics: {
      brand: 'Levi\'s',
      size: 'M',
      color: 'Blue',
      material: 'Denim'
    }
  },
  {
    id: '2',
    title: 'Eco-friendly Nike Sneakers',
    price: {
      value: 29.99,
      currency: 'USD'
    },
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    condition: 'Like New',
    seller: {
      username: 'green_kicks',
      feedbackScore: 5
    },
    category: 'Footwear',
    location: 'US',
    url: 'https://www.ebay.com/itm/example2',
    isSecondHand: true,
    listedDate: '2025-02-20',
    productSpecifics: {
      brand: 'Nike',
      size: '10',
      color: 'White/Green',
      material: 'Recycled materials'
    }
  },
  {
    id: '3',
    title: 'Refurbished iPhone 13 Pro - 128GB',
    price: {
      value: 499.99,
      currency: 'USD'
    },
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab',
    condition: 'Refurbished',
    seller: {
      username: 'tech_recyclers',
      feedbackScore: 4.8
    },
    category: 'Electronics',
    location: 'US',
    url: 'https://www.ebay.com/itm/example3',
    isSecondHand: true,
    listedDate: '2025-02-18',
    productSpecifics: {
      brand: 'Apple',
      model: 'iPhone 13 Pro',
      storage: '128GB',
      color: 'Graphite'
    }
  },
  {
    id: '4',
    title: 'Vintage Mid-Century Coffee Table',
    price: {
      value: 125.00,
      currency: 'USD'
    },
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a694',
    condition: 'Good',
    seller: {
      username: 'vintage_home',
      feedbackScore: 4.7
    },
    category: 'Furniture',
    location: 'US',
    url: 'https://www.ebay.com/itm/example4',
    isSecondHand: true,
    listedDate: '2025-02-10',
    productSpecifics: {
      material: 'Teak wood',
      dimensions: '40" x 20" x 16"',
      era: '1960s'
    }
  },
  {
    id: '5',
    title: 'Pre-owned Designer Handbag - Louis Vuitton',
    price: {
      value: 850.00,
      currency: 'USD'
    },
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    condition: 'Excellent',
    seller: {
      username: 'luxury_preloved',
      feedbackScore: 4.9
    },
    category: 'Bags',
    location: 'US',
    url: 'https://www.ebay.com/itm/example5',
    isSecondHand: true,
    listedDate: '2025-02-22',
    productSpecifics: {
      brand: 'Louis Vuitton',
      model: 'Neverfull MM',
      color: 'Monogram',
      authenticity: 'Verified authentic'
    }
  },
  {
    id: '6',
    title: 'Vintage Vinyl Records Collection - 1970s Rock',
    price: {
      value: 75.50,
      currency: 'USD'
    },
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617',
    condition: 'Good',
    seller: {
      username: 'vinyl_treasures',
      feedbackScore: 4.6
    },
    category: 'Music',
    location: 'US',
    url: 'https://www.ebay.com/itm/example6',
    isSecondHand: true,
    listedDate: '2025-02-14',
    productSpecifics: {
      genre: 'Rock',
      era: '1970s',
      quantity: '10 records',
      artists: 'Led Zeppelin, Pink Floyd, The Who'
    }
  }
];

export async function searchProducts(query: string, filter?: {
  condition?: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
}): Promise<EbayProduct[]> {
  // For development, return filtered mock data
  if (true) { // Always use mock data for now
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    let filteredProducts = [...mockProducts];
    
    // Apply search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.title.toLowerCase().includes(lowerQuery) || 
        product.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply filters
    if (filter) {
      if (filter.condition) {
        filteredProducts = filteredProducts.filter(product => 
          product.condition.toLowerCase().includes(filter.condition.toLowerCase())
        );
      }
      
      if (filter.category) {
        filteredProducts = filteredProducts.filter(product => 
          product.category.toLowerCase().includes(filter.category.toLowerCase())
        );
      }
      
      if (filter.maxPrice) {
        filteredProducts = filteredProducts.filter(product => 
          product.price.value <= filter.maxPrice
        );
      }
      
      if (filter.minPrice) {
        filteredProducts = filteredProducts.filter(product => 
          product.price.value >= filter.minPrice
        );
      }
    }
    
    return filteredProducts;
  }

  try {
    // In production, make actual eBay API call
    const response = await axios.get<EbayApiResponse>('https://api.ebay.com/buy/browse/v1/item_summary/search', {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_EBAY_CLIENT_ID}`,
        'Content-Type': 'application/json'
      },
      params: {
        q: query,
        limit: 50,
        ...filter
      }
    });

    return response.data.itemSummaries.map(item => {
      // Determine if item is second-hand based on condition
      const isSecondHand = ['used', 'refurbished', 'pre-owned', 'good', 'fair', 'excellent'].includes(
        item.condition.toLowerCase()
      );
      
      return {
        id: item.itemId,
        title: item.title,
        price: {
          value: parseFloat(item.price.value),
          currency: item.price.currency
        },
        image: item.image?.imageUrl || 'https://via.placeholder.com/300',
        condition: item.condition,
        seller: {
          username: item.seller.username,
          feedbackScore: item.seller.feedbackScore
        },
        category: item.categories?.[0]?.categoryName || 'Uncategorized',
        location: item.itemLocation.country,
        url: item.itemWebUrl,
        isSecondHand
      };
    });
  } catch (error) {
    console.error('Error fetching products from eBay:', error);
    return [];
  }
}

// Verify product authenticity and second-hand status
export async function verifyProduct(productId: string): Promise<{
  isVerified: boolean;
  isSecondHand: boolean;
  verificationDetails?: string;
}> {
  // For development, simulate verification
  if (true) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate verification delay
    
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      return {
        isVerified: false,
        isSecondHand: false,
        verificationDetails: 'Product not found'
      };
    }
    
    // Check if product is second-hand based on condition
    const isSecondHand = ['used', 'refurbished', 'pre-owned', 'good', 'fair', 'excellent'].includes(
      product.condition.toLowerCase()
    );
    
    return {
      isVerified: true,
      isSecondHand,
      verificationDetails: isSecondHand 
        ? `Verified second-hand ${product.category} in ${product.condition} condition` 
        : 'Product is new, not eligible for sustainability rewards'
    };
  }
  
  // In production, this would make an API call to eBay to verify the product
  try {
    const response = await axios.get(`https://api.ebay.com/buy/browse/v1/item/${productId}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_EBAY_CLIENT_ID}`,
        'Content-Type': 'application/json'
      }
    });
    
    const item = response.data;
    const isSecondHand = ['used', 'refurbished', 'pre-owned', 'good', 'fair', 'excellent'].includes(
      item.condition.toLowerCase()
    );
    
    return {
      isVerified: true,
      isSecondHand,
      verificationDetails: isSecondHand 
        ? `Verified second-hand ${item.categories[0].categoryName} in ${item.condition} condition` 
        : 'Product is new, not eligible for sustainability rewards'
    };
  } catch (error) {
    console.error('Error verifying product:', error);
    return {
      isVerified: false,
      isSecondHand: false,
      verificationDetails: 'Verification failed'
    };
  }
}