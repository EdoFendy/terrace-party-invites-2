import { type NextRequest, NextResponse } from "next/server"
import { readDatabase, addRequest } from "@/lib/database"

export async function GET() {
  try {
    const db = readDatabase()
    return NextResponse.json({ requests: db.requests })
  } catch (error) {
    return NextResponse.json({ error: "Failed to read requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, instagram } = body

    if (!firstName || !lastName || !email || !instagram) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newRequest = addRequest({ firstName, lastName, email, instagram })
    return NextResponse.json({ request: newRequest })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}
