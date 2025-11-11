"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Tag, User, ArrowRight } from "lucide-react"
import { timelineData } from "@/lib/timeline-data"
import { searchEvents } from "@/lib/timeline-utils"
import type { TimelineEvent } from "@/lib/data-parser"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEventSelect: (year: number, event: TimelineEvent) => void
}

export function SearchModal({ open, onOpenChange, onEventSelect }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchEvents(timelineData, query).slice(0, 10)
  }, [query])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault()
        const event = results[selectedIndex]
        const yearData = timelineData.find((y) => y.events.includes(event))
        if (yearData) {
          onEventSelect(yearData.year, event)
          onOpenChange(false)
          setQuery("")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, results, selectedIndex, onEventSelect, onOpenChange])

  const handleResultClick = (event: TimelineEvent) => {
    const yearData = timelineData.find((y) => y.events.includes(event))
    if (yearData) {
      onEventSelect(yearData.year, event)
      onOpenChange(false)
      setQuery("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, people, projects..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            autoFocus
            aria-label="Search timeline events"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {!query.trim() && (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Search by title, description, people or tags</p>
              <p className="text-xs mt-2">Use ↑↓ to navigate and Enter to select</p>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              {results.map((event, index) => {
                const yearData = timelineData.find((y) => y.events.includes(event))
                const isSelected = index === selectedIndex

                return (
                  <button
                    key={`${yearData?.year}-${event.title}`}
                    onClick={() => handleResultClick(event)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      isSelected ? "bg-muted" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{yearData?.year}</span>
                          {event.date && <span className="text-xs text-muted-foreground">• {event.date}</span>}
                        </div>

                        <h4 className="font-medium text-sm mb-1 line-clamp-1">{event.title}</h4>

                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{event.description}</p>

                        <div className="flex items-center gap-2 flex-wrap">
                          {event.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                            >
                              <Tag className="h-2.5 w-2.5" />
                              {tag}
                            </span>
                          ))}
                          {event.entities.slice(0, 2).map((entity) => (
                            <span
                              key={entity}
                              className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
                            >
                              <User className="h-2.5 w-2.5" />
                              {entity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {isSelected && <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t bg-muted/50 text-xs text-muted-foreground flex items-center justify-between">
          <span>{results.length > 0 && `${results.length} result${results.length !== 1 ? "s" : ""}`}</span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">↑↓ navigate</span>
            <span className="hidden sm:inline">Enter select</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
