"use client"

import { useEffect, useRef } from "react"
import type { TimelineYear } from "@/lib/data-parser"

interface TimelineScrollInitializerProps {
  scrollContainerRef: React.RefObject<HTMLElement>
  yearGroups: TimelineYear[]
  headerHeight: number
  onInitialized?: () => void
}

export function TimelineScrollInitializer({
  scrollContainerRef,
  yearGroups,
  headerHeight,
  onInitialized,
}: TimelineScrollInitializerProps) {
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    if (hasInitializedRef.current) return
    if (yearGroups.length === 0) return

    const container = scrollContainerRef.current
    if (!container) return

    // Wait for layout to stabilize
    const initializeScroll = async () => {
      // Wait for next frame to ensure DOM is ready
      await new Promise((resolve) => requestAnimationFrame(resolve))
      await new Promise((resolve) => requestAnimationFrame(resolve))

      const firstYear = yearGroups[0]?.year
      if (!firstYear) return

      const firstYearElement = container.querySelector<HTMLElement>(`[data-year="${firstYear}"]`)
      if (!firstYearElement) return

      // Verify element is actually rendered
      const rect = firstYearElement.getBoundingClientRect()
      if (rect.height === 0) {
        // Element not fully rendered, try again
        setTimeout(initializeScroll, 50)
        return
      }

      // Calculate scroll position
      const containerRect = container.getBoundingClientRect()
      const elementRect = firstYearElement.getBoundingClientRect()
      const currentScroll = container.scrollTop
      const elementOffsetInContainer = elementRect.top - containerRect.top
      const targetScroll = Math.max(0, currentScroll + elementOffsetInContainer - headerHeight - 32)

      // Only scroll if needed
      if (Math.abs(container.scrollTop - targetScroll) > 1) {
        container.scrollTo({ top: targetScroll, behavior: "instant" })
      }

      hasInitializedRef.current = true
      onInitialized?.()
    }

    const timeoutId = setTimeout(initializeScroll, 50)
    return () => clearTimeout(timeoutId)
  }, [scrollContainerRef, yearGroups, headerHeight, onInitialized])

  return null
}

