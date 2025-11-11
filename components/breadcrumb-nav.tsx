"use client"

import { ChevronRight } from "lucide-react"
import type { Era } from "@/lib/era-data"

interface BreadcrumbNavProps {
  era?: Era
  year?: number
  eventTitle?: string
}

export function BreadcrumbNav({ era, year, eventTitle }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <span className="hover:text-foreground transition-colors cursor-pointer">Timeline</span>

      {era && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-foreground transition-colors cursor-pointer">{era.nameEs}</span>
        </>
      )}

      {year && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-foreground transition-colors cursor-pointer">{year}</span>
        </>
      )}

      {eventTitle && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate max-w-md">{eventTitle}</span>
        </>
      )}
    </nav>
  )
}
