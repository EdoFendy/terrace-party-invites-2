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
        setMessage({ 
          text: "Richiesta inviata con successo! Se approvata, riceverai una email con il QR code. Controlla anche la cartella SPAM/Posta indesiderata.", 
          type: "success" 
        })
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
          <p>Terrazze sul mare - Marinella di Selinunte</p>
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
              className="luxury-button w-full relative overflow-hidden z-30 cursor-pointer"
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

          {/* Spam Warning */}
          <div className="mt-6 p-4 bg-yellow-50/80 border border-yellow-200 rounded-sm">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Importante</p>
                <p className="text-yellow-700">
                  Se la tua richiesta viene approvata, <strong>controlla anche la cartella SPAM</strong> della tua email. 
                  Le email automatiche a volte finiscono lì per errore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
