"use client"

import type React from "react"

import { useState } from "react"

export default function HomePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    instagram: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ firstName: "", lastName: "", email: "", instagram: "" })
        setMessage({ text: "Richiesta inviata! Riceverai una email se approvata.", type: "success" })
      } else {
        setMessage({ text: "Errore nell'invio della richiesta.", type: "error" })
      }
    } catch (error) {
      setMessage({ text: "Errore di connessione.", type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-md mx-auto pt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center text-white">
            <span className="text-3xl">🌊</span>
          </div>
          <h1 className="text-primary">After-Party Terrazza</h1>
          <p>Inizio ore 00:00 sul mare ✨</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Richiedi Accesso</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Il tuo nome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Il tuo cognome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tua@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">@</span>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
                  required
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tuousername"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-white py-2 px-4 rounded-md hover:opacity-90 disabled:opacity-50 transition duration-200"
            >
              {isSubmitting ? "Invio..." : "Invia Richiesta 🚀"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <a href="/admin/login" className="text-blue-500 hover:text-blue-600">
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
