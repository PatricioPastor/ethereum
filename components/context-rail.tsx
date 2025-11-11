"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Layers } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Era } from "@/lib/era-data"

interface ContextRailProps {
  currentYear: number
  currentEra: Era | null
  eventCount: number
  scrollProgress: number
}

export function ContextRail({ currentYear, currentEra, eventCount }: ContextRailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-[88px]"
      role="complementary"
      aria-label="Reading context"
    >
      <Card className="p-6 space-y-6 bg-card/30 backdrop-blur-sm border-border/30 shadow-none">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground opacity-70 mb-3">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Current Position</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentYear}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent">
                {currentYear}
              </div>
              {currentEra && <div className="text-sm text-muted-foreground mt-2 opacity-70">{currentEra.name}</div>}
            </motion.div>
          </AnimatePresence>
        </div>

        {currentEra && (
          <div className="pt-4 border-t border-border/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 opacity-70">
              <Layers className="h-4 w-4" />
              <span className="font-medium">Era Context</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed opacity-70">{currentEra.descriptionEn}</p>
            <div className="mt-3 text-xs text-muted-foreground opacity-70">
              {eventCount} events in {currentYear}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
