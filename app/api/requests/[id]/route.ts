import { type NextRequest, NextResponse } from "next/server"
import { deleteRequest, updateRequest } from "@/lib/database"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const success = deleteRequest(id)
  if (!success) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 })
  }
  return NextResponse.json({ message: "Request deleted" })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await request.json()
  const { firstName, lastName, email, instagram } = body
  const updates: Partial<{
    firstName: string
    lastName: string
    email: string
    instagram: string
  }> = {}

  if (firstName !== undefined) updates.firstName = firstName
  if (lastName !== undefined) updates.lastName = lastName
  if (email !== undefined) updates.email = email
  if (instagram !== undefined) updates.instagram = instagram

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
  }

  const updated = updateRequest(id, updates)
  if (!updated) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 })
  }

  return NextResponse.json({ request: updated })
} 