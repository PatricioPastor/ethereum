"use client"

import { motion } from "framer-motion"
import type { Era } from "@/lib/era-data"
import { Card } from "@/components/ui/card"

interface EraIntroCardProps {
  era: Era
  eventCount: number
  yearRange: string
}

export function EraIntroCard({ era, eventCount, yearRange }: EraIntroCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      role="region"
      aria-label={`Era: ${era.nameEn}`}
    >
      <Card className={`p-8 mb-12 bg-gradient-to-br ${era.color} border-primary/20 overflow-hidden relative`}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />

        <div className="space-y-4 relative z-10">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="h-1 w-12 bg-primary rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Era {yearRange}</span>
          </motion.div>

          <motion.h2
            className={`text-4xl md:text-5xl font-bold ${era.accentColor}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {era.nameEn}
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground leading-relaxed max-w-3xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {era.descriptionEn}
          </motion.p>

          <motion.div
            className="flex items-center gap-6 pt-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="h-2 w-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <span className="text-sm text-muted-foreground">
                {eventCount} {eventCount === 1 ? "event" : "events"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary/60" />
              <span className="text-sm text-muted-foreground">{yearRange}</span>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
