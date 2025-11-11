"use client"

import { useState } from "react"
import type { Event } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventCardProps {
  event: Event
  isRead?: boolean
  isSaved?: boolean
  onToggleSave?: (eventId: string) => void
  onMarkRead?: (eventId: string, year: number) => void
  onEntityClick?: (entityId: string) => void
}

export function EventCard({
  event,
  isRead = false,
  isSaved = false,
  onToggleSave,
  onMarkRead,
  onEntityClick,
}: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded && !isRead && onMarkRead) {
      onMarkRead(event.id, event.year)
    }
  }

  const importanceColors = {
    high: "border-l-primary",
    medium: "border-l-chart-2",
    low: "border-l-muted-foreground/30",
  }

  return (
    <Card
      className={cn(
        "border-l-4 transition-all duration-200",
        "hover:shadow-lg hover:scale-[1.01] hover:border-l-primary/80",
        "focus-within:shadow-lg focus-within:scale-[1.01] focus-within:ring-2 focus-within:ring-primary/20",
        importanceColors[event.importance],
        isRead && "opacity-75",
      )}
      tabIndex={0}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs font-mono">
                {event.date}
              </Badge>
              {event.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <h3 className="text-base font-semibold leading-tight text-balance">{event.title}</h3>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => onToggleSave?.(event.id)}>
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-current text-primary")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className={cn("text-sm text-muted-foreground leading-relaxed", !isExpanded && "line-clamp-2")}>
          {event.description}
        </p>

        {event.entities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.entities.map((entity) => (
              <Button
                key={entity}
                variant="outline"
                size="sm"
                className="h-6 text-xs bg-transparent"
                onClick={() => onEntityClick?.(entity)}
              >
                @{entity}
              </Button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={handleExpand} className="text-xs">
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show more
              </>
            )}
          </Button>

          {event.sources && event.sources.length > 0 && (
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <a href={event.sources[0]} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Source
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
