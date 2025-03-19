import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEther(wei: string): string {
  // Convert wei to VET (1 VET = 10^18 wei)
  const vet = Number(wei) / Math.pow(10, 18)
  return vet.toFixed(4)
}

// Language localization support
export type Locale = 'en' | 'id';

interface Translations {
  [key: string]: {
    [lang in Locale]: string;
  };
}

// Sample translations dictionary - this would be expanded
const translations: Translations = {
  'connect_wallet': {
    'en': 'Connect Wallet',
    'id': 'Hubungkan Dompet'
  },
  'disconnect': {
    'en': 'Disconnect',
    'id': 'Putuskan'
  },
  'connecting': {
    'en': 'Connecting...',
    'id': 'Menghubungkan...'
  },
  'wallet': {
    'en': 'Wallet',
    'id': 'Dompet'
  },
  'login_success': {
    'en': 'Login successful',
    'id': 'Login berhasil'
  },
  'login_failed': {
    'en': 'Login failed',
    'id': 'Login gagal'
  },
  'wallet_connection_failed': {
    'en': 'Wallet connection failed',
    'id': 'Koneksi dompet gagal'
  }
};

// Default locale
let currentLocale: Locale = 'en';

// Set the application locale
export function setLocale(locale: Locale) {
  currentLocale = locale;
}

// Get the current locale
export function getLocale(): Locale {
  return currentLocale;
}

// Translate a key to the current locale
export function t(key: string, defaultValue?: string): string {
  if (translations[key] && translations[key][currentLocale]) {
    return translations[key][currentLocale];
  }
  return defaultValue || key;
}

// Format a wallet address to display format
export function formatWalletAddress(address?: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
