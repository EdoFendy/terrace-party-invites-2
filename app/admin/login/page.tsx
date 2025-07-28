"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        router.push("/admin")
      } else {
        setError("Credenziali non valide")
      }
    } catch (error) {
      setError("Errore di connessione")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🔐</span>
          </div>
          <h1>Admin Login</h1>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 disabled:opacity-50"
            >
              {isLoading ? "Accesso..." : "Accedi"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Credenziali demo:</p>
            <p>
              <strong>Username:</strong> admin
            </p>
            <p>
              <strong>Password:</strong> password
            </p>
          </div>

          <div className="mt-4 text-center">
            <a href="/" className="text-blue-500 hover:text-blue-600 text-sm">
              ← Torna alla richiesta accesso
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
