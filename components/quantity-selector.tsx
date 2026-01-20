"use client"

import type React from "react"

import { Minus, Plus } from "lucide-react"
import type { RefObject } from "react"

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  inputRef?: RefObject<HTMLInputElement | null>
}

export function QuantitySelector({ value, onChange, min = 0, max = 99, inputRef }: QuantitySelectorProps) {
  const decrease = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (value > min) {
      onChange(value - 1)
    }
  }

  const increase = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (value < max) {
      onChange(value + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value, 10)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue)
    } else if (e.target.value === "") {
      onChange(0)
    }
  }

  return (
    <div className="flex items-center gap-1" data-quantity-control>
      <button
        onClick={decrease}
        disabled={value <= min}
        className="flex items-center justify-center text-white hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
        style={{ width: 32, height: 32, backgroundColor: "#555555" }}
        aria-label="Disminuir cantidad"
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleInputChange}
        onClick={(e) => e.stopPropagation()}
        className="text-center text-sm font-medium tabular-nums bg-transparent border-none outline-none text-white"
        style={{ width: 32, height: 32, backgroundColor: "#555555", borderRadius: 6 }}
      />
      <button
        onClick={increase}
        disabled={value >= max}
        className="flex items-center justify-center text-white hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
        style={{ width: 32, height: 32, backgroundColor: "#555555" }}
        aria-label="Aumentar cantidad"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
