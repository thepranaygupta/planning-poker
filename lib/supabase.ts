import { createClient } from "@supabase/supabase-js"
import { toast } from "sonner"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client with real-time configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export type SizingType = "fibonacci" | "short_fibonacci" | "tshirt" | "tshirt_numbers"

export const SIZING_OPTIONS = {
  fibonacci: ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89"],
  short_fibonacci: ["0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"],
  tshirt: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
  tshirt_numbers: ["S", "M", "L", "XL", "1", "2", "3", "4", "5"],
}

export interface Session {
  id: string
  name: string
  creator_name: string
  sizing_type: SizingType
  allow_members_manage: boolean
  cards_revealed: boolean
  created_at: string
  updated_at: string
}

export interface SessionUser {
  id: string
  session_id: string
  name: string
  is_creator: boolean
  joined_at: string
}

export interface Estimate {
  id: string
  session_id: string
  user_name: string
  estimate: string | null
  created_at: string
  updated_at: string
}

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
}

export const localStorage = {
  getUserName: (): string | null => {
    if (typeof window === "undefined") return null
    return window.localStorage.getItem("planning-poker-username")
  },
  setUserName: (name: string) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem("planning-poker-username", name)
  },
  getUserSessions: (): string[] => {
    if (typeof window === "undefined") return []
    const sessions = window.localStorage.getItem("planning-poker-sessions")
    return sessions ? JSON.parse(sessions) : []
  },
  addUserSession: (sessionId: string, userName: string) => {
    if (typeof window === "undefined") return
    const sessions = localStorage.getUserSessions()
    const sessionData = { sessionId, userName, joinedAt: Date.now() }
    const updatedSessions = sessions.filter((s: any) => s.sessionId !== sessionId)
    updatedSessions.push(sessionData)
    window.localStorage.setItem("planning-poker-sessions", JSON.stringify(updatedSessions))
  },
  getUserSessionData: (sessionId: string): { userName: string } | null => {
    if (typeof window === "undefined") return null
    const sessions = localStorage.getUserSessions()
    const sessionData = sessions.find((s: any) => s.sessionId === sessionId)
    return sessionData ? { userName: sessionData.userName } : null
  },
}
