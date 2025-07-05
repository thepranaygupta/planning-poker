import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userName } = await request.json()
    const sessionId = params.id

    if (!userName || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if session exists
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id")
      .eq("id", sessionId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Check if user name is already taken in this session
    const { data: existingUser } = await supabase
      .from("session_users")
      .select("id")
      .eq("session_id", sessionId)
      .eq("name", userName)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: "Name already taken" }, { status: 409 })
    }

    // Add user to session
    const { error: userError } = await supabase.from("session_users").insert({
      session_id: sessionId,
      name: userName,
      is_creator: false,
    })

    if (userError) throw userError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error joining session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
