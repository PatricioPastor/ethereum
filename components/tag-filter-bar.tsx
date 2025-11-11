"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { themes } from "@/lib/theme-data"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface TagFilterBarProps {
  selectedTags: string[]
  onTagToggle: (tagId: string) => void
  onClearAll: () => void
}

export function TagFilterBar({ selectedTags, onTagToggle, onClearAll }: TagFilterBarProps) {
  const hasFilters = selectedTags.length > 0

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Filter by theme</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="h-7 text-xs" aria-label="Clear all filters">
            <X className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {themes.map((theme) => {
            const isSelected = selectedTags.includes(theme.id)
            return (
              <Badge
                key={theme.id}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80 transition-colors px-3 py-1.5 text-sm"
                onClick={() => onTagToggle(theme.id)}
                role="button"
                aria-pressed={isSelected}
                aria-label={`Filter by ${theme.name}`}
              >
                <span className="mr-1.5">{theme.icon}</span>
                {theme.name}
                {isSelected && <X className="ml-1.5 h-3 w-3" />}
              </Badge>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {hasFilters && (
        <div className="mt-3 text-xs text-muted-foreground">
          {selectedTags.length} active {selectedTags.length === 1 ? "filter" : "filters"}
        </div>
      )}
    </div>
  )
}
