"use client"

import { useMemo } from "react"
import type { TimelineYear } from "@/lib/data-parser"
import type { FilterState } from "@/components/filter-panel"
import { getEraById } from "@/lib/era-data"

interface UseYearsProps {
  timelineData: TimelineYear[]
  eraId?: string | "all"
  filters?: FilterState
  searchQuery?: string
}

export function useYears({ timelineData, eraId = "all", filters, searchQuery }: UseYearsProps) {
  const filteredData = useMemo(() => {
    const era = eraId !== "all" ? getEraById(eraId) : null

    return timelineData
      .filter((group) => {
        if (!era) return true
        return group.year >= era.yearStart && group.year <= era.yearEnd
      })
      .map((group) => ({
        ...group,
        events: group.events.filter((event) => {
          // Search filter
          if (searchQuery) {
            const matchesSearch =
              event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              event.entities.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()))
            if (!matchesSearch) return false
          }

          // Tag filter
          if (filters?.tags && filters.tags.length > 0) {
            const hasMatchingTag = event.tags.some((tag) => filters.tags.includes(tag))
            if (!hasMatchingTag) return false
          }

          // Importance filter
          if (filters?.importance && filters.importance.length > 0) {
            if (!filters.importance.includes(event.importance)) return false
          }

          return true
        }),
      }))
      .filter((group) => group.events.length > 0)
  }, [timelineData, eraId, searchQuery, filters])

  const years = useMemo(() => {
    return filteredData.map((group) => group.year).sort((a, b) => a - b)
  }, [filteredData])

  const eventsPerYear = useMemo(() => {
    return filteredData.reduce(
      (acc, group) => {
        acc[group.year] = group.events.length
        return acc
      },
      {} as Record<number, number>,
    )
  }, [filteredData])

  return {
    years,
    filteredData,
    eventsPerYear,
  }
}
