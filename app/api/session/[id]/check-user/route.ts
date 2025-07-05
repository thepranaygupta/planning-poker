import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userName } = await request.json()
    const sessionId = params.id

    if (!userName || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user exists in session
    const { data: user, error } = await supabase
      .from("session_users")
      .select("id, name, is_creator")
      .eq("session_id", sessionId)
      .eq("name", userName)
      .single()

    if (error || !user) {
      return NextResponse.json({ exists: false })
    }

    return NextResponse.json({ exists: true, user })
  } catch (error) {
    console.error("Error checking user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
