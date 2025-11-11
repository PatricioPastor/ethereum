"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo } from "react"

interface NavigationSidebarProps {
  currentYear: number
  eventCount: number
  totalYears: number
  onPreviousYear: () => void
  onNextYear: () => void
  canGoPrevious: boolean
  canGoNext: boolean
  readingMode?: "timeline" | "continuous"
}

export function NavigationSidebar({
  currentYear,
  eventCount,
  totalYears,
  onPreviousYear,
  onNextYear,
  canGoPrevious,
  canGoNext,
  readingMode = "timeline",
}: NavigationSidebarProps) {
  const eventCountText = useMemo(() => `${eventCount} event${eventCount !== 1 ? "s" : ""}`, [eventCount])

  return (
    <aside
      className="hidden lg:flex w-48 border-l border-border/30 bg-card/30 flex-col sticky top-0 h-screen"
      role="complementary"
      aria-label="Year navigation"
    >
      <div className="p-4 border-b border-border/30">
        <div className="text-xs text-muted-foreground mb-1 opacity-70">Current Year</div>
        <div className="text-3xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent mb-1">
          {currentYear}
        </div>
        <div className="text-xs text-muted-foreground opacity-70">{eventCountText}</div>
      </div>

      <div className="flex-1 p-3 space-y-3">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2 opacity-70">YEAR NAVIGATION</div>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent text-sm hover:bg-primary/10 border-border/30"
              onClick={onPreviousYear}
              disabled={!canGoPrevious}
              aria-label="Previous year (Left arrow or H)"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Year
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent text-sm hover:bg-primary/10 border-border/30"
              onClick={onNextYear}
              disabled={!canGoNext}
              aria-label="Next year (Right arrow or L)"
            >
              <ChevronRight className="h-4 w-4 mr-2" />
              Next Year
            </Button>
          </div>
        </div>

        <div className="pt-3 border-t border-border/30">
          <div className="text-xs text-muted-foreground opacity-70">
            Viewing {currentYear} of {totalYears} years
          </div>
          <div className="text-xs text-muted-foreground mt-2 opacity-70">Use ← → or H/L keys</div>
          <div className="text-xs text-muted-foreground mt-1 opacity-70">Shift + ← → for eras</div>
        </div>
      </div>
    </aside>
  )
}
