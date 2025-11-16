"use client"

import { useEffect, useRef, useCallback } from "react"
import type { TimelineYear } from "@/lib/data-parser"
import { getEraForYear, ERAS } from "@/lib/era-data"

interface UseScrollSyncProps {
  scrollContainerRef: React.RefObject<HTMLElement>
  yearGroups: TimelineYear[]
  activeYear: number
  headerHeight: number
  navigationState: "idle" | "navigating" | "scrolling"
  onYearChange: (year: number, trigger: "scroll") => void
  onEraChange: (eraId: string) => void
}

export function useScrollSync({
  scrollContainerRef,
  yearGroups,
  activeYear,
  headerHeight,
  navigationState,
  onYearChange,
  onEraChange,
}: UseScrollSyncProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const eraObserverRef = useRef<IntersectionObserver | null>(null)
  const isInitializedRef = useRef(false)

  // Throttled scroll handler
  const scrollHandlerRef = useRef<(() => void) | null>(null)
  const lastScrollTimeRef = useRef(0)

  const handleScroll = useCallback(
    (e: Event) => {
      if (navigationState !== "idle") return

      const now = Date.now()
      if (now - lastScrollTimeRef.current < 16) return // ~60fps throttle
      lastScrollTimeRef.current = now

      const container = scrollContainerRef.current
      if (!container) return

      const scrollTop = container.scrollTop
      scrollHandlerRef.current?.(scrollTop)
    },
    [navigationState, scrollContainerRef],
  )

  // Setup scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [scrollContainerRef, handleScroll])

  // Setup IntersectionObserver for years
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const sections = Array.from(container.querySelectorAll<HTMLElement>("[data-year]"))
    if (sections.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Don't update during programmatic navigation
        if (navigationState !== "idle") return

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            // Prefer sections closer to the top of the viewport
            const aTop = a.boundingClientRect.top
            const bTop = b.boundingClientRect.top
            return Math.abs(aTop - headerHeight) - Math.abs(bTop - headerHeight)
          })

        const current = visible[0]
        if (!current) return

        const yearAttr = (current.target as HTMLElement).dataset.year
        if (!yearAttr) return

        const year = Number(yearAttr)
        if (!Number.isNaN(year) && year !== activeYear) {
          onYearChange(year, "scroll")
        }
      },
      {
        root: container,
        rootMargin: `-${headerHeight}px 0px -40% 0px`,
        threshold: [0, 0.1, 0.25, 0.5],
      },
    )

    sections.forEach((section) => observerRef.current?.observe(section))

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [scrollContainerRef, yearGroups, activeYear, headerHeight, navigationState, onYearChange])

  // Setup IntersectionObserver for eras
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Cleanup previous observer
    if (eraObserverRef.current) {
      eraObserverRef.current.disconnect()
    }

    const sentinels = Array.from(container.querySelectorAll<HTMLElement>("[data-era-sentinel-id]"))
    if (sentinels.length === 0) return

    eraObserverRef.current = new IntersectionObserver(
      (entries) => {
        // Don't update during programmatic navigation
        if (navigationState !== "idle") return

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        const topEntry = visible[0]
        if (!topEntry) return

        const eraId = (topEntry.target as HTMLElement).dataset.eraSentinelId
        if (eraId) {
          onEraChange(eraId)
        }
      },
      {
        root: container,
        threshold: [0, 0.35, 0.65],
        rootMargin: "-25% 0px -60% 0px",
      },
    )

    sentinels.forEach((sentinel) => eraObserverRef.current?.observe(sentinel))

    return () => {
      if (eraObserverRef.current) {
        eraObserverRef.current.disconnect()
        eraObserverRef.current = null
      }
    }
  }, [scrollContainerRef, yearGroups, navigationState, onEraChange])

  return {
    setScrollHandler: useCallback((handler: (scrollTop: number) => void) => {
      scrollHandlerRef.current = handler
    }, []),
  }
}

