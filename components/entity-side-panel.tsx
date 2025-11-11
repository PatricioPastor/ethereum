"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, X } from "lucide-react"
import { timelineData } from "@/lib/timeline-data"
import type { Event } from "@/lib/types"

interface EntitySidePanelProps {
  entityId: string | null
  onClose: () => void
}

export function EntitySidePanel({ entityId, onClose }: EntitySidePanelProps) {
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([])

  useEffect(() => {
    if (!entityId) {
      setRelatedEvents([])
      return
    }

    // Find all events mentioning this entity
    const events: Event[] = []
    for (const group of timelineData) {
      for (const event of group.events) {
        if (event.entities.includes(entityId)) {
          events.push(event)
        }
      }
    }
    setRelatedEvents(events)
  }, [entityId])

  if (!entityId) return null

  const twitterUrl = `https://twitter.com/${entityId}`

  return (
    <Sheet open={!!entityId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg" aria-label="Entity details panel">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-2xl">@{entityId}</SheetTitle>
              <SheetDescription>Argentine crypto ecosystem contributor</SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${entityId} on Twitter`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Twitter
              </a>
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center justify-between">
              <span>Related Events</span>
              <Badge variant="secondary">{relatedEvents.length}</Badge>
            </h3>

            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-4 pr-4">
                {relatedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        {event.date}
                      </Badge>
                      {event.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h4 className="font-medium text-sm mb-2 leading-tight">{event.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                  </div>
                ))}

                {relatedEvents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No related events found</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
