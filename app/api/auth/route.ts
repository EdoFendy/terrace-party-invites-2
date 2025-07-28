import { type NextRequest, NextResponse } from "next/server"
import { readDatabase, createSession } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    const db = readDatabase()

    if (username === db.admin.username && password === db.admin.password) {
      const sessionToken = createSession()

      const response = NextResponse.json({ success: true })
      response.cookies.set("session", sessionToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60, // 24 hours
        sameSite: "lax",
      })

      return response
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("session")
  return response
}
