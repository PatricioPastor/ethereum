import type { ProgressState } from "./types"

const STORAGE_KEY = "crypto-timeline-progress"

export function getProgress(): ProgressState {
  if (typeof window === "undefined") {
    return { readEvents: [], savedEvents: [] }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("[v0] Failed to load progress:", error)
  }

  return { readEvents: [], savedEvents: [] }
}

export function saveProgress(progress: ProgressState): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error("[v0] Failed to save progress:", error)
  }
}

export function markEventAsRead(eventId: string, year: number): void {
  const progress = getProgress()
  if (!progress.readEvents.includes(eventId)) {
    progress.readEvents.push(eventId)
    progress.lastReadEventId = eventId
    progress.lastReadYear = year
    saveProgress(progress)
  }
}

export function toggleSaveEvent(eventId: string): boolean {
  const progress = getProgress()
  const index = progress.savedEvents.indexOf(eventId)

  if (index > -1) {
    progress.savedEvents.splice(index, 1)
    saveProgress(progress)
    return false
  } else {
    progress.savedEvents.push(eventId)
    saveProgress(progress)
    return true
  }
}

export function getYearProgress(year: number, totalEvents: number): number {
  const progress = getProgress()
  const readCount = progress.readEvents.filter((id) => id.includes(`-${year}-`)).length
  return totalEvents > 0 ? (readCount / totalEvents) * 100 : 0
}

export function getSavedEvents(): string[] {
  const progress = getProgress()
  return progress.savedEvents
}
