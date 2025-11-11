"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bookmark, Calendar, Tag } from "lucide-react"
import { getTimelineData } from "@/lib/timeline-data"
import { getSavedEvents } from "@/lib/progress-storage"
import { Badge } from "@/components/ui/badge"
import type { TimelineEvent } from "@/lib/types"

export default function GuardadosPage() {
  const [savedEvents, setSavedEvents] = useState<TimelineEvent[]>([])

  useEffect(() => {
    const data = getTimelineData()
    const allEvents = data.flatMap((year) => year.events)
    const savedIds = getSavedEvents()
    const saved = allEvents.filter((event) => savedIds.includes(event.id))
    setSavedEvents(saved)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Bookmark className="w-8 h-8 text-primary" />
            <h1 className="text-5xl font-bold text-balance">Eventos guardados</h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {savedEvents.length === 0
              ? "Aún no has guardado ningún evento. Explora el timeline y guarda los que más te interesen."
              : `Has guardado ${savedEvents.length} evento${savedEvents.length !== 1 ? "s" : ""} para revisar más tarde.`}
          </p>
        </div>

        {savedEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-card border border-border flex items-center justify-center">
              <Bookmark className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-6">No hay eventos guardados todavía</p>
            <Link
              href="/timeline"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
            >
              Explorar Timeline
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedEvents.map((event) => (
              <Link
                key={event.id}
                href={`/hito/${event.id}`}
                className="block p-6 bg-card hover:bg-card/80 border border-border hover:border-primary rounded-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <Badge variant="outline" className="text-primary border-primary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {event.date}
                  </Badge>
                  <Bookmark className="w-5 h-5 text-primary fill-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{event.summary}</p>

                {event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {event.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {event.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{event.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
