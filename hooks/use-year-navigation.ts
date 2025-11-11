"use client"

import { useState, useCallback, useMemo, useRef } from "react"

export type NavigationMode = "circular" | "clamped"

interface UseYearNavigationProps {
  years: number[]
  initialYear?: number
  mode?: NavigationMode
  onYearChange?: (year: number) => void
}

export function useYearNavigation({ years, initialYear, mode = "circular", onYearChange }: UseYearNavigationProps) {
  const initialIndex = initialYear ? years.indexOf(initialYear) : 0
  const [activeYearIndex, setActiveYearIndex] = useState(Math.max(0, initialIndex))
  const isAnimatingRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)

  const activeYear = useMemo(() => years[activeYearIndex] || years[0], [years, activeYearIndex])

  const navigateToYear = useCallback(
    (year: number) => {
      if (isAnimatingRef.current) return

      const index = years.indexOf(year)
      if (index !== -1) {
        isAnimatingRef.current = true
        setActiveYearIndex(index)
        onYearChange?.(year)

        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = requestAnimationFrame(() => {
            isAnimatingRef.current = false
          })
        })
      }
    },
    [years, onYearChange],
  )

  const navigateToIndex = useCallback(
    (index: number) => {
      if (isAnimatingRef.current) return

      const clampedIndex = Math.max(0, Math.min(index, years.length - 1))
      isAnimatingRef.current = true
      setActiveYearIndex(clampedIndex)
      onYearChange?.(years[clampedIndex])

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = requestAnimationFrame(() => {
          isAnimatingRef.current = false
        })
      })
    },
    [years, onYearChange],
  )

  const nextYear = useCallback(() => {
    if (isAnimatingRef.current) return

    if (mode === "circular") {
      const nextIndex = (activeYearIndex + 1) % years.length
      navigateToIndex(nextIndex)
    } else {
      const nextIndex = Math.min(activeYearIndex + 1, years.length - 1)
      navigateToIndex(nextIndex)
    }
  }, [activeYearIndex, years.length, mode, navigateToIndex])

  const previousYear = useCallback(() => {
    if (isAnimatingRef.current) return

    if (mode === "circular") {
      const prevIndex = (activeYearIndex - 1 + years.length) % years.length
      navigateToIndex(prevIndex)
    } else {
      const prevIndex = Math.max(activeYearIndex - 1, 0)
      navigateToIndex(prevIndex)
    }
  }, [activeYearIndex, years.length, mode, navigateToIndex])

  const canGoNext = useMemo(() => {
    if (mode === "circular") return true
    return activeYearIndex < years.length - 1
  }, [activeYearIndex, years.length, mode])

  const canGoPrevious = useMemo(() => {
    if (mode === "circular") return true
    return activeYearIndex > 0
  }, [activeYearIndex, mode])

  return {
    activeYear,
    activeYearIndex,
    navigateToYear,
    navigateToIndex,
    nextYear,
    previousYear,
    canGoNext,
    canGoPrevious,
    isAnimating: isAnimatingRef.current,
  }
}
