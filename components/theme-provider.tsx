'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      themes={["light", "dark", "system"]}
      enableSystem
      attribute="class"
      defaultTheme="system"
      value={{
        light: "light",
        dark: "dark",
        system: "system",
      }}
    >
      {children}
    </NextThemesProvider>
  )
}
