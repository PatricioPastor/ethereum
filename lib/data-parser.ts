import type { Event, Entity, YearGroup } from "./types"

export type TimelineEvent = Event
export type TimelineYear = YearGroup

// Parse the raw text data into structured events
export function parseTimelineData(rawText: string): YearGroup[] {
  const lines = rawText.split("\n").filter((line) => line.trim())
  const yearGroups: Map<number, Event[]> = new Map()

  let currentYear = 2008
  let eventId = 0

  for (const line of lines) {
    // Check if line is a year header
    const yearMatch = line.match(/^(\d{4})(?:-(\d{4}))?$/)
    if (yearMatch) {
      currentYear = Number.parseInt(yearMatch[1])
      if (!yearGroups.has(currentYear)) {
        yearGroups.set(currentYear, [])
      }
      continue
    }

    // Parse event line (starts with *)
    if (line.startsWith("*")) {
      const event = parseEventLine(line, currentYear, eventId++)
      if (event) {
        // Use the event's actual year, not the section header year
        const eventYear = event.year
        const events = yearGroups.get(eventYear) || []
        events.push(event)
        yearGroups.set(eventYear, events)
      }
    }
  }

  // Convert to sorted array
  return Array.from(yearGroups.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, events]) => ({ year, events }))
}

function parseEventLine(line: string, year: number, id: number): Event | null {
  // Remove leading asterisk and trim
  const content = line.substring(1).trim()

  // Extract date if present
  let dateStr = ""
  let month: number | undefined
  let actualYear = year
  const dateMatch = content.match(/^([A-Za-z]+(?:\s+\d{4})?|Late|Mid|Early|Summer)\s*(\d{4})?:/)

  if (dateMatch) {
    dateStr = dateMatch[0].replace(":", "").trim()

    // Check if there's a specific year mentioned in the date
    const yearInDate = dateMatch[2] || dateMatch[1]?.match(/\d{4}/)?.[0]
    if (yearInDate) {
      actualYear = Number.parseInt(yearInDate)
    }

    const monthMap: Record<string, number> = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    }

    for (const [monthName, monthNum] of Object.entries(monthMap)) {
      if (dateStr.includes(monthName)) {
        month = monthNum
        break
      }
    }
  }

  // If no date match, check if the line starts with just a year
  if (!dateMatch && content.match(/^(\d{4}):/)) {
    const yearMatch = content.match(/^(\d{4}):/)
    if (yearMatch) {
      actualYear = Number.parseInt(yearMatch[1])
      dateStr = yearMatch[1]
    }
  }

  // Extract description (everything after date)
  const description = dateStr ? content.substring(content.indexOf(":") + 1).trim() : content

  // Extract entities (Twitter handles)
  const entities: string[] = []
  const twitterHandles = description.match(/@\w+/g) || []
  entities.push(...twitterHandles.map((h) => h.substring(1)))

  // Extract tags based on keywords
  const tags = extractTags(description)

  // Determine importance
  const importance = determineImportance(description, tags)

  return {
    id: `event-${id}`,
    date: dateStr || `${actualYear}`,
    year: actualYear,
    month,
    title: extractTitle(description),
    description,
    entities,
    tags,
    importance,
  }
}

function extractTitle(description: string): string {
  // Take first sentence or first 100 chars
  const firstSentence = description.split(/[.!?]/)[0]
  return firstSentence.length > 100 ? firstSentence.substring(0, 97) + "..." : firstSentence
}

function extractTags(text: string): string[] {
  const tags: string[] = []
  const lowerText = text.toLowerCase()

  const tagKeywords: Record<string, string[]> = {
    defi: ["defi", "lending", "liquidity", "yield", "stablecoin", "dai", "maker"],
    nfts: ["nft", "poap", "decentraland", "metaverse", "collectible"],
    security: ["audit", "security", "vulnerability", "hack", "safe"],
    governance: ["dao", "governance", "voting", "proposal"],
    infrastructure: ["protocol", "network", "blockchain", "ethereum", "bitcoin", "layer"],
    education: ["education", "hackathon", "conference", "meetup", "workshop", "university"],
    regulation: ["regulation", "law", "legal", "government", "tax"],
    community: ["community", "meetup", "conference", "event"],
  }

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      tags.push(tag)
    }
  }

  return [...new Set(tags)]
}

function determineImportance(description: string, tags: string[]): "low" | "medium" | "high" {
  const lowerText = description.toLowerCase()

  // High importance indicators
  if (
    lowerText.includes("first") ||
    lowerText.includes("launch") ||
    lowerText.includes("founded") ||
    lowerText.includes("mainnet") ||
    tags.length >= 3
  ) {
    return "high"
  }

  // Medium importance
  if (lowerText.includes("million") || lowerText.includes("ico") || tags.length >= 2) {
    return "medium"
  }

  return "low"
}

// Extract unique entities from all events
export function extractEntities(yearGroups: YearGroup[]): Entity[] {
  const entityMap = new Map<string, Entity>()

  for (const group of yearGroups) {
    for (const event of group.events) {
      for (const handle of event.entities) {
        if (!entityMap.has(handle)) {
          entityMap.set(handle, {
            id: handle,
            name: `@${handle}`,
            type: "person",
            twitter: handle,
          })
        }
      }
    }
  }

  return Array.from(entityMap.values())
}
