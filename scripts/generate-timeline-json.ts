import { writeFileSync } from "fs"
import { join } from "path"
import { timelineData } from "../lib/timeline-data"
import { ERAS } from "../lib/era-data"

// Generate timeline JSON with all events
const data = {
  metadata: {
    generatedAt: new Date().toISOString(),
    totalEvents: timelineData.reduce((sum, group) => sum + group.events.length, 0),
    yearRange: {
      start: 2008,
      end: 2025,
    },
  },
  eras: ERAS.map((era) => ({
    id: era.id,
    name: era.name,
    nameEs: era.nameEs,
    description: era.description,
    descriptionEs: era.descriptionEs,
    yearStart: era.yearStart,
    yearEnd: era.yearEnd,
  })),
  timeline: timelineData.map((yearGroup) => ({
    year: yearGroup.year,
    eraId: ERAS.find((era) => yearGroup.year >= era.yearStart && yearGroup.year <= era.yearEnd)?.id,
    events: yearGroup.events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      year: event.year,
      month: event.month,
      entities: event.entities,
      tags: event.tags,
      importance: event.importance,
    })),
  })),
}

// Write to public folder
const outputPath = join(process.cwd(), "public", "timeline-data.json")
writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8")

console.log(`✅ Timeline JSON generated at: ${outputPath}`)
console.log(`📊 Total events: ${data.metadata.totalEvents}`)
console.log(`📅 Year range: ${data.metadata.yearRange.start} - ${data.metadata.yearRange.end}`)
console.log(`🎯 Eras: ${data.eras.length}`)
