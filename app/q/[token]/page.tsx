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
  const [status, setStatus] = useState<"loading" | "valid" | "used" | "invalid" | "confirmed">("loading")
  const [isConfirming, setIsConfirming] = useState(false)

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

  const confirmEntry = async () => {
    setIsConfirming(true)
    try {
      const response = await fetch(`/api/use-token/${token}`, { method: 'POST' })
      
      if (response.ok) {
        const data = await response.json()
        setResult(data)
        setStatus("confirmed")
      } else {
        setStatus("invalid")
      }
    } catch (error) {
      setStatus("invalid")
    } finally {
      setIsConfirming(false)
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

  if ((status === "valid" || status === "confirmed") && result) {
    return (
      <div className="min-h-screen bg-gradient-light text-foreground p-12 relative">
        <div className="absolute inset-0 bg-pattern-lines opacity-5" />
        <div className="max-w-md mx-auto pt-16 text-center">
          {/* Success */}
          <div className="mb-12 relative">
            <div className="corner-decoration corner-decoration-tl" />
            <div className="w-32 h-32 bg-gradient-navy rounded-full mx-auto mb-8 flex items-center justify-center animate-float shadow-elegant">
              <span className="text-2xl uppercase tracking-widest font-thin text-white">PARTY</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-primary">
                Benvenuto, {result.request.firstName} {result.request.lastName}!
              </h1>
              <p>{status === "confirmed" ? "Il tuo accesso è confermato per l'after party!" : "QR code valido - Conferma il tuo ingresso"}</p>
            </div>
            <div className="corner-decoration corner-decoration-br" />
          </div>

          {/* Party Details */}
          <div className="luxury-card hover-lift mb-8">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-navy mb-4">Location</h3>
                <div className="space-y-2">
                  <p className="font-semibold">Via Marco Polo 49</p>
                  <p>Marinella di Selinunte</p>
                  <p className="text-navy/70">Nel cuore del Calannino</p>
                </div>
              </div>

              <div className="luxury-divider my-6" />

              <div className="text-center space-y-3">
                <p className="font-light italic text-navy/80">Terrazze sul mare con vista mozzafiato</p>
                <p className="font-light italic text-navy/80">L'arte sarà l'anima della festa</p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="luxury-card bg-navy/5 hover-lift mb-8">
            <div className="text-center">
              <p className="mb-2">Il tuo profilo:</p>
              <p className="text-accent font-medium">@{result.request.instagram}</p>
            </div>
          </div>

          {/* Confirmation Button or Success Message */}
          {status === "valid" ? (
            <div className="luxury-card bg-green-50/80 border-green-200 mb-8">
              <div className="text-center">
                <p className="font-medium text-green-800 mb-4">✅ QR Code Valido</p>
                <p className="text-sm text-green-700 mb-6">
                  Clicca il pulsante qui sotto per confermare il tuo ingresso al party. 
                  Dopo la conferma, questo QR code non sarà più utilizzabile.
                </p>
                <button
                  onClick={confirmEntry}
                  disabled={isConfirming}
                  className="luxury-button bg-gradient-to-r from-green-500 to-green-600 relative z-30 cursor-pointer"
                >
                  {isConfirming ? "Confermando..." : "Conferma Ingresso"}
                </button>
              </div>
            </div>
          ) : (
            /* Used Message */
            <div className="luxury-card bg-yellow-50/80 border-yellow-200">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600 text-xl min-w-fit">⚠️</span>
                <div className="text-left">
                  <p className="font-medium text-yellow-800 mb-3">QR Code Utilizzato</p>
                  <p className="text-sm text-yellow-700 leading-relaxed">
                    Questo QR code è stato scansionato con successo all'ingresso del party e ora risulta non valido. 
                    Ogni QR code è univoco e nominativo, utilizzabile una sola volta per garantire la sicurezza dell'evento.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Footer Message */}
          <div className="mt-8 text-center">
            <p className="text-navy/60 text-sm leading-relaxed">
              {status === "confirmed" ? "Buona permanenza all'after party!" : "Ci vediamo al party!"}<br />
              <em>Team Organizzativo</em>
            </p>
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
            <span className="text-2xl uppercase tracking-widest font-thin text-red-600">ERROR</span>
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
            <ul className="text-sm text-navy/70 space-y-2">
              <li>• QR code già utilizzato all'ingresso</li>
              <li>• QR code non valido o danneggiato</li>
              <li>• Link non corretto o modificato</li>
              <li>• QR code non associato a questo evento</li>
            </ul>
          </div>
        </div>

        {/* Show used info if available */}
        {status === "used" && result && (
          <div className="luxury-card bg-navy/5 hover-lift mb-8">
            <div className="text-left">
              <p className="font-medium text-navy mb-3">Dettagli utilizzo QR code:</p>
              <div className="space-y-1 text-sm text-navy/70">
                <p><strong>Utilizzato da:</strong> {result.request.firstName} {result.request.lastName}</p>
                <p><strong>Instagram:</strong> @{result.request.instagram}</p>
                <p><strong>Data utilizzo:</strong> {result.token.usedAt ? new Date(result.token.usedAt).toLocaleString("it-IT") : "Sconosciuto"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Help */}
        <div className="luxury-card bg-navy/5 hover-lift mb-8">
          <div className="flex items-start space-x-2">
            <span className="text-navy text-xl min-w-fit">💡</span>
            <div className="text-left">
              <p className="font-medium text-navy mb-2">Serve aiuto?</p>
              <p className="text-sm text-navy/70 leading-relaxed">
                Se ritieni che ci sia un errore, contatta gli organizzatori mostrando questa schermata. 
                Ricorda che ogni QR code è univoco e può essere utilizzato una sola volta per l'accesso.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href="/"
            className="luxury-button block w-full relative z-30 cursor-pointer"
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
