"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface ValidationResult {
  status: "valid" | "used"
  token: {
    token: string
    used: boolean
    usedAt?: string
  }
  request: {
    firstName: string
    lastName: string
    instagram: string
  }
}

export default function QRValidationPage() {
  const params = useParams()
  const token = params.token as string
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [status, setStatus] = useState<"loading" | "valid" | "used" | "invalid">("loading")

  useEffect(() => {
    if (!token) {
      setStatus("invalid")
      return
    }

    validateToken()
  }, [token])

  const validateToken = async () => {
    try {
      const response = await fetch(`/api/validate/${token}`)

      if (response.ok) {
        const data = await response.json()
        setResult(data)
        setStatus(data.status)
      } else {
        setStatus("invalid")
      }
    } catch (error) {
      setStatus("invalid")
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-light text-foreground flex items-center justify-center relative">
        <div className="absolute inset-0 bg-pattern-lines opacity-5" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy mx-auto mb-6"></div>
          <p>Validazione QR code...</p>
        </div>
      </div>
    )
  }

  if (status === "valid" && result) {
    return (
      <div className="min-h-screen bg-gradient-light text-foreground p-12 relative">
        <div className="absolute inset-0 bg-pattern-lines opacity-5" />
        <div className="max-w-md mx-auto pt-16 text-center">
          {/* Success */}
          <div className="mb-12 relative">
            <div className="corner-decoration corner-decoration-tl" />
            <div className="w-32 h-32 bg-gradient-navy rounded-full mx-auto mb-8 flex items-center justify-center animate-float shadow-elegant">
              <span className="text-4xl">🌊</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-primary">
                Benvenuto, {result.request.firstName} {result.request.lastName}! ✨
              </h1>
              <p>Sei pronto per la festa in terrazza!</p>
            </div>
            <div className="corner-decoration corner-decoration-br" />
          </div>

          {/* Party Details */}
          <div className="luxury-card hover-lift mb-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">🕛</span>
                <div>
                  <p className="font-semibold text-navy">Inizio festa</p>
                  <p>Mezzanotte (00:00)</p>
                </div>
              </div>

              <div className="luxury-divider my-6" />

              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-semibold text-navy">Location</p>
                  <p>Terrazza sul Mare</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="luxury-card bg-navy/5 hover-lift mb-8">
            <p>Seguici per aggiornamenti:</p>
            <p className="text-accent">@{result.request.instagram}</p>
          </div>

          {/* Important Note */}
          <div className="luxury-card bg-yellow-50/80 border-yellow-200">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div className="text-left">
                <p className="font-medium text-yellow-800 mb-2">Importante:</p>
                <p className="text-sm text-yellow-700">
                  Questo QR code è ora utilizzato e non può essere scansionato di nuovo. Salva questa pagina o fai uno
                  screenshot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Invalid or used token
  const message = status === "used" ? "QR code già utilizzato" : "QR code non valido"

  return (
    <div className="min-h-screen bg-gradient-light text-foreground p-12 relative">
      <div className="absolute inset-0 bg-pattern-lines opacity-5" />
      <div className="max-w-md mx-auto pt-16 text-center">
        {/* Error Icon */}
        <div className="mb-12 relative">
          <div className="corner-decoration corner-decoration-tl" />
          <div className="w-32 h-32 bg-red-100 rounded-full mx-auto mb-8 flex items-center justify-center animate-float shadow-elegant">
            <span className="text-4xl">❌</span>
          </div>
          <div className="space-y-2">
            <h1>Ops!</h1>
            <p>{message}</p>
          </div>
          <div className="corner-decoration corner-decoration-br" />
        </div>

        {/* Error Details */}
        <div className="luxury-card hover-lift mb-8">
          <div className="text-left">
            <h3 className="mb-4">Possibili motivi:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• QR code già utilizzato</li>
              <li>• QR code non valido o scaduto</li>
              <li>• Link condiviso in modo errato</li>
            </ul>
          </div>
        </div>

        {/* Show used info if available */}
        {status === "used" && result && (
          <div className="luxury-card bg-navy/5 hover-lift mb-8">
            <div className="text-left">
              <p className="font-medium text-navy mb-2">Questo QR code è stato usato da:</p>
              <p className="text-sm text-gray-600">
                {result.request.firstName} {result.request.lastName}
              </p>
              <p className="text-sm text-gray-600">
                Usato il: {result.token.usedAt ? new Date(result.token.usedAt).toLocaleString("it-IT") : "Sconosciuto"}
              </p>
            </div>
          </div>
        )}

        {/* Help */}
        <div className="luxury-card bg-navy/5 hover-lift mb-8">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 text-xl">💡</span>
            <div className="text-left">
              <p className="font-medium text-navy mb-2">Serve aiuto?</p>
              <p className="text-sm text-blue-700">
                Contatta gli organizzatori o controlla la tua email di invito per il QR code corretto.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href="/"
            className="luxury-button block w-full"
          >
            Richiedi Nuovo Accesso
          </a>

          <button
            onClick={() => window.history.back()}
            className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
          >
            Indietro
          </button>
        </div>
      </div>
    </div>
  )
}
