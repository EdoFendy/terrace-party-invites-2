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
    <div className="min-h-screen bg-gradient-light text-foreground p-12 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-lines opacity-5" />

      <div className="max-w-md mx-auto pt-16">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="corner-decoration corner-decoration-tl" />
          <div className="w-24 h-24 bg-gradient-navy rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-elegant animate-float">
            <span className="text-xl uppercase tracking-widest font-thin">RSVP</span>
          </div>
          <h1 className="text-primary">After-Party Terrazza</h1>
          <p>Inizio ore 00:00 sul mare ✨</p>
          <div className="corner-decoration corner-decoration-br" />
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "luxury-card bg-green-50/80 text-green-800 border-green-200"
                : "luxury-card bg-red-50/80 text-red-800 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="luxury-card hover-lift">
          <h2>Richiedi Accesso</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Nome</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                required
                className="luxury-input w-full"
                placeholder="Il tuo nome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Cognome</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                required
                className="luxury-input w-full"
                placeholder="Il tuo cognome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="luxury-input w-full"
                placeholder="tua@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Instagram</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-navy/50">@</span>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
                  required
                  className="luxury-input w-full pl-8"
                  placeholder="tuousername"
                />
              </div>
            </div>

            <div className="luxury-divider" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="luxury-button w-full relative overflow-hidden"
            >
              {isSubmitting ? "Invio..." : "Invia Richiesta"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <a
              href="/admin/login"
              className="text-navy hover:text-navy-light transition-colors duration-300"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
