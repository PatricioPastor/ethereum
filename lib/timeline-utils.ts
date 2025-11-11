import type { TimelineEvent, TimelineYear } from "./data-parser"
import { getEraForYear, type Era } from "./era-data"

export interface TimelineByEra {
  era: Era
  years: TimelineYear[]
  eventCount: number
}

export function groupTimelineByEra(timelineData: TimelineYear[]): TimelineByEra[] {
  const eraMap = new Map<string, TimelineByEra>()

  timelineData.forEach((yearData) => {
    const era = getEraForYear(yearData.year)
    if (!era) return

    if (!eraMap.has(era.id)) {
      eraMap.set(era.id, {
        era,
        years: [],
        eventCount: 0,
      })
    }

    const eraData = eraMap.get(era.id)!
    eraData.years.push(yearData)
    eraData.eventCount += yearData.events.length
  })

  return Array.from(eraMap.values())
}

export function getEventsForEra(timelineData: TimelineYear[], eraId: string): TimelineEvent[] {
  const events: TimelineEvent[] = []

  timelineData.forEach((yearData) => {
    const era = getEraForYear(yearData.year)
    if (era?.id === eraId) {
      events.push(...yearData.events)
    }
  })

  return events
}

export function searchEvents(timelineData: TimelineYear[], query: string): TimelineEvent[] {
  const lowerQuery = query.toLowerCase()
  const results: TimelineEvent[] = []

  timelineData.forEach((yearData) => {
    yearData.events.forEach((event) => {
      const matchesTitle = event.title.toLowerCase().includes(lowerQuery)
      const matchesDescription = event.description.toLowerCase().includes(lowerQuery)
      const matchesTags = event.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      const matchesEntities = event.entities.some((entity) => entity.toLowerCase().includes(lowerQuery))

      if (matchesTitle || matchesDescription || matchesTags || matchesEntities) {
        results.push(event)
      }
    })
  })

  return results
}
