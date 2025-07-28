"use client"

import { useState, useEffect } from "react"

interface ToastProps {
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type]

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right`}
    >
      <div className="flex items-center space-x-2">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
          ×
        </button>
      </div>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  const ToastComponent = toast ? <Toast message={toast.message} type={toast.type} onClose={hideToast} /> : null

  return { showToast, ToastComponent }
}
