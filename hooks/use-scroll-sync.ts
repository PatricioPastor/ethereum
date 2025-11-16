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
  const scrollRafIdRef = useRef<number | null>(null)

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

  // Calculate which year is currently visible based on scroll position
  const calculateVisibleYear = useCallback(
    (scrollTop: number) => {
      const container = scrollContainerRef.current
      if (!container) return null

      const sections = Array.from(container.querySelectorAll<HTMLElement>("[data-year]"))
      if (sections.length === 0) return null

      // Use a reference point near the top of the viewport (below header)
      const referencePoint = scrollTop + headerHeight + 80 // Slightly below header for better UX
      const viewportTop = scrollTop
      const viewportBottom = scrollTop + container.clientHeight

      // Find the section that is most relevant based on:
      // 1. Which section's content is being read (closest to reference point)
      // 2. Which section has the most content visible
      let bestMatch: { year: number; score: number } | null = null

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionBottom = sectionTop + section.offsetHeight
        const yearAttr = section.dataset.year
        if (!yearAttr) return

        const year = Number(yearAttr)
        if (Number.isNaN(year)) return

        // Calculate how much of this section is visible
        const visibleTop = Math.max(viewportTop, sectionTop)
        const visibleBottom = Math.min(viewportBottom, sectionBottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        const sectionHeight = section.offsetHeight

        // Calculate distance from reference point (where user is reading)
        const distanceFromReference = Math.abs(sectionTop - referencePoint)
        
        // Score based on:
        // 1. How much is visible (more visible = higher score, weighted heavily)
        // 2. How close the top is to the reference point (closer = higher score)
        // 3. Prefer sections that contain the reference point
        const visibilityRatio = sectionHeight > 0 ? visibleHeight / sectionHeight : 0
        const containsReference = referencePoint >= sectionTop && referencePoint <= sectionBottom
        const score = 
          visibilityRatio * 200 + // Visibility is most important
          (containsReference ? 150 : 0) + // Bonus if reference point is in this section
          Math.max(0, 100 - distanceFromReference * 0.5) // Closer to reference = better

        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { year, score }
        }
      })

      // If no best match found, find the closest section to the reference point
      if (!bestMatch && sections.length > 0) {
        let closestSection: { year: number; distance: number } | null = null
        
        sections.forEach((section) => {
          const sectionTop = section.offsetTop
          const yearAttr = section.dataset.year
          if (!yearAttr) return

          const year = Number(yearAttr)
          if (Number.isNaN(year)) return

          const distance = Math.abs(sectionTop - referencePoint)
          if (!closestSection || distance < closestSection.distance) {
            closestSection = { year, distance }
          }
        })
        
        return closestSection?.year ?? null
      }

      return bestMatch?.year ?? null
    },
    [scrollContainerRef, headerHeight],
  )

  // Setup IntersectionObserver for years with improved detection
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const sections = Array.from(container.querySelectorAll<HTMLElement>("[data-year]"))
    if (sections.length === 0) return

    // Update year based on scroll position
    const updateYearFromScroll = () => {
      if (navigationState !== "idle") return

      const scrollTop = container.scrollTop
      const visibleYear = calculateVisibleYear(scrollTop)
      if (visibleYear !== null && visibleYear !== activeYear) {
        onYearChange(visibleYear, "scroll")
      }
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Don't update during programmatic navigation
        if (navigationState !== "idle") return

        // Also use scroll position calculation for more accuracy
        updateYearFromScroll()

        // Fallback: use intersection observer if scroll calculation doesn't find anything
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            // Prefer sections closer to the top of the viewport
            const aTop = a.boundingClientRect.top
            const bTop = b.boundingClientRect.top
            const viewportTop = headerHeight + 50
            return Math.abs(aTop - viewportTop) - Math.abs(bTop - viewportTop)
          })

        const current = visible[0]
        if (!current) {
          // If no intersecting entries, use scroll calculation
          return
        }

        const yearAttr = (current.target as HTMLElement).dataset.year
        if (!yearAttr) return

        const year = Number(yearAttr)
        if (!Number.isNaN(year) && year !== activeYear) {
          onYearChange(year, "scroll")
        }
      },
      {
        root: container,
        rootMargin: `-${headerHeight + 20}px 0px -50% 0px`, // More generous margins
        threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75], // More thresholds for better detection
      },
    )

    sections.forEach((section) => observerRef.current?.observe(section))

    // Initialize the active year based on current scroll position
    // Wait a bit for layout to stabilize
    const initializeYear = () => {
      const scrollTop = container.scrollTop
      const visibleYear = calculateVisibleYear(scrollTop)
      if (visibleYear !== null && visibleYear !== activeYear) {
        onYearChange(visibleYear, "scroll")
      }
    }
    
    // Initialize immediately and after a short delay to ensure DOM is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initializeYear()
      })
    })

    // Also listen to scroll events for more frequent updates with throttling
    const scrollListener = () => {
      if (navigationState !== "idle") return
      
      // Use requestAnimationFrame for smooth throttling
      if (scrollRafIdRef.current === null) {
        scrollRafIdRef.current = requestAnimationFrame(() => {
          updateYearFromScroll()
          scrollRafIdRef.current = null
        })
      }
    }

    container.addEventListener("scroll", scrollListener, { passive: true })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      container.removeEventListener("scroll", scrollListener)
      if (scrollRafIdRef.current !== null) {
        cancelAnimationFrame(scrollRafIdRef.current)
        scrollRafIdRef.current = null
      }
    }
  }, [scrollContainerRef, yearGroups, activeYear, headerHeight, navigationState, onYearChange, calculateVisibleYear])

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

