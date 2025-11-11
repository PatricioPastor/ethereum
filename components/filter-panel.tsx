"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Filter, X } from "lucide-react"
import { themes } from "@/lib/theme-data"

export interface FilterState {
  tags: string[]
  importance: ("low" | "medium" | "high")[]
  yearRange: [number, number]
}

interface FilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  minYear: number
  maxYear: number
}

export function FilterPanel({ filters, onFiltersChange, minYear, maxYear }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleTagToggle = (tagId: string) => {
    const newTags = filters.tags.includes(tagId) ? filters.tags.filter((t) => t !== tagId) : [...filters.tags, tagId]
    onFiltersChange({ ...filters, tags: newTags })
  }

  const handleImportanceToggle = (level: "low" | "medium" | "high") => {
    const newImportance = filters.importance.includes(level)
      ? filters.importance.filter((i) => i !== level)
      : [...filters.importance, level]
    onFiltersChange({ ...filters, importance: newImportance })
  }

  const handleClearFilters = () => {
    onFiltersChange({
      tags: [],
      importance: [],
      yearRange: [minYear, maxYear],
    })
  }

  const activeFilterCount = filters.tags.length + filters.importance.length

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent" aria-label="Open filters">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent aria-label="Filter options">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters} aria-label="Clear all filters">
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-6 pr-4">
            {/* Tags Filter */}
            <div>
              <h3 className="font-semibold mb-3">Themes</h3>
              <div className="space-y-2">
                {themes.map((theme) => (
                  <div key={theme.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${theme.id}`}
                      checked={filters.tags.includes(theme.id)}
                      onCheckedChange={() => handleTagToggle(theme.id)}
                    />
                    <Label htmlFor={`tag-${theme.id}`} className="text-sm cursor-pointer flex items-center gap-2">
                      <span>{theme.icon}</span>
                      {theme.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Importance Filter */}
            <div>
              <h3 className="font-semibold mb-3">Importance</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="importance-high"
                    checked={filters.importance.includes("high")}
                    onCheckedChange={() => handleImportanceToggle("high")}
                  />
                  <Label htmlFor="importance-high" className="text-sm cursor-pointer">
                    High
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="importance-medium"
                    checked={filters.importance.includes("medium")}
                    onCheckedChange={() => handleImportanceToggle("medium")}
                  />
                  <Label htmlFor="importance-medium" className="text-sm cursor-pointer">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="importance-low"
                    checked={filters.importance.includes("low")}
                    onCheckedChange={() => handleImportanceToggle("low")}
                  />
                  <Label htmlFor="importance-low" className="text-sm cursor-pointer">
                    Low
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
