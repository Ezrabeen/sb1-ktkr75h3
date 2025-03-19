"use client"

import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

// Render placeholder di server dan saat client belum siap
function LanguageSwitcherPlaceholder() {
  return (
    <Button variant="ghost" size="icon" aria-label="Switch Language">
      <Globe className="h-5 w-5" />
    </Button>
  )
}

// Buat komponen klien-side yang diimpor secara dinamis 
const ClientLanguageSwitcher = dynamic(
  () => import('./language-switcher-client').then(mod => mod.ClientLanguageSwitcher),
  { 
    ssr: false,
    loading: () => <LanguageSwitcherPlaceholder />
  }
)

// Ekspor komponen language switcher yang aman untuk hidration
export function LanguageSwitcher() {
  return <ClientLanguageSwitcher />
} 