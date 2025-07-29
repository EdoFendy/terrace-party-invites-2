import { type NextRequest, NextResponse } from "next/server"
import { useToken } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const result = useToken(params.token)

    if (!result) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Token usage failed" }, { status: 500 })
  }
} 