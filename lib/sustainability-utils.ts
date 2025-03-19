import { SUSTAINABILITY_TRACKING_ABI, CONTRACT_ADDRESSES } from './contract-utils';

// Tipe data untuk informasi keberlanjutan
export interface SustainabilityData {
  co2Saved: number;         // dalam kg
  itemsRecycled: number;    // jumlah item
  treesEquivalent: number;  // jumlah pohon yang setara dengan pengurangan CO2
  sustainablePurchases: number; // jumlah pembelian berkelanjutan
}

// Konversi untuk menghitung dampak lingkungan
const IMPACT_CONVERSIONS = {
  CO2_PER_TREE_PER_YEAR: 25, // kg CO2 yang diserap oleh 1 pohon per tahun
  CO2_PER_RECYCLED_ITEM: 2.5, // kg CO2 yang dihemat per item yang didaur ulang
};

// Dapatkan skor keberlanjutan untuk produk
export const getProductSustainabilityScore = async (
  connex: any,
  productId: number
): Promise<number> => {
  try {
    if (!connex) return 0;
    
    // Dapatkan alamat kontrak sustainability
    const contractAddress = CONTRACT_ADDRESSES.sustainabilityContract;
    
    // Buat instance kontrak
    const contract = connex.thor.account(contractAddress);
    
    // Cari method getProductSustainabilityScore di ABI
    const scoreFunc = SUSTAINABILITY_TRACKING_ABI.functions.find(
      func => func.name === 'getProductSustainabilityScore'
    );
    if (!scoreFunc) throw new Error('getProductSustainabilityScore method not found in ABI');
    
    // Panggil method
    const method = contract.method(scoreFunc);
    const result = await method.call(productId);
    
    // Kembalikan skor
    return Number(result.decoded[0]);
  } catch (error) {
    console.error("Error mendapatkan skor keberlanjutan produk:", error);
    return 0; // Skor default jika error
  }
};

// Dapatkan skor keberlanjutan untuk pengguna
export const getUserSustainabilityScore = async (
  connex: any,
  userAddress: string
): Promise<number> => {
  try {
    if (!connex || !userAddress) return 0;
    
    // Dapatkan alamat kontrak sustainability
    const contractAddress = CONTRACT_ADDRESSES.sustainabilityContract;
    
    // Buat instance kontrak
    const contract = connex.thor.account(contractAddress);
    
    // Cari method getUserSustainabilityScore di ABI
    const scoreFunc = SUSTAINABILITY_TRACKING_ABI.functions.find(
      func => func.name === 'getUserSustainabilityScore'
    );
    if (!scoreFunc) throw new Error('getUserSustainabilityScore method not found in ABI');
    
    // Panggil method
    const method = contract.method(scoreFunc);
    const result = await method.call(userAddress);
    
    // Kembalikan skor
    return Number(result.decoded[0]);
  } catch (error) {
    console.error("Error mendapatkan skor keberlanjutan pengguna:", error);
    return 0; // Skor default jika error
  }
};

// Perbarui skor keberlanjutan untuk produk 
export const updateProductSustainabilityScore = async (
  connex: any,
  productId: number,
  score: number
): Promise<boolean> => {
  try {
    if (!connex) return false;
    
    // Dapatkan alamat kontrak
    const contractAddress = CONTRACT_ADDRESSES.sustainabilityContract;
    
    // Cari method setProductSustainabilityScore di ABI
    const scoreFunc = SUSTAINABILITY_TRACKING_ABI.functions.find(
      func => func.name === 'setProductSustainabilityScore'
    );
    if (!scoreFunc) throw new Error('setProductSustainabilityScore method not found in ABI');
    
    // Buat transaksi clause
    const clause = {
      to: contractAddress,
      value: '0',
      data: connex.thor.account(contractAddress)
        .method(scoreFunc)
        .asClause(productId, score)
        .data
    };
    
    // Tandatangani dan kirim transaksi
    const vendor = new (connex as any).Vendor('test');
    const txResponse = await vendor.sign('tx', [clause]);
    
    return !!txResponse.txid;
  } catch (error) {
    console.error("Error memperbarui skor keberlanjutan produk:", error);
    return false;
  }
};

// Hitung data keberlanjutan berdasarkan pembelian
export const calculateSustainabilityImpact = (purchaseCount: number): SustainabilityData => {
  // Asumsi rata-rata untuk setiap pembelian
  const avgCO2PerPurchase = 5; // kg
  const avgRecycledItemsPerPurchase = 1.5; // items
  
  const co2Saved = purchaseCount * avgCO2PerPurchase;
  const itemsRecycled = Math.floor(purchaseCount * avgRecycledItemsPerPurchase);
  const treesEquivalent = Math.ceil(co2Saved / IMPACT_CONVERSIONS.CO2_PER_TREE_PER_YEAR);
  
  return {
    co2Saved,
    itemsRecycled,
    treesEquivalent,
    sustainablePurchases: purchaseCount
  };
};

// Ambil total dampak keberlanjutan dari blockchain
export const fetchSustainabilityData = async (connex: any): Promise<SustainabilityData> => {
  try {
    // Mock data untuk saat ini, idealnya data diambil dari blockchain
    // Perhitungan data ini nantinya akan dihitung melalui agregasi data dari blockchain
    const totalPurchases = 3456;
    return calculateSustainabilityImpact(totalPurchases);
  } catch (error) {
    console.error("Error mengambil data keberlanjutan:", error);
    return {
      co2Saved: 1234.5,
      itemsRecycled: 5678,
      treesEquivalent: 89,
      sustainablePurchases: 3456
    };
  }
}; 