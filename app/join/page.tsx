"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, LogIn } from "lucide-react"
import Link from "next/link"
import { showToast, localStorage } from "@/lib/supabase"

export default function JoinSessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sessionId: searchParams.get("sessionId") || "",
    userName: localStorage.getUserName() || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.sessionId.trim() || !formData.userName.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/session/${formData.sessionId.trim()}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: formData.userName.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          showToast.error("Session not found. Please check the session ID.")
        } else if (response.status === 409) {
          showToast.error("This name is already taken in this session. Please choose a different name.")
        } else {
          showToast.error(data.error || "Failed to join session.")
        }
        setLoading(false)
        return
      }

      // Store user data in localStorage
      localStorage.setUserName(formData.userName.trim())
      localStorage.addUserSession(formData.sessionId.trim(), formData.userName.trim())

      showToast.success("Joined session successfully!")
      router.push(`/session/${formData.sessionId.trim()}`)
    } catch (error) {
      console.error("Error joining session:", error)
      showToast.error("Failed to join session. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <LogIn className="w-6 h-6 text-red-600" />
              <CardTitle>Join Planning Poker Session</CardTitle>
            </div>
            <CardDescription>
              Enter the session ID and your name to join an existing planning poker session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionId">Session ID *</Label>
                <Input
                  id="sessionId"
                  placeholder="Enter session ID"
                  value={formData.sessionId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sessionId: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userName">Your Name *</Label>
                <Input
                  id="userName"
                  placeholder="e.g., John Doe"
                  value={formData.userName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, userName: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Joining Session..." : "Join Session"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
