"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Link2 } from "lucide-react"
import type { TimelineEvent } from "@/lib/data-parser"

interface RelationsDrawerProps {
  event: TimelineEvent | null
  relatedEvents: TimelineEvent[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onEventClick: (year: number, event: TimelineEvent) => void
}

export function RelationsDrawer({ event, relatedEvents, open, onOpenChange, onEventClick }: RelationsDrawerProps) {
  if (!event) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg" aria-label="Related events panel">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Related Events
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2 line-clamp-2">{event.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              {event.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">
              {relatedEvents.length} related {relatedEvents.length === 1 ? "event" : "events"}
            </h4>

            <div className="space-y-3">
              {relatedEvents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No related events found</p>
              )}

              {relatedEvents.map((relatedEvent) => (
                <button
                  key={relatedEvent.title}
                  onClick={() => {
                    const yearData = require("@/lib/timeline-data").timelineData.find((y: any) =>
                      y.events.includes(relatedEvent),
                    )
                    if (yearData) {
                      onEventClick(yearData.year, relatedEvent)
                      onOpenChange(false)
                    }
                  }}
                  className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                  aria-label={`View event: ${relatedEvent.title}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{relatedEvent.date || "No date"}</span>
                      </div>

                      <h5 className="font-medium text-sm mb-1 line-clamp-2">{relatedEvent.title}</h5>

                      <p className="text-xs text-muted-foreground line-clamp-2">{relatedEvent.description}</p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {relatedEvent.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
