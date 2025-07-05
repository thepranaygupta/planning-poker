"use client"

import { cn } from "@/lib/utils"

import { motion, AnimatePresence } from "framer-motion"
import type { SessionUser, Estimate } from "@/lib/supabase"
import { Eye, EyeOff, User, Crown } from "lucide-react"

interface UserEstimatesTableProps {
  users: SessionUser[]
  estimates: Estimate[]
  cardsRevealed: boolean
  currentUserName: string
}

export default function UserEstimatesTable({
  users,
  estimates,
  cardsRevealed,
  currentUserName,
}: UserEstimatesTableProps) {
  const getUserEstimate = (userName: string) => {
    return estimates.find((e) => e.user_name === userName)?.estimate
  }

  const getRevealedEstimates = () => {
    return estimates.filter((e) => e.estimate).map((e) => e.estimate!)
  }

  const calculateStats = () => {
    const revealedEstimates = getRevealedEstimates()
    const numericEstimates = revealedEstimates
      .filter((e) => e !== "?" && !isNaN(Number(e)))
      .map(Number)
      .sort((a, b) => a - b)

    if (numericEstimates.length === 0) return { average: 0, median: 0 }

    const average = numericEstimates.reduce((a, b) => a + b, 0) / numericEstimates.length
    const median =
      numericEstimates.length % 2 === 0
        ? (numericEstimates[numericEstimates.length / 2 - 1] + numericEstimates[numericEstimates.length / 2]) / 2
        : numericEstimates[Math.floor(numericEstimates.length / 2)]

    return { average: Math.round(average * 10) / 10, median }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
          <h3 className="font-semibold text-gray-900">Participants</h3>
          {!cardsRevealed && estimates.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {estimates.length} of {users.length} have estimated
            </p>
          )}
        </div>
        <div className="divide-y">
          {users.map((user) => {
            const estimate = getUserEstimate(user.name)
            const isCurrentUser = user.name === currentUserName

            return (
              <motion.div
                key={user.id}
                className={cn("px-4 py-3 flex items-center justify-between", isCurrentUser && "bg-blue-50")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {user.is_creator ? (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <User className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={cn("font-medium", isCurrentUser ? "text-blue-700" : "text-gray-900")}>
                      {user.name}
                      {isCurrentUser && " (You)"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {estimate ? (
                    <div className="flex items-center space-x-2">
                      <AnimatePresence mode="wait">
                        {cardsRevealed ? (
                          <motion.div
                            key="revealed"
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: -90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-8 h-12 bg-white border-2 border-red-400 rounded flex items-center justify-center text-sm font-bold text-red-800"
                          >
                            {estimate}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="hidden"
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: -90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                              "w-8 h-12 border-2 rounded flex items-center justify-center relative",
                              isCurrentUser ? "bg-blue-600 border-blue-700" : "bg-gray-600 border-gray-700",
                            )}
                          >
                            <EyeOff className="w-3 h-3 text-white" />
                            {!cardsRevealed && isCurrentUser && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-green-500" />
                        {!cardsRevealed && isCurrentUser && (
                          <span className="ml-1 text-xs text-green-600 font-medium">Can change</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-12 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-400">?</span>
                      </div>
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {cardsRevealed && getRevealedEstimates().length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-4"
        >
          <h4 className="font-semibold text-gray-900 mb-2">Statistics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Average:</span>
              <span className="ml-2 font-semibold">{stats.average}</span>
            </div>
            <div>
              <span className="text-gray-600">Median:</span>
              <span className="ml-2 font-semibold">{stats.median}</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Based on {getRevealedEstimates().filter((e) => e !== "?" && !isNaN(Number(e))).length} numeric estimates
          </div>
        </motion.div>
      )}

      {!cardsRevealed && estimates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-lg border border-blue-200 p-3"
        >
          <p className="text-sm text-blue-800">💡 You can change your estimate until cards are revealed</p>
        </motion.div>
      )}
    </div>
  )
}
