"use client"

import { useEffect, useRef, useCallback } from "react"
import type { TimelineEvent } from "@/lib/data-parser"
import { timelineData } from "@/lib/timeline-data"

interface UseEventNavigationProps {
  scrollContainerRef: React.RefObject<HTMLElement>
  navigateToYear: (year: number, options?: { forceCollapse?: boolean; trigger?: "arrow" | "manual" | "scroll" }) => void
  scrollToElement: (
    element: HTMLElement | null,
    container: HTMLElement | null,
    options?: { offset?: number; behavior?: ScrollBehavior },
  ) => Promise<void>
}

export function useEventNavigation({
  scrollContainerRef,
  navigateToYear,
  scrollToElement,
}: UseEventNavigationProps) {
  const hasNavigatedToEventRef = useRef(false)
  const pendingEventIdRef = useRef<string | null>(null)

  // Navigate to a specific event
  const navigateToEvent = useCallback(
    async (eventId: string) => {
      const allEvents = timelineData.flatMap((group) => group.events)
      const event = allEvents.find((e) => e.id === eventId)

      if (!event) return

      const container = scrollContainerRef.current
      if (!container) return

      // First navigate to the year - this will update the UI state
      navigateToYear(event.year, { forceCollapse: true, trigger: "manual" })

      // Wait for layout to stabilize after year navigation
      await new Promise((resolve) => requestAnimationFrame(resolve))
      await new Promise((resolve) => requestAnimationFrame(resolve))
      await new Promise((resolve) => setTimeout(resolve, 150))

      // Wait for event element to be rendered with retry logic
      let attempts = 0
      const maxAttempts = 30
      const findEventElement = async (): Promise<HTMLElement | null> => {
        const eventElement = container.querySelector<HTMLElement>(`[data-event-id="${eventId}"]`)
        if (eventElement) {
          // Verify element is actually rendered (has dimensions)
          const rect = eventElement.getBoundingClientRect()
          if (rect.height > 0) {
            return eventElement
          }
        }
        
        if (attempts++ < maxAttempts) {
          await new Promise((resolve) => requestAnimationFrame(resolve))
          return findEventElement()
        }
        
        return null
      }

      const eventElement = await findEventElement()
      if (eventElement) {
        await scrollToElement(eventElement, container, { behavior: "smooth" })
      }
    },
    [scrollContainerRef, navigateToYear, scrollToElement],
  )

  // Handle URL parameter for event navigation (from home page)
  useEffect(() => {
    if (hasNavigatedToEventRef.current) return

    const params = new URLSearchParams(window.location.search)
    const eventId = params.get("event")

    if (eventId) {
      hasNavigatedToEventRef.current = true
      pendingEventIdRef.current = eventId

      // Wait for initial render to complete
      const timeoutId = setTimeout(() => {
        if (pendingEventIdRef.current) {
          navigateToEvent(pendingEventIdRef.current)
          pendingEventIdRef.current = null
        }
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [navigateToEvent])

  return {
    navigateToEvent,
  }
}

