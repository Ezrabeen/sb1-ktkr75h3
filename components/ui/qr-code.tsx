"use client"

import { useEffect, useRef } from "react"
import QRCodeLib from "qrcode"

interface QRCodeProps {
  value: string
  size?: number
  bgColor?: string
  fgColor?: string
  level?: "L" | "M" | "Q" | "H"
  includeMargin?: boolean
  className?: string
}

export function QRCode({
  value,
  size = 200,
  bgColor = "#ffffff",
  fgColor = "#000000",
  level = "L",
  includeMargin = false,
  className,
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Ensure value is not empty
    const qrValue = value || "https://revive.example.com"

    QRCodeLib.toCanvas(
      canvasRef.current,
      qrValue,
      {
        width: size,
        margin: includeMargin ? 4 : 0,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: level,
      },
      (error) => {
        if (error) console.error("Error generating QR code:", error)
      },
    )
  }, [value, size, bgColor, fgColor, level, includeMargin])

  return <canvas ref={canvasRef} className={className} />
}

