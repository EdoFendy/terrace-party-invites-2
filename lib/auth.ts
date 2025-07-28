import { Storage } from "./storage"

export function authenticateAdmin(username: string, password: string): boolean {
  const admin = Storage.getAdmin()
  return admin.username === username && admin.password === password
}

export function createSession(): string {
  const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  Storage.setSession(sessionToken)
  return sessionToken
}

export function isAuthenticated(): boolean {
  const session = Storage.getSession()
  return !!session
}

export function logout(): void {
  Storage.clearSession()
}
