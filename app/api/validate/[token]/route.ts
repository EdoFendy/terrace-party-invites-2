import { type NextRequest, NextResponse } from "next/server"
import { validateToken } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const result = validateToken(params.token)

    if (!result) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 })
  }
}
