import fs from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "data", "database.json")

export interface DatabaseSchema {
  admin: {
    username: string
    password: string
  }
  requests: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    instagram: string
    approved: boolean
    createdAt: string
    approvedAt?: string
  }>
  tokens: Array<{
    id: string
    token: string
    requestId: string
    used: boolean
    usedAt?: string
    createdAt: string
  }>
  sessions: Array<{
    token: string
    createdAt: string
  }>
}

// Ensure database file exists
function ensureDatabase(): void {
  const dataDir = path.dirname(DB_PATH)

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialData: DatabaseSchema = {
      admin: {
        username: "admin",
        password: "Privateparty2025!",
      },
      requests: [],
      tokens: [],
      sessions: [],
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2))
  }
}

export function readDatabase(): DatabaseSchema {
  ensureDatabase()
  const data = fs.readFileSync(DB_PATH, "utf8")
  return JSON.parse(data)
}

export function writeDatabase(data: DatabaseSchema): void {
  ensureDatabase()
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

// Helper functions
export function addRequest(request: Omit<DatabaseSchema["requests"][0], "id" | "createdAt" | "approved">) {
  const db = readDatabase()
  const newRequest = {
    ...request,
    id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    approved: false,
    createdAt: new Date().toISOString(),
  }
  db.requests.push(newRequest)
  writeDatabase(db)
  return newRequest
}

export function approveRequest(requestId: string) {
  const db = readDatabase()
  const requestIndex = db.requests.findIndex((r) => r.id === requestId)

  if (requestIndex === -1) return null

  // Update request
  db.requests[requestIndex].approved = true
  db.requests[requestIndex].approvedAt = new Date().toISOString()

  // Create token
  const token = {
    id: `token_${Date.now()}`,
    token: `qr_${db.requests[requestIndex].firstName.toLowerCase()}_${Math.random().toString(36).substr(2, 6)}`,
    requestId: requestId,
    used: false,
    createdAt: new Date().toISOString(),
  }
  db.tokens.push(token)

  writeDatabase(db)
  return { request: db.requests[requestIndex], token }
}

export function validateToken(tokenString: string) {
  const db = readDatabase()
  const tokenIndex = db.tokens.findIndex((t) => t.token === tokenString)

  if (tokenIndex === -1) return null

  const token = db.tokens[tokenIndex]
  if (token.used) return { status: "used", token, request: db.requests.find((r) => r.id === token.requestId) }

  const request = db.requests.find((r) => r.id === token.requestId)
  return { status: "valid", token, request }
}

// New function to actually use/consume the token
export function useToken(tokenString: string) {
  const db = readDatabase()
  const tokenIndex = db.tokens.findIndex((t) => t.token === tokenString)

  if (tokenIndex === -1) return null

  const token = db.tokens[tokenIndex]
  if (token.used) return { status: "used", token, request: db.requests.find((r) => r.id === token.requestId) }

  // Mark as used
  db.tokens[tokenIndex].used = true
  db.tokens[tokenIndex].usedAt = new Date().toISOString()
  writeDatabase(db)

  const request = db.requests.find((r) => r.id === token.requestId)
  return { status: "valid", token: db.tokens[tokenIndex], request }
}

export function createSession() {
  const db = readDatabase()
  const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`

  db.sessions.push({
    token: sessionToken,
    createdAt: new Date().toISOString(),
  })

  writeDatabase(db)
  return sessionToken
}

export function validateSession(sessionToken: string) {
  const db = readDatabase()
  return db.sessions.some((s) => s.token === sessionToken)
}

// Delete a request by ID
export function deleteRequest(requestId: string): boolean {
  const db = readDatabase()
  const index = db.requests.findIndex((r) => r.id === requestId)
  if (index === -1) return false
  db.requests.splice(index, 1)
  writeDatabase(db)
  return true
}

// Update a request by ID with provided fields
export function updateRequest(
  requestId: string,
  updates: Partial<Omit<DatabaseSchema['requests'][0], 'id' | 'createdAt' | 'approved' | 'approvedAt'>>
): DatabaseSchema['requests'][0] | null {
  const db = readDatabase()
  const index = db.requests.findIndex((r) => r.id === requestId)
  if (index === -1) return null
  const existing = db.requests[index]
  const updatedRequest = { ...existing, ...updates }
  db.requests[index] = updatedRequest
  writeDatabase(db)
  return updatedRequest
}
