"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft, ChevronDown } from "lucide-react"
import type { TimelineEvent, TimelineYear } from "@/lib/data-parser"

interface YearSidebarProps {
  years: number[]
  currentYear?: number
  onYearClick: (year: number) => void
  onSearchChange: (query: string) => void
  yearGroups?: TimelineYear[]
  onEventSelect?: (year: number, event: TimelineEvent) => void
  variant?: "sidebar" | "overlay"
  className?: string
}

export function YearSidebar({
  years,
  currentYear,
  onYearClick,
  onSearchChange,
  yearGroups,
  onEventSelect,
  variant = "sidebar",
  className,
}: YearSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set())
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const currentYearRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const accent = "#FF5728"

  const displayYears = [...years].sort((a, b) => a - b)

  const eventsByYear = useMemo(() => {
    if (!yearGroups) return {}
    return yearGroups.reduce<Record<number, TimelineEvent[]>>((acc, group) => {
      acc[group.year] = group.events
      return acc
    }, {})
  }, [yearGroups])

  const getYearStory = (events: TimelineEvent[]) => {
    if (events.length === 0) return ""
    const joined = events
      .slice(0, 3)
      .map((event) => event.description.replace(/\s+/g, " ").trim())
      .join(" ")
    const snippet = joined.length > 380 ? `${joined.slice(0, 380).trim()}…` : joined
    return snippet
  }

  const containerClasses = cn(
    "flex min-h-0 flex-col bg-[#F2F3E1] text-[#191919]",
    variant === "sidebar"
      ? "hidden w-72 border-r border-[rgba(0,0,0,0.08)] md:flex"
      : "flex w-full border-b border-[rgba(0,0,0,0.08)]",
    className,
  )

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange(value)
  }

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => {
      const next = new Set(prev)
      if (next.has(year)) {
        next.delete(year)
      } else {
        next.add(year)
      }
      return next
    })
  }

  useEffect(() => {
    if (currentYearRef.current && scrollAreaRef.current) {
      currentYearRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [currentYear])

  // Prevent autofocus on mobile when sidebar opens
  useEffect(() => {
    if (variant === "overlay" && searchInputRef.current) {
      // Blur immediately if focused on mount (mobile only)
      const isMobile = window.innerWidth < 768
      if (isMobile) {
        // Small delay to ensure any autofocus has happened
        const timeoutId = setTimeout(() => {
          if (document.activeElement === searchInputRef.current) {
            searchInputRef.current?.blur()
          }
        }, 50)
        return () => clearTimeout(timeoutId)
      }
    }
  }, [variant])

  return (
    <aside className={containerClasses} style={{ ["--accent" as any]: accent }}>
      <div className="space-y-3 border-b border-[rgba(0,0,0,0.08)] bg-[#F2F3E1] px-5 py-5">
        <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0] text-[#7f796f]">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 rounded-full border-none bg-[#FF5728] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0] text-white shadow-[0_12px_30px_rgba(255,87,40,0.35)] transition hover:scale-105 hover:bg-[#e44d21]"
          >
            <Link href="/" aria-label="Go back home">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a09889]" />
            <Input
              ref={searchInputRef}
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={(e) => {
                // Only allow focus on mobile when user explicitly taps
                if (variant === "overlay" && window.innerWidth < 768) {
                  // Focus is allowed when user taps, this is fine
                }
              }}
              className="h-10 rounded-full border border-[rgba(0,0,0,0.08)] bg-[#FFFDF7] pl-9 pr-3 text-sm text-[#191919] placeholder:text-[#a09889] focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#FF5728]/40"
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
        <div className="relative px-4 py-6">
          <div className="mb-6 text-[10px] font-semibold uppercase tracking-[0] text-[#a09889]">Timeline</div>
          <div className="space-y-1.5">
            {displayYears.map((year) => {
              const isActive = year === currentYear
              const isExpanded = expandedYears.has(year)
              const yearEvents = eventsByYear[year] ?? []

              return (
                <div key={year} className="relative">
                  <div className={cn("flex flex-col rounded-2xl px-4 py-2 transition", !isExpanded && "hover:bg-[#FFFDF7]")}>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "relative flex flex-1 items-center gap-3 rounded-2xl py-2 pl-4 pr-3 text-left",
                          isActive ? "text-[color:var(--accent)]" : "text-[#7f796f]",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-[#FFFDF7] transition",
                            isActive ? "border-none bg-[color:var(--accent)]" : "border-[rgba(0,0,0,0.2)]",
                          )}
                        />
                        <button
                          ref={isActive ? currentYearRef : null}
                          type="button"
                          onClick={() => onYearClick(year)}
                          className="flex flex-1 items-center justify-between text-left"
                          aria-current={isActive ? "date" : undefined}
                        >
                          <span
                            className={cn(
                              "text-base font-normal tabular-nums tracking-[0]",
                              isActive ? "text-[#191919]" : "text-[#4d463d]",
                            )}
                          >
                            {year}
                          </span>
                          {/* Count intentionally hidden to keep list minimal */}
                        </button>
                      </div>
                      {yearEvents.length > 1 && (
                        <button
                          type="button"
                          aria-label={isExpanded ? "Collapse events" : "Expand events"}
                          aria-expanded={isExpanded}
                          onClick={(event) => {
                            event.stopPropagation()
                            toggleYear(year)
                          }}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-[#7f796f] transition",
                            !isExpanded && "hover:bg-[#FFFDF7]",
                            isExpanded && "bg-[#191919] text-white hover:bg-[#191919]",
                          )}
                        >
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isExpanded ? "rotate-180 text-white" : "text-[#7f796f]",
                            )}
                          />
                        </button>
                      )}
                    </div>

                    {isExpanded && yearEvents.length > 0 && (
                      <p className="mt-3 text-sm text-[#564e45] leading-relaxed line-clamp-4">
                        {getYearStory(yearEvents)}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}
