"use client"

import { useEffect, useRef } from "react"

interface QRCodeProps {
  value: string
  size?: number
}

export function QRCode({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Simple QR code simulation using canvas
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, size, size)

    // Draw a simple pattern to simulate QR code
    ctx.fillStyle = "black"
    const cellSize = size / 25

    // Create a pseudo-random pattern based on the value
    const seed = value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    let random = seed

    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        random = (random * 9301 + 49297) % 233280
        if (random / 233280 > 0.5) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
        }
      }
    }

    // Add corner squares (typical QR code feature)
    const cornerSize = cellSize * 7

    // Top-left corner
    ctx.fillRect(0, 0, cornerSize, cornerSize)
    ctx.fillStyle = "white"
    ctx.fillRect(cellSize, cellSize, cornerSize - 2 * cellSize, cornerSize - 2 * cellSize)
    ctx.fillStyle = "black"
    ctx.fillRect(cellSize * 2, cellSize * 2, cornerSize - 4 * cellSize, cornerSize - 4 * cellSize)

    // Top-right corner
    ctx.fillStyle = "black"
    ctx.fillRect(size - cornerSize, 0, cornerSize, cornerSize)
    ctx.fillStyle = "white"
    ctx.fillRect(size - cornerSize + cellSize, cellSize, cornerSize - 2 * cellSize, cornerSize - 2 * cellSize)
    ctx.fillStyle = "black"
    ctx.fillRect(size - cornerSize + cellSize * 2, cellSize * 2, cornerSize - 4 * cellSize, cornerSize - 4 * cellSize)

    // Bottom-left corner
    ctx.fillStyle = "black"
    ctx.fillRect(0, size - cornerSize, cornerSize, cornerSize)
    ctx.fillStyle = "white"
    ctx.fillRect(cellSize, size - cornerSize + cellSize, cornerSize - 2 * cellSize, cornerSize - 2 * cellSize)
    ctx.fillStyle = "black"
    ctx.fillRect(cellSize * 2, size - cornerSize + cellSize * 2, cornerSize - 4 * cellSize, cornerSize - 4 * cellSize)
  }, [value, size])

  return (
    <div className="flex flex-col items-center space-y-2">
      <canvas ref={canvasRef} className="border border-gray-300 rounded-lg" style={{ width: size, height: size }} />
      <p className="text-xs text-gray-500 font-mono break-all max-w-[200px]">{value}</p>
    </div>
  )
}
