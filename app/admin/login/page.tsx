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
    <div className="min-h-screen bg-gradient-light text-foreground flex items-center justify-center p-12 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-lines opacity-5" />

      <div className="max-w-sm w-full">
        <div className="text-center mb-12 relative">
          <div className="corner-decoration corner-decoration-tl" />
          <div className="w-20 h-20 bg-gradient-navy rounded-full mx-auto mb-6 flex items-center justify-center shadow-elegant animate-float">
            <span className="text-2xl">🔐</span>
          </div>
          <h1>Admin Login</h1>
          <div className="corner-decoration corner-decoration-br" />
        </div>

        {error && (
          <div className="mb-6 p-4 luxury-card bg-red-50/80 text-red-800 border-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="luxury-card hover-lift">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                required
                className="luxury-input w-full"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                required
                className="luxury-input w-full"
                placeholder="password"
              />
            </div>

            <div className="luxury-divider" />

            <button
              type="submit"
              disabled={isLoading}
              className="luxury-button w-full"
            >
              {isLoading ? "Accesso..." : "Accedi"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-navy/70">
            <p>Credenziali demo:</p>
            <p>
              <strong>Username:</strong> admin
            </p>
            <p>
              <strong>Password:</strong> password
            </p>
          </div>

          <div className="mt-4 text-center">
            <a
              href="/"
              className="text-navy hover:text-navy-light transition-colors duration-300 text-sm"
            >
              ← Torna alla richiesta accesso
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
