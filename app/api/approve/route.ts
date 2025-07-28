import { type NextRequest, NextResponse } from "next/server"
import { approveRequest, validateSession } from "@/lib/database"
import { EmailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const sessionToken = request.cookies.get("session")?.value
    if (!sessionToken || !validateSession(sessionToken)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { requestId } = body

    if (!requestId) {
      return NextResponse.json({ error: "Missing requestId" }, { status: 400 })
    }

    const result = approveRequest(requestId)
    if (!result) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Send invitation email
    const guestName = `${result.request.firstName} ${result.request.lastName}`
    const emailSent = await EmailService.sendInvitation(
      result.request.email,
      guestName,
      result.token.token
    )
    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send invitation email" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Request approved and invitation sent!",
      token: result.token.token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to approve request" }, { status: 500 })
  }
}
