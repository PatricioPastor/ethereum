"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import type { TimelineYear } from "@/lib/data-parser"
import type { TimelineEvent } from "@/lib/data-parser"
import { AnimatedEventCard } from "./animated-event-card"
import type { ViewMode } from "./view-mode-toggle"

interface TimelineViewProps {
  yearGroups: TimelineYear[]
  onYearChange?: (year: number) => void
  onEntityClick?: (entityId: string) => void
  scrollContainerRef?: React.RefObject<HTMLDivElement>
  viewMode?: ViewMode
  onEventView?: (eventTitle: string) => void
  onShowRelations?: (event: TimelineEvent) => void
}

export function TimelineView({
  yearGroups,
  onYearChange,
  onEntityClick,
  scrollContainerRef,
  viewMode = "timeline",
  onEventView,
  onShowRelations,
}: TimelineViewProps) {
  const [visibleYears, setVisibleYears] = useState(3)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const yearRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const loadMoreObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleYears < yearGroups.length) {
          setIsLoadingMore(true)
          setTimeout(() => {
            setVisibleYears((prev) => Math.min(prev + 3, yearGroups.length))
            setIsLoadingMore(false)
          }, 300)
        }
      },
      {
        threshold: 0.1,
        root: scrollContainerRef?.current || null,
      },
    )

    if (loadMoreRef.current) {
      loadMoreObserver.observe(loadMoreRef.current)
    }

    return () => {
      loadMoreObserver.disconnect()
    }
  }, [visibleYears, yearGroups.length, scrollContainerRef])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0
        let activeYear = 0

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            const year = Number.parseInt(entry.target.getAttribute("data-year") || "0")
            if (year) {
              activeYear = year
            }
          }
        })

        if (activeYear && onYearChange && maxRatio > 0) {
          onYearChange(activeYear)
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        root: scrollContainerRef?.current || null,
        rootMargin: "-20% 0px -60% 0px",
      },
    )

    Object.values(yearRefs.current).forEach((ref) => {
      if (ref) observerRef.current?.observe(ref)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [onYearChange, visibleYears, scrollContainerRef])

  const visibleYearGroups = yearGroups.slice(0, visibleYears)

  const getCardVariant = (eventIndex: number, importance: string) => {
    if (importance === "high") return "featured"
    if (viewMode === "grid" && eventIndex % 5 === 0) return "featured"
    return "default"
  }

  return (
    <div className="space-y-16 pb-24">
      <AnimatePresence mode="wait">
        {visibleYearGroups.map((group, groupIndex) => (
          <motion.section
            key={group.year}
            ref={(el) => {
              yearRefs.current[group.year] = el
            }}
            data-year={group.year}
            className="scroll-mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="mb-8 flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ transformOrigin: "left" }}
              />
              <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <h2 className="text-4xl md:text-5xl font-bold text-primary relative z-10">{group.year}</h2>
                <motion.div
                  className="absolute inset-0 bg-primary/10 blur-xl rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
              </motion.div>
              <motion.div
                className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ transformOrigin: "right" }}
              />
            </motion.div>

            <motion.div
              className="text-sm text-muted-foreground mb-6 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {group.events.length} {group.events.length === 1 ? "evento" : "eventos"}
            </motion.div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                  : viewMode === "continuous"
                    ? "space-y-3"
                    : "space-y-6"
              }
            >
              {group.events.map((event, eventIndex) => (
                <AnimatedEventCard
                  key={event.title}
                  event={event}
                  index={eventIndex}
                  onEntityClick={onEntityClick}
                  onShowRelations={onShowRelations}
                  onView={onEventView}
                  variant={getCardVariant(eventIndex, event.importance)}
                />
              ))}
            </div>
          </motion.section>
        ))}
      </AnimatePresence>

      {visibleYears < yearGroups.length && (
        <div ref={loadMoreRef} className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="border border-border rounded-lg p-4 space-y-3"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-24 bg-muted rounded" />
                    <div className="h-5 w-16 bg-muted rounded" />
                  </div>
                  <div className="h-5 w-3/4 bg-muted rounded" />
                </div>
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-5/6 bg-muted rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-muted rounded" />
                <div className="h-6 w-20 bg-muted rounded" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
