import type { AccessRequest, QRToken, AdminUser } from "./types"

// Mock data storage using localStorage
const STORAGE_KEYS = {
  REQUESTS: "terrace_party_requests",
  TOKENS: "terrace_party_tokens",
  ADMIN: "terrace_party_admin",
  SESSION: "terrace_party_session",
}

// Initialize default admin user
const DEFAULT_ADMIN: AdminUser = {
  username: "admin",
  password: "password",
}

export class Storage {
  static getRequests(): AccessRequest[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.REQUESTS)
    return data ? JSON.parse(data) : []
  }

  static saveRequests(requests: AccessRequest[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests))
  }

  static getTokens(): QRToken[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.TOKENS)
    return data ? JSON.parse(data) : []
  }

  static saveTokens(tokens: QRToken[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens))
  }

  static getAdmin(): AdminUser {
    if (typeof window === "undefined") return DEFAULT_ADMIN
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN)
    return data ? JSON.parse(data) : DEFAULT_ADMIN
  }

  static getSession(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(STORAGE_KEYS.SESSION)
  }

  static setSession(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.SESSION, token)
  }

  static clearSession(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEYS.SESSION)
  }

  static addRequest(request: Omit<AccessRequest, "id" | "createdAt" | "approved">): AccessRequest {
    const requests = this.getRequests()
    const newRequest: AccessRequest = {
      ...request,
      id: Date.now().toString(),
      approved: false,
      createdAt: new Date().toISOString(),
    }
    requests.push(newRequest)
    this.saveRequests(requests)
    return newRequest
  }

  static approveRequest(requestId: string): { request: AccessRequest; token: QRToken } | null {
    const requests = this.getRequests()
    const tokens = this.getTokens()

    const requestIndex = requests.findIndex((r) => r.id === requestId)
    if (requestIndex === -1) return null

    // Update request
    requests[requestIndex].approved = true
    requests[requestIndex].approvedAt = new Date().toISOString()
    this.saveRequests(requests)

    // Create QR token
    const token: QRToken = {
      id: Date.now().toString(),
      token: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId: requestId,
      used: false,
      createdAt: new Date().toISOString(),
    }
    tokens.push(token)
    this.saveTokens(tokens)

    return { request: requests[requestIndex], token }
  }

  static useToken(tokenString: string): { token: QRToken; request: AccessRequest } | null {
    const tokens = this.getTokens()
    const requests = this.getRequests()

    const tokenIndex = tokens.findIndex((t) => t.token === tokenString)
    if (tokenIndex === -1) return null

    const token = tokens[tokenIndex]
    if (token.used) return null

    // Mark as used
    tokens[tokenIndex].used = true
    tokens[tokenIndex].usedAt = new Date().toISOString()
    this.saveTokens(tokens)

    const request = requests.find((r) => r.id === token.requestId)
    if (!request) return null

    return { token: tokens[tokenIndex], request }
  }

  static getTokenByString(tokenString: string): QRToken | null {
    const tokens = this.getTokens()
    return tokens.find((t) => t.token === tokenString) || null
  }
}
