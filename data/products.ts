export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  images: string[]
  condition: string
  seller: string
  sellerName: string
  sellerRating: number
  category: string
  subcategory: string
  listedDate: string
  marketplace: "ebay" | "vinted" | "etsy" | "other"
  productLink: string
  details: Record<string, string>
  shipping: {
    methods: string[]
    locations: string[]
    cost: number
  }
  history: {
    event: string
    date: string
    price: number
  }[]
}

export const products: Product[] = [
  {
    id: "1",
    name: "Vintage Levi's 501 Jeans",
    description:
      "Authentic vintage Levi's 501 jeans from the 90s. High-waisted, straight leg fit. Minimal wear with great fading and character. Extending the life of denim is one of the best ways to reduce fashion's environmental impact.",
    price: 65.99,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    ],
    condition: "Good",
    seller: "0x1234567890abcdef1234567890abcdef12345678",
    sellerName: "VintageFinds",
    sellerRating: 4.8,
    category: "Clothing",
    subcategory: "Jeans",
    listedDate: "2023-10-15",
    marketplace: "ebay",
    productLink: "https://www.ebay.com/itm/134153429282",
    details: {
      brand: "Levi's",
      size: "W32 L30",
      color: "Medium Blue",
      material: "100% Cotton",
      age: "1990s",
      style: "501",
    },
    shipping: {
      methods: ["Standard", "Express"],
      locations: ["Worldwide"],
      cost: 8.5,
    },
    history: [
      { event: "Listed", date: "2023-10-15", price: 75.99 },
      { event: "Price reduced", date: "2023-11-01", price: 65.99 },
    ],
  },
  {
    id: "2",
    name: "Refurbished iPhone 12 Pro - 128GB",
    description:
      "Professionally refurbished iPhone 12 Pro with 128GB storage. Battery health at 92%. Includes charger and 6-month warranty. Buying refurbished electronics significantly reduces e-waste and conserves valuable resources.",
    price: 499.99,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1603891128711-11b4b03bb138?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      "https://images.unsplash.com/photo-1592286927505-1def25115558?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80",
    ],
    condition: "Excellent",
    seller: "0x9876543210abcdef1234567890abcdef12345678",
    sellerName: "TechRenewal",
    sellerRating: 4.9,
    category: "Electronics",
    subcategory: "Smartphones",
    listedDate: "2023-11-05",
    marketplace: "ebay",
    productLink: "https://www.ebay.com/itm/165289461058",
    details: {
      brand: "Apple",
      model: "iPhone 12 Pro",
      storage: "128GB",
      color: "Pacific Blue",
      batteryHealth: "92%",
      warranty: "6 months",
    },
    shipping: {
      methods: ["Standard", "Express", "Next Day"],
      locations: ["Worldwide"],
      cost: 12.99,
    },
    history: [
      { event: "Listed", date: "2023-11-05", price: 549.99 },
      { event: "Price reduced", date: "2023-12-01", price: 499.99 },
    ],
  },
  {
    id: "3",
    name: "Mid-Century Modern Teak Coffee Table",
    description:
      "Beautiful mid-century modern teak coffee table from the 1960s. Solid wood construction with elegant tapered legs. Some patina consistent with age but in excellent structural condition. Reusing vintage furniture prevents deforestation and reduces landfill waste.",
    price: 225.0,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1206&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80",
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    ],
    condition: "Good",
    seller: "0x5678901234abcdef1234567890abcdef12345678",
    sellerName: "RetroHome",
    sellerRating: 4.7,
    category: "Furniture",
    subcategory: "Tables",
    listedDate: "2023-09-20",
    marketplace: "etsy",
    productLink: "https://www.etsy.com/listing/1032847558/",
    details: {
      material: "Solid Teak",
      dimensions: "120cm x 60cm x 45cm",
      era: "1960s",
      style: "Mid-Century Modern",
      condition: "Some age-related patina, excellent structural integrity",
    },
    shipping: {
      methods: ["Specialist Furniture Courier"],
      locations: ["Continental US"],
      cost: 45.0,
    },
    history: [
      { event: "Listed", date: "2023-09-20", price: 250.0 },
      { event: "Price reduced", date: "2023-10-15", price: 225.0 },
    ],
  },
  {
    id: "4",
    name: "Vintage Polaroid SX-70 Camera",
    description:
      "Iconic Polaroid SX-70 Land Camera from the 1970s. Fully tested and working. Includes original leather case. Buying vintage cameras reduces demand for new electronics and preserves photographic history.",
    price: 189.0,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1585036156261-1e2ac055a1b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    ],
    condition: "Good",
    seller: "0x1234567890abcdef1234567890abcdef12345678",
    sellerName: "VintageFinds",
    sellerRating: 4.8,
    category: "Electronics",
    subcategory: "Cameras",
    listedDate: "2023-10-10",
    marketplace: "etsy",
    productLink: "https://www.etsy.com/listing/1472025272/",
    details: {
      brand: "Polaroid",
      model: "SX-70",
      era: "1970s",
      includes: "Original leather case",
      functionality: "Fully tested and working",
    },
    shipping: {
      methods: ["Standard", "Express"],
      locations: ["Worldwide"],
      cost: 15.0,
    },
    history: [
      { event: "Listed", date: "2023-10-10", price: 199.0 },
      { event: "Price reduced", date: "2023-11-15", price: 189.0 },
    ],
  },
  {
    id: "5",
    name: "Patagonia Better Sweater Fleece Jacket",
    description:
      "Gently used Patagonia Better Sweater fleece jacket in excellent condition. Men's size medium, heather gray color. Made from recycled polyester. Extending the life of quality outdoor gear reduces environmental impact.",
    price: 75.0,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80",
      "https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1617952236317-0bd127407984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    ],
    condition: "Excellent",
    seller: "0x9876543210abcdef1234567890abcdef12345678",
    sellerName: "OutdoorGearExchange",
    sellerRating: 4.6,
    category: "Clothing",
    subcategory: "Outerwear",
    listedDate: "2023-11-20",
    marketplace: "vinted",
    productLink: "https://www.vinted.com/items/123456789",
    details: {
      brand: "Patagonia",
      size: "Medium",
      color: "Heather Gray",
      material: "Recycled Polyester",
      style: "Better Sweater",
    },
    shipping: {
      methods: ["Standard"],
      locations: ["US, Canada"],
      cost: 7.5,
    },
    history: [
      { event: "Listed", date: "2023-11-20", price: 85.0 },
      { event: "Price reduced", date: "2023-12-05", price: 75.0 },
    ],
  },
  {
    id: "6",
    name: "Vintage Vinyl Records Collection - Classic Rock",
    description:
      "Collection of 15 classic rock vinyl records from the 70s and 80s. Includes albums from Led Zeppelin, Pink Floyd, The Rolling Stones, and more. All in good playable condition with original sleeves. Collecting vintage vinyl reduces demand for new plastic production.",
    price: 120.0,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1542208998-f6dbbb69a1f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    ],
    condition: "Good",
    seller: "0x5678901234abcdef1234567890abcdef12345678",
    sellerName: "VinylVault",
    sellerRating: 4.9,
    category: "Entertainment",
    subcategory: "Music",
    listedDate: "2023-10-25",
    marketplace: "ebay",
    productLink: "https://www.ebay.com/itm/134153429282",
    details: {
      format: "Vinyl LP",
      genre: "Classic Rock",
      era: "1970s-1980s",
      quantity: "15 albums",
      condition: "Good playable condition, some sleeve wear",
    },
    shipping: {
      methods: ["Standard", "Express"],
      locations: ["US, Canada, UK, EU"],
      cost: 18.5,
    },
    history: [
      { event: "Listed", date: "2023-10-25", price: 150.0 },
      { event: "Price reduced", date: "2023-11-15", price: 120.0 },
    ],
  },
  {
    id: "7",
    name: "Refurbished Trek Mountain Bike",
    description:
      "Professionally refurbished Trek 4500 mountain bike. New brake pads, recently tuned gears, and fresh tires. Perfect for trails or commuting. Buying refurbished bikes reduces manufacturing demand and keeps usable equipment out of landfills.",
    price: 285.0,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1122&q=80",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    ],
    condition: "Excellent",
    seller: "0x1234567890abcdef1234567890abcdef12345678",
    sellerName: "BikeRevival",
    sellerRating: 4.7,
    category: "Sports",
    subcategory: "Cycling",
    listedDate: "2023-11-10",
    marketplace: "ebay",
    productLink: "https://www.ebay.com/itm/165289461058",
    details: {
      brand: "Trek",
      model: "4500",
      frameSize: "18 inch",
      wheelSize: "26 inch",
      gears: "21 speed",
      color: "Matte Black",
    },
    shipping: {
      methods: ["Specialist Courier"],
      locations: ["Continental US"],
      cost: 35.0,
    },
    history: [
      { event: "Listed", date: "2023-11-10", price: 325.0 },
      { event: "Price reduced", date: "2023-12-01", price: 285.0 },
    ],
  },
  {
    id: "8",
    name: "Vintage Leather Messenger Bag",
    description:
      "Handcrafted vintage leather messenger bag with brass hardware. Shows beautiful patina from use but in excellent structural condition. Perfect for laptops up to 15 inches. Quality leather goods can last decades with proper care.",
    price: 95.0,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=876&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80",
    ],
    condition: "Good",
    seller: "0x9876543210abcdef1234567890abcdef12345678",
    sellerName: "LeatherHeirloom",
    sellerRating: 4.8,
    category: "Accessories",
    subcategory: "Bags",
    listedDate: "2023-10-05",
    marketplace: "etsy",
    productLink: "https://www.etsy.com/listing/1032847558/",
    details: {
      material: "Full Grain Leather",
      dimensions: "15 x 11 x 4 inches",
      color: "Brown",
      features: "Adjustable strap, multiple pockets",
      age: "Approximately 10 years",
    },
    shipping: {
      methods: ["Standard", "Express"],
      locations: ["Worldwide"],
      cost: 12.0,
    },
    history: [
      { event: "Listed", date: "2023-10-05", price: 110.0 },
      { event: "Price reduced", date: "2023-11-01", price: 95.0 },
    ],
  },
  {
    id: "9",
    name: "Vintage Mechanical Watch - Omega Seamaster",
    description:
      "Beautiful vintage Omega Seamaster from the 1960s. Recently serviced and running perfectly. Shows minor signs of wear consistent with age. Comes with original box. Vintage watches are sustainable alternatives to new timepieces.",
    price: 850.0,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80",
    ],
    condition: "Good",
    seller: "0x5678901234abcdef1234567890abcdef12345678",
    sellerName: "VintageTimepieces",
    sellerRating: 4.9,
    category: "Accessories",
    subcategory: "Watches",
    listedDate: "2023-09-15",
    marketplace: "ebay",
    productLink: "https://www.ebay.com/itm/134153429282",
    details: {
      brand: "Omega",
      model: "Seamaster",
      era: "1960s",
      movement: "Automatic",
      caseMaterial: "Stainless Steel",
      diameter: "36mm",
    },
    shipping: {
      methods: ["Insured Shipping", "Express"],
      locations: ["Worldwide"],
      cost: 25.0,
    },
    history: [
      { event: "Listed", date: "2023-09-15", price: 950.0 },
      { event: "Price reduced", date: "2023-10-20", price: 850.0 },
    ],
  },
  {
    id: "10",
    name: "Antique Wooden Bookshelf",
    description:
      "Beautifully crafted antique oak bookshelf from the early 1900s. Solid construction with intricate carvings. Five shelves provide ample storage space. Reusing antique furniture preserves craftsmanship and reduces demand for new wood.",
    price: 375.0,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1039&q=80",
      "https://images.unsplash.com/photo-1588599336083-39c73723c63e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    ],
    condition: "Good",
    seller: "0x1234567890abcdef1234567890abcdef12345678",
    sellerName: "AntiqueFinds",
    sellerRating: 4.7,
    category: "Furniture",
    subcategory: "Bookshelves",
    listedDate: "2023-08-10",
    marketplace: "etsy",
    productLink: "https://www.etsy.com/listing/1032847558/",
    details: {
      material: "Solid Oak",
      dimensions: "180cm x 120cm x 40cm",
      era: "Early 1900s",
      style: "Victorian",
      features: "Carved details, adjustable shelves",
    },
    shipping: {
      methods: ["Specialist Furniture Courier"],
      locations: ["Continental US"],
      cost: 65.0,
    },
    history: [
      { event: "Listed", date: "2023-08-10", price: 425.0 },
      { event: "Price reduced", date: "2023-09-15", price: 375.0 },
    ],
  },
]

// Helper function to get product by ID
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

// Helper function to get products by category
export function getProductsByCategory(category: string): Product[] {
  return products.filter(
    (product) =>
      product.category.toLowerCase() === category.toLowerCase() ||
      product.subcategory.toLowerCase() === category.toLowerCase(),
  )
}

// Helper function to search products
export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.subcategory.toLowerCase().includes(lowercaseQuery),
  )
}

