"use client"

import { useState } from "react"
import { notFound } from 'next/navigation'
import { themes } from "@/lib/theme-data"
import { timelineData } from "@/lib/timeline-data"
import { TimelineHeader } from "@/components/timeline-header"
import { EventCard } from "@/components/event-card"
import { EntitySidePanel } from "@/components/entity-side-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'

export default function ClientThemePage({ params }: { params: { theme: string } }) {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const themeInfo = themes.find((t) => t.id === params.theme)

  if (!themeInfo) {
    notFound()
  }

  // Filter events by theme
  const filteredYearGroups = timelineData
    .map((group) => ({
      ...group,
      events: group.events.filter((event) => event.tags.includes(themeInfo.id)),
    }))
    .filter((group) => group.events.length > 0)

  const totalEvents = filteredYearGroups.reduce((sum, group) => sum + group.events.length, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <TimelineHeader />

      <main className="flex-1">
        <div className="container max-w-4xl px-4 py-8">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/temas">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a temas
              </Link>
            </Button>

            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">{themeInfo.icon}</div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{themeInfo.name}</h1>
                <p className="text-lg text-muted-foreground">{themeInfo.description}</p>
              </div>
            </div>

            <Badge variant="secondary" className="text-sm">
              {totalEvents} eventos encontrados
            </Badge>
          </div>

          <div className="space-y-12">
            {filteredYearGroups.map((group) => (
              <section key={group.year}>
                <div className="sticky top-16 z-40 bg-background/95 backdrop-blur py-4 mb-6 border-b border-border">
                  <h2 className="text-3xl font-bold text-primary">{group.year}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {group.events.length} evento{group.events.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="space-y-4">
                  {group.events.map((event) => (
                    <EventCard key={event.id} event={event} onEntityClick={setSelectedEntity} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <EntitySidePanel entityId={selectedEntity} onClose={() => setSelectedEntity(null)} />
    </div>
  )
}
