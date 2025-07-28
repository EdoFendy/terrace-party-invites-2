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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Caricamento...</p>
        </div>
      </div>
    )
  }

  const totalRequests = requests.length
  const approvedRequests = requests.filter((r) => r.approved).length
  const pendingRequests = requests.filter((r) => !r.approved).length

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1>Admin Panel</h1>
            <p>Gestione inviti terrazza</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totale Richieste</p>
                <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approvate</p>
                <p className="text-2xl font-bold text-gray-900">{approvedRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Attesa</p>
                <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Richieste di Accesso</h2>
          </div>

          {requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instagram</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {request.firstName} {request.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">@{request.instagram}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.approved ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Approvata ✅
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            In Attesa ⏳
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString("it-IT")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!request.approved ? (
                          <button
                            onClick={() => handleApprove(request.id)}
                            disabled={approvingId === request.id}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                          >
                            {approvingId === request.id ? "Approvando..." : "Approva 🚀"}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">Approvata</span>
                        )}
                        <button
                          onClick={() => handleEdit(request)}
                          disabled={editingId === request.id}
                          className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 disabled:opacity-50"
                        >
                          {editingId === request.id ? "Modificando..." : "Modifica ✏️"}
                        </button>
                        <button
                          onClick={() => handleDelete(request.id)}
                          disabled={deletingId === request.id}
                          className="ml-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
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
            <div className="px-6 py-12 text-center">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-gray-500">Nessuna richiesta ancora.</p>
              <a href="/" className="text-blue-500 hover:text-blue-600 mt-2 inline-block">
                Vai alla pagina richieste
              </a>
            </div>
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
