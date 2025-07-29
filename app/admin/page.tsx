"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Request {
  id: string
  firstName: string
  lastName: string
  email: string
  instagram: string
  approved: boolean
  createdAt: string
  approvedAt?: string
}

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const response = await fetch("/api/requests")
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests)
      } else if (response.status === 401) {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Failed to load requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (requestId: string) => {
    setApprovingId(requestId)

    try {
      const response = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ Invito inviato! QR Token: ${data.token}`)
        loadRequests() // Refresh
      } else if (response.status === 401) {
        router.push("/admin/login")
      } else {
        alert("❌ Errore nell'approvazione")
      }
    } catch (error) {
      alert("❌ Errore di connessione")
    } finally {
      setApprovingId(null)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" })
    router.push("/admin/login")
  }

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa richiesta?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/requests/${id}`, { method: "DELETE" })
      if (res.ok) {
        alert("✅ Richiesta eliminata")
        loadRequests()
      } else {
        alert("❌ Errore nell'eliminazione")
      }
    } catch (error) {
      alert("❌ Errore di connessione")
    } finally {
      setDeletingId(null)
    }
  }

  // Edit handler
  const handleEdit = async (req: Request) => {
    const newFirstName = prompt("Nome", req.firstName)
    const newLastName = prompt("Cognome", req.lastName)
    const newEmail = prompt("Email", req.email)
    const newInstagram = prompt("Instagram", req.instagram)
    const updates: any = {}
    if (newFirstName && newFirstName !== req.firstName) updates.firstName = newFirstName
    if (newLastName && newLastName !== req.lastName) updates.lastName = newLastName
    if (newEmail && newEmail !== req.email) updates.email = newEmail
    if (newInstagram && newInstagram !== req.instagram) updates.instagram = newInstagram
    if (Object.keys(updates).length === 0) return
    setEditingId(req.id)
    try {
      const res = await fetch(`/api/requests/${req.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        alert("✅ Richiesta aggiornata")
        loadRequests()
      } else {
        alert("❌ Errore nell'aggiornamento")
      }
    } catch (error) {
      alert("❌ Errore di connessione")
    } finally {
      setEditingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-light text-foreground flex items-center justify-center relative">
        <div className="absolute inset-0 bg-pattern-lines opacity-5" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy mx-auto mb-6"></div>
          <p>Caricamento...</p>
        </div>
      </div>
    )
  }

  const totalRequests = requests.length
  const approvedRequests = requests.filter((r) => r.approved).length
  const pendingRequests = requests.filter((r) => !r.approved).length

  return (
    <div className="min-h-screen bg-gradient-light text-foreground p-12 relative">
      <div className="absolute inset-0 bg-pattern-lines opacity-5" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="corner-decoration corner-decoration-tl" />
          <div>
            <h1>Admin Panel</h1>
            <p>Gestione inviti terrazza</p>
          </div>
          <button
            onClick={handleLogout}
            className="luxury-button bg-gradient-to-r from-red-500 to-red-600 relative z-30 cursor-pointer"
          >
            Logout
          </button>
          <div className="corner-decoration corner-decoration-br" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="luxury-card hover-lift">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-navy rounded-lg text-white shadow-elegant">
                <span className="text-sm uppercase tracking-widest font-thin">Total</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-navy/70">Totale Richieste</p>
                <p className="text-3xl font-bold text-navy">{totalRequests}</p>
              </div>
            </div>
          </div>

          <div className="luxury-card hover-lift">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-navy rounded-lg text-white shadow-elegant">
                <span className="text-sm uppercase tracking-widest font-thin">Done</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-navy/70">Approvate</p>
                <p className="text-3xl font-bold text-navy">{approvedRequests}</p>
              </div>
            </div>
          </div>

          <div className="luxury-card hover-lift">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-navy rounded-lg text-white shadow-elegant">
                <span className="text-sm uppercase tracking-widest font-thin">Pending</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-navy/70">In Attesa</p>
                <p className="text-3xl font-bold text-navy">{pendingRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="luxury-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2>Richieste di Accesso</h2>
          </div>

          {requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-navy/10">
                <thead className="bg-navy/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy/70 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy/70 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy/70 uppercase tracking-wider">Instagram</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy/70 uppercase tracking-wider">Stato</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy/70 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy/70 uppercase tracking-wider">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/10">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-navy/5 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-navy">
                          {request.firstName} {request.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-navy">{request.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-navy">@{request.instagram}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.approved ? (
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 shadow-sm">
                            Approvata
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 shadow-sm">
                            In Attesa
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-navy/70">
                        {new Date(request.createdAt).toLocaleDateString("it-IT")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!request.approved ? (
                          <button
                            onClick={() => handleApprove(request.id)}
                            disabled={approvingId === request.id}
                            className="luxury-button bg-gradient-to-r from-green-500 to-green-600 text-sm relative z-30 cursor-pointer"
                          >
                            {approvingId === request.id ? "Approvando..." : "Approva"}
                          </button>
                        ) : (
                          <span className="text-navy/40 text-sm">Approvata</span>
                        )}
                        <button
                          onClick={() => handleEdit(request)}
                          disabled={editingId === request.id}
                          className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 disabled:opacity-50 relative z-30 cursor-pointer"
                        >
                          {editingId === request.id ? "Modificando..." : "Modifica ✏️"}
                        </button>
                        <button
                          onClick={() => handleDelete(request.id)}
                          disabled={deletingId === request.id}
                          className="ml-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50 relative z-30 cursor-pointer"
                        >
                          {deletingId === request.id ? "Eliminando..." : "Elimina 🗑️"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-navy/50">Nessuna richiesta trovata</div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 text-xl">💡</span>
            <div>
              <p className="font-medium text-blue-800">Database JSON</p>
              <p className="text-sm text-blue-700">
                Tutti i dati sono salvati in <code>data/database.json</code>. Controlla la console per vedere i dettagli
                degli inviti inviati.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
