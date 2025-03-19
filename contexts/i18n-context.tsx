"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getLocale, setLocale, t as translate, type Locale } from '@/lib/utils'

type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, defaultValue?: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setActiveLocale] = useState<Locale>('en')
  const [isClient, setIsClient] = useState(false)

  // First, check if we're in the client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Then run the locale initialization logic only on the client side
  useEffect(() => {
    if (!isClient) return;
    
    try {
      // Initialize locale from localStorage or browser preference
      const savedLocale = localStorage.getItem('locale') as Locale
      const browserLocale = navigator.language.split('-')[0]
      
      // Default to 'en' if not supported
      const supportedLocales = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES?.split(',') || ['en', 'id']
      
      if (savedLocale && supportedLocales.includes(savedLocale)) {
        setActiveLocale(savedLocale)
        setLocale(savedLocale)
      } else if (browserLocale && supportedLocales.includes(browserLocale as Locale)) {
        setActiveLocale(browserLocale as Locale)
        setLocale(browserLocale as Locale)
      } else {
        setActiveLocale('en')
        setLocale('en')
      }
    } catch (error) {
      console.error('Error initializing locale:', error)
      // Fallback to default locale
      setActiveLocale('en')
      setLocale('en')
    }
  }, [isClient])

  // Update locale and save to localStorage
  const changeLocale = (newLocale: Locale) => {
    setActiveLocale(newLocale)
    setLocale(newLocale)
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('locale', newLocale)
      } catch (error) {
        console.error('Error saving locale to localStorage:', error)
      }
    }
  }

  // Translation function
  const t = (key: string, defaultValue?: string) => {
    return translate(key, defaultValue)
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
} 