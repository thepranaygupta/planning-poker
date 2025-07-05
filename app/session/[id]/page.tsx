"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  supabase,
  SIZING_OPTIONS,
  type Session,
  type SessionUser,
  type Estimate,
  showToast,
  localStorage,
} from "@/lib/supabase"
import PlanningCard from "@/components/planning-card"
import UserEstimatesTable from "@/components/user-estimates-table"
import { Eye, EyeOff, RotateCcw, Copy, Share2 } from "lucide-react"

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const [session, setSession] = useState<Session | null>(null)
  const [users, setUsers] = useState<SessionUser[]>([])
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)
  const [checkingUser, setCheckingUser] = useState(true)

  // Check if user is already in session or redirect to join
  useEffect(() => {
    const checkUserAccess = async () => {
      // First check localStorage for existing session data
      const sessionData = localStorage.getUserSessionData(sessionId)

      if (sessionData) {
        // Check if user still exists in the session
        try {
          const response = await fetch(`/api/session/${sessionId}/check-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName: sessionData.userName }),
          })

          const data = await response.json()

          if (data.exists) {
            setUserName(sessionData.userName)
            setCheckingUser(false)
            return
          }
        } catch (error) {
          console.error("Error checking user:", error)
        }
      }

      // If no valid session data, redirect to join page
      router.push(`/join?sessionId=${sessionId}`)
    }

    checkUserAccess()
  }, [sessionId, router])

  // Fetch initial data
  useEffect(() => {
    if (!userName || checkingUser) return

    const fetchData = async () => {
      try {
        // Fetch session
        const { data: sessionData, error: sessionError } = await supabase
          .from("sessions")
          .select("*")
          .eq("id", sessionId)
          .single()

        if (sessionError) {
          showToast.error("Session not found")
          router.push("/")
          return
        }
        setSession(sessionData)

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from("session_users")
          .select("*")
          .eq("session_id", sessionId)
          .order("joined_at")

        if (usersError) throw usersError
        setUsers(usersData)

        // Fetch estimates
        const { data: estimatesData, error: estimatesError } = await supabase
          .from("estimates")
          .select("*")
          .eq("session_id", sessionId)

        if (estimatesError) throw estimatesError
        setEstimates(estimatesData)

        // Set selected card if user has an estimate
        const userEstimate = estimatesData.find((e) => e.user_name === userName)
        if (userEstimate?.estimate) {
          setSelectedCard(userEstimate.estimate)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        showToast.error("Failed to load session data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sessionId, userName, router, checkingUser])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!sessionId || !userName || checkingUser) return

    console.log("Setting up real-time subscriptions for session:", sessionId)

    // Create a unique channel name
    const channelName = `session_${sessionId}_${Date.now()}`

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          console.log("Session updated:", payload)
          const newSession = payload.new as Session
          const oldSession = payload.old as Session

          setSession(newSession)

          // Show toast when cards are revealed/hidden
          if (newSession.cards_revealed !== oldSession?.cards_revealed) {
            if (newSession.cards_revealed) {
              showToast.info("🎴 Cards have been revealed!")
            } else {
              // window.alert("Cards are now hidden - you can change your estimate")
              window.location.reload()
              // showToast.info("🔒 Cards hidden - you can change your estimate")
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "session_users",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log("User joined:", payload)
          const newUser = payload.new as SessionUser
          setUsers((prev) => {
            // Avoid duplicates
            if (prev.find((u) => u.id === newUser.id)) return prev
            return [...prev, newUser]
          })

          if (newUser.name !== userName) {
            showToast.success(`👋 ${newUser.name} joined the session`)
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "session_users",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log("User left:", payload)
          const leftUser = payload.old as SessionUser
          setUsers((prev) => prev.filter((u) => u.id !== leftUser.id))

          if (leftUser.name !== userName) {
            showToast.info(`👋 ${leftUser.name} left the session`)
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "estimates",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log("New estimate:", payload)
          const estimate = payload.new as Estimate
          setEstimates((prev) => {
            const filtered = prev.filter((e) => e.user_name !== estimate.user_name)
            return [...filtered, estimate]
          })

          // Show toast for new estimates (but not for current user)
          if (estimate.user_name !== userName && estimate.estimate) {
            showToast.info(`📊 ${estimate.user_name} submitted their estimate`)
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "estimates",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log("Estimate updated:", payload)
          const estimate = payload.new as Estimate
          const oldEstimate = payload.old as Estimate

          setEstimates((prev) => {
            return prev.map((e) => (e.id === estimate.id ? estimate : e))
          })

          // Show toast for estimate changes (but not for current user)
          if (estimate.user_name !== userName && estimate.estimate !== oldEstimate.estimate) {
            if (oldEstimate.estimate) {
              showToast.info(`🔄 ${estimate.user_name} changed their estimate`)
            } else {
              showToast.info(`📊 ${estimate.user_name} submitted their estimate`)
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "estimates",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log("Estimate deleted:", payload)
          const deletedEstimate = payload.old as Estimate

          setEstimates((prev) => {
            const newEstimates = prev.filter((e) => e.id !== deletedEstimate.id)

            // If this was part of a bulk clear (no estimates left), reset selected card and show toast
            if (prev.length > 0 && newEstimates.length === 0) {
              setSelectedCard(null)
              showToast.success("🆕 Ready for next estimation round!")
            }

            return newEstimates
          })
        },
      )
      .subscribe((status, err) => {
        console.log("Subscription status:", status, err)
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to real-time updates")
          showToast.success("🔄 Connected to real-time updates")
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Channel error:", err)
          showToast.error("❌ Real-time connection failed")
        } else if (status === "TIMED_OUT") {
          console.error("⏰ Subscription timed out")
          showToast.error("⏰ Real-time connection timed out")
        } else if (status === "CLOSED") {
          console.log("🔌 Real-time connection closed")
        }
      })

    return () => {
      console.log("🧹 Cleaning up real-time subscription")
      supabase.removeChannel(channel)
    }
  }, [sessionId, userName, checkingUser])

  // Remove the separate effect for estimate clearing as it's now handled in the main subscription

  const currentUser = users.find((u) => u.name === userName)
  const isCreator = currentUser?.is_creator || false
  const canManage = isCreator || session?.allow_members_manage || false

  const handleCardSelect = async (value: string) => {
    if (!userName || !session) return

    // Don't allow changes if cards are revealed
    if (session.cards_revealed) {
      showToast.error("Cannot change estimate - cards are already revealed!")
      return
    }

    const previousCard = selectedCard
    setSelectedCard(value)

    try {
      const { error } = await supabase.from("estimates").upsert({
        session_id: sessionId,
        user_name: userName,
        estimate: value,
      })

      if (error) throw error

      // Show appropriate toast message
      if (previousCard && previousCard !== value) {
        showToast.success(`🔄 Changed estimate from ${previousCard} to ${value}`)
      } else if (!previousCard) {
        showToast.success(`📊 Estimate submitted: ${value}`)
      }
    } catch (error) {
      console.error("Error saving estimate:", error)
      showToast.error("Failed to save estimate")
      // Revert the selection on error
      setSelectedCard(previousCard)
    }
  }

  const handleRevealCards = async () => {
    if (!canManage || !session) return

    try {
      const { error } = await supabase
        .from("sessions")
        .update({ cards_revealed: !session.cards_revealed })
        .eq("id", sessionId)

      if (error) throw error
    } catch (error) {
      console.error("Error toggling card reveal:", error)
      showToast.error("Failed to toggle card reveal")
    }
  }

  const handleClearEstimates = async () => {
    if (!canManage) return

    try {
      // First hide cards, then clear estimates
      await supabase.from("sessions").update({ cards_revealed: false }).eq("id", sessionId)

      // Then clear all estimates
      const { error } = await supabase.from("estimates").delete().eq("session_id", sessionId)

      if (error) throw error

      showToast.success("🗑️ All estimates cleared - ready for next round!")
    } catch (error) {
      console.error("Error clearing estimates:", error)
      showToast.error("Failed to clear estimates")
    }
  }

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId)
    showToast.success("Session ID copied to clipboard!")
  }

  const shareSession = () => {
    const url = `${window.location.origin}/session/${sessionId}`
    navigator.clipboard.writeText(url)
    showToast.success("Session link copied to clipboard!")
  }

  if (checkingUser || loading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!session || !userName) {
    return (
      <div className="bg-gray-50 flex items-center justify-center py-32">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">Session not found or invalid access.</p>
            <div className="mt-4 text-center">
              <Button onClick={() => router.push("/")}>Go Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const cards = [...SIZING_OPTIONS[session.sizing_type], "?"]

  return (
    <TooltipProvider>
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{session.name}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-sm text-gray-600">
                    Session ID: <span className="font-mono">{sessionId}</span>
                  </p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={copySessionId}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Session ID</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={shareSession}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share Session Link</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {canManage && (
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant={session.cards_revealed ? "default" : "outline"} onClick={handleRevealCards}>
                        {session.cards_revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {session.cards_revealed ? "Hide Cards" : "Reveal Cards"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {session.cards_revealed ? "Hide all estimates" : "Show all estimates"}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={handleClearEstimates}>
                        <RotateCcw className="w-4 h-4" />
                        Clear
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear all estimates</TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cards Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Your Estimate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                    {cards.map((card) => (
                      <PlanningCard
                        key={card}
                        value={card}
                        isSelected={selectedCard === card}
                        onClick={() => handleCardSelect(card)}
                        disabled={session.cards_revealed}
                      />
                    ))}
                  </div>
                  {session.cards_revealed && (
                    <p className="text-sm text-gray-500 mt-4">
                      Cards are revealed. Wait for the next round to make new estimates.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Users Section */}
            <div>
              <UserEstimatesTable
                users={users}
                estimates={estimates}
                cardsRevealed={session.cards_revealed}
                currentUserName={userName}
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
