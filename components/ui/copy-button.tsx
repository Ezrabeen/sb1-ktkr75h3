"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  onCopy?: () => void
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ className, value, onCopy, ...props }, ref) => {
    const [isCopied, setIsCopied] = React.useState(false)

    const handleCopy = () => {
      navigator.clipboard.writeText(value)
      setIsCopied(true)
      onCopy?.()
      setTimeout(() => setIsCopied(false), 2000)
    }

    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(className)}
        onClick={handleCopy}
        disabled={isCopied}
        ref={ref}
        {...props}
      >
        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="sr-only">{isCopied ? "Copied" : "Copy"}</span>
      </Button>
    )
  },
)

CopyButton.displayName = "CopyButton"

