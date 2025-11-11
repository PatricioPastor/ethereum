"use client"

import { Button } from "@/components/ui/button"
import { List, BookOpen } from "lucide-react"

interface ReadingModeToggleProps {
  mode: "timeline" | "continuous"
  onModeChange: (mode: "timeline" | "continuous") => void
}

export function ReadingModeToggle({ mode, onModeChange }: ReadingModeToggleProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg" role="radiogroup" aria-label="Reading mode">
      <Button
        variant={mode === "timeline" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("timeline")}
        className="gap-2"
        role="radio"
        aria-checked={mode === "timeline"}
        aria-label="Timeline view mode"
      >
        <List className="h-4 w-4" />
        Timeline
      </Button>
      <Button
        variant={mode === "continuous" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("continuous")}
        className="gap-2"
        role="radio"
        aria-checked={mode === "continuous"}
        aria-label="Continuous reading mode"
      >
        <BookOpen className="h-4 w-4" />
        Continuous
      </Button>
    </div>
  )
}
