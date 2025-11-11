"use client"

import { Button } from "@/components/ui/button"
import { List, BookOpen, LayoutGrid } from "lucide-react"

export type ViewMode = "timeline" | "continuous" | "grid"

interface ViewModeToggleProps {
  mode: ViewMode
  onModeChange: (mode: ViewMode) => void
}

export function ViewModeToggle({ mode, onModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={mode === "timeline" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onModeChange("timeline")}
        className="gap-2"
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">Timeline</span>
      </Button>

      <Button
        variant={mode === "continuous" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onModeChange("continuous")}
        className="gap-2"
      >
        <BookOpen className="h-4 w-4" />
        <span className="hidden sm:inline">Continuo</span>
      </Button>

      <Button
        variant={mode === "grid" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onModeChange("grid")}
        className="gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Resumen</span>
      </Button>
    </div>
  )
}
