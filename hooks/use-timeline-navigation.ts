"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { getEraForYear, ERAS, type Era } from "@/lib/era-data"

type NavigationState = "idle" | "navigating" | "scrolling"

interface UseTimelineNavigationProps {
  initialYear?: number
  onYearChange?: (year: number) => void
  onEraChange?: (era: Era) => void
}

export function useTimelineNavigation({
  initialYear = 2008,
  onYearChange,
  onEraChange,
}: UseTimelineNavigationProps = {}) {
  const [activeYear, setActiveYear] = useState(initialYear)
  const [activeEraId, setActiveEraId] = useState(() => getEraForYear(initialYear)?.id ?? ERAS[0].id)
  const [navigationState, setNavigationState] = useState<NavigationState>("idle")
  const [isScrolled, setIsScrolled] = useState(false)

  const navigationAbortController = useRef<AbortController | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get current era from active year
  const currentEra = getEraForYear(activeYear) ?? ERAS.find((e) => e.id === activeEraId) ?? ERAS[0]

  // Cancel any ongoing navigation
  const cancelNavigation = useCallback(() => {
    if (navigationAbortController.current) {
      navigationAbortController.current.abort()
      navigationAbortController.current = null
    }
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = null
    }
    setNavigationState("idle")
  }, [])

  // Navigate to a specific year with proper synchronization
  const navigateToYear = useCallback(
    (year: number, options?: { forceCollapse?: boolean; trigger?: "arrow" | "manual" | "scroll" }) => {
      // Cancel any ongoing navigation
      cancelNavigation()

      const era = getEraForYear(year)
      if (!era) return

      // Update era first if it changed
      if (era.id !== activeEraId) {
        setActiveEraId(era.id)
        onEraChange?.(era)
      }

      // Update year
      setActiveYear(year)
      onYearChange?.(year)

      // Handle scroll state
      const firstYear = ERAS[0]?.yearStart ?? 2008
      const shouldExpand = year === firstYear && !options?.forceCollapse && options?.trigger !== "arrow"

      if (shouldExpand) {
        setIsScrolled(false)
      } else {
        setIsScrolled(true)
      }

      // Set navigation state
      if (options?.trigger === "scroll") {
        setNavigationState("idle") // Scroll-triggered navigation doesn't block
      } else {
        setNavigationState("navigating")
      }
    },
    [activeEraId, cancelNavigation, onYearChange, onEraChange],
  )

  // Navigate to era by navigating to its start year
  const navigateToEra = useCallback(
    (eraId: string) => {
      const era = ERAS.find((e) => e.id === eraId)
      if (era) {
        navigateToYear(era.yearStart, { trigger: "manual" })
      }
    },
    [navigateToYear],
  )

  // Calculate header height based on scroll state and screen size
  const getHeaderHeight = useCallback(() => {
    if (typeof window === "undefined") return 260
    const isMobile = window.innerWidth < 768
    if (isMobile) return 88 // Mobile header with era nav
    return isScrolled ? 140 : 260
  }, [isScrolled])

  // Scroll to element with proper coordination
  const scrollToElement = useCallback(
    (
      element: HTMLElement | null,
      container: HTMLElement | null,
      options?: { offset?: number; behavior?: ScrollBehavior },
    ) => {
      if (!element || !container) return Promise.resolve()

      return new Promise<void>((resolve) => {
        cancelNavigation()

        const abortController = new AbortController()
        navigationAbortController.current = abortController

        setNavigationState("scrolling")

        const headerHeight = getHeaderHeight()
        const offset = options?.offset ?? headerHeight + 32

        const containerRect = container.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        const currentScroll = container.scrollTop
        const elementOffsetInContainer = elementRect.top - containerRect.top
        const targetScroll = Math.max(0, currentScroll + elementOffsetInContainer - offset)

        container.scrollTo({
          top: targetScroll,
          behavior: options?.behavior ?? "smooth",
        })

        // Wait for scroll to complete
        let lastScrollTop = container.scrollTop
        let stableCount = 0
        const checkScrollComplete = () => {
          if (abortController.signal.aborted) {
            resolve()
            return
          }

          const currentScrollTop = container.scrollTop
          const scrollDifference = Math.abs(currentScrollTop - targetScroll)
          const hasMoved = Math.abs(currentScrollTop - lastScrollTop) > 0.5

          if (hasMoved) {
            lastScrollTop = currentScrollTop
            stableCount = 0
          } else {
            stableCount++
          }

          // Scroll is complete if we're close to target AND haven't moved for 2 checks
          if (scrollDifference < 2 && stableCount >= 2) {
            // Scroll completed
            setNavigationState("idle")
            navigationAbortController.current = null
            resolve()
          } else if (scrollDifference < 1) {
            // Very close, just wait one more check
            setNavigationState("idle")
            navigationAbortController.current = null
            resolve()
          } else {
            // Continue checking
            scrollTimeoutRef.current = setTimeout(checkScrollComplete, 50)
          }
        }

        // Start checking after animation would have started
        if (options?.behavior === "smooth") {
          scrollTimeoutRef.current = setTimeout(checkScrollComplete, 100)
        } else {
          // Instant scroll, resolve immediately
          setNavigationState("idle")
          navigationAbortController.current = null
          resolve()
        }
      })
    },
    [cancelNavigation, getHeaderHeight],
  )

  // Handle scroll events to update isScrolled state
  const handleScroll = useCallback(
    (scrollTop: number) => {
      // Don't update during programmatic navigation
      if (navigationState !== "idle") return

      const newIsScrolled = scrollTop > 50
      if (newIsScrolled !== isScrolled) {
        setIsScrolled(newIsScrolled)
      }
    },
    [isScrolled, navigationState],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelNavigation()
    }
  }, [cancelNavigation])

  return {
    activeYear,
    activeEraId,
    currentEra,
    navigationState,
    isScrolled,
    navigateToYear,
    navigateToEra,
    scrollToElement,
    handleScroll,
    getHeaderHeight,
    cancelNavigation,
  }
}

