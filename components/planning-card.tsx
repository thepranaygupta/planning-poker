"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PlanningCardProps {
  value: string
  isSelected: boolean
  onClick: () => void
  disabled?: boolean
}

export default function PlanningCard({ value, isSelected, onClick, disabled }: PlanningCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={cn("relative w-16 h-24 cursor-pointer select-none", disabled && "cursor-not-allowed opacity-50")}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onHoverStart={() => !disabled && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={!disabled ? onClick : undefined}
    >
      <motion.div
        className={cn(
          "w-full h-full rounded-lg border-2 flex items-center justify-center font-bold text-lg shadow-md transition-colors",
          isSelected
            ? "bg-red-100 border-red-400 text-red-800"
            : disabled
              ? "bg-gray-100 border-gray-300 text-gray-400"
              : "bg-white border-gray-300 text-gray-700 hover:border-gray-400",
          isHovered && !disabled && "shadow-lg",
          disabled && "cursor-not-allowed",
        )}
        animate={{
          rotateY: isSelected ? 180 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <span className={cn(isSelected && "transform scale-x-[-1]")}>{value === "?" ? "?" : value}</span>
      </motion.div>

      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
          <span className="text-xs absolute bottom-5 text-gray-600 font-medium">Locked</span>
        </div>
      )}
    </motion.div>
  )
}
