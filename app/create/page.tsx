"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase, type SizingType } from "@/lib/supabase"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"

// Update to use localStorage and toast notifications

import { showToast, localStorage } from "@/lib/supabase"

// Update the component to use localStorage and toast:

export default function CreateSessionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sessionName: "",
    userName: localStorage.getUserName() || "",
    sizingType: "short_fibonacci" as SizingType,
    allowMembersManage: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.sessionName.trim() || !formData.userName.trim()) return

    setLoading(true)
    try {
      // Create session
      const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          name: formData.sessionName.trim(),
          creator_name: formData.userName.trim(),
          sizing_type: formData.sizingType,
          allow_members_manage: formData.allowMembersManage,
        })
        .select()
        .single()

      if (sessionError) throw sessionError

      // Add creator as user
      const { error: userError } = await supabase.from("session_users").insert({
        session_id: session.id,
        name: formData.userName.trim(),
        is_creator: true,
      })

      if (userError) throw userError

      // Store user data in localStorage
      localStorage.setUserName(formData.userName.trim())
      localStorage.addUserSession(session.id, formData.userName.trim())

      showToast.success("Session created successfully!")
      router.push(`/session/${session.id}`)
    } catch (error) {
      console.error("Error creating session:", error)
      showToast.error("Failed to create session. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-red-600" />
              <CardTitle>Create Planning Poker Session</CardTitle>
            </div>
            <CardDescription>
              Set up a new planning poker session for your team to estimate story points together.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sessionName">Session Name *</Label>
                <Input
                  id="sessionName"
                  placeholder="e.g., Sprint 23 Planning"
                  value={formData.sessionName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sessionName: e.target.value }))}
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

              <div className="space-y-2">
                <Label htmlFor="sizingType">Card Set</Label>
                <Select
                  value={formData.sizingType}
                  onValueChange={(value: SizingType) => setFormData((prev) => ({ ...prev, sizingType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fibonacci">
                      <div>
                        <div className="font-medium">Fibonacci</div>
                        <div className="text-sm text-gray-500">0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="short_fibonacci">
                      <div>
                        <div className="font-medium">Short Fibonacci</div>
                        <div className="text-sm text-gray-500">0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="tshirt">
                      <div>
                        <div className="font-medium">T-Shirt Sizes</div>
                        <div className="text-sm text-gray-500">XXS, XS, S, M, L, XL, XXL</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="tshirt_numbers">
                      <div>
                        <div className="font-medium">T-Shirt & Numbers</div>
                        <div className="text-sm text-gray-500">S, M, L, XL, 1, 2, 3, 4, 5</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowMembersManage"
                  checked={formData.allowMembersManage}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, allowMembersManage: checked as boolean }))
                  }
                />
                <Label htmlFor="allowMembersManage" className="text-sm">
                  Allow all members to manage session (reveal cards, clear estimates)
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Session..." : "Create Session"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
