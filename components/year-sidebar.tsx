"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, Bookmark, ArrowLeft } from "lucide-react"
import type { FilterState } from "@/components/filter-panel"

interface YearSidebarProps {
  years: number[]
  currentYear?: number
  onYearClick: (year: number) => void
  eventsPerYear?: Record<number, number>
  onSearchChange: (query: string) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  variant?: "sidebar" | "overlay"
  className?: string
}

const KEY_MILESTONES: Record<number, string> = {
  2008: "Bitcoin Whitepaper",
  2009: "Bitcoin Network Launch",
  2013: "Ethereum Whitepaper",
  2014: "Casa Voltaire",
  2015: "Ethereum Frontier",
  2016: "OpenZeppelin Contracts",
  2017: "Kleros & MANA ICO",
  2018: "ETHBuenosAires",
  2019: "POAP & DevCon V",
  2020: "Hardhat & DeFi Summer",
  2021: "Proof of Humanity",
  2022: "Ethereum Merge",
  2023: "The Red Guild",
  2024: "Aleph & QuarkID",
  2025: "Ethrex Launch",
}

export function YearSidebar({
  years,
  currentYear,
  onYearClick,
  eventsPerYear = {},
  onSearchChange,
  variant = "sidebar",
  className,
}: YearSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const currentYearRef = useRef<HTMLButtonElement>(null)
  const accent = "#7ea8f9"

  const displayYears = [...years].sort((a, b) => a - b)

  const containerClasses = cn(
    "flex min-h-0 flex-col bg-slate-50 text-slate-900",
    variant === "sidebar"
      ? "hidden w-72 border-r border-slate-200 md:flex"
      : "flex w-full border-b border-slate-200",
    className,
  )

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange(value)
  }

  useEffect(() => {
    if (currentYearRef.current && scrollAreaRef.current) {
      currentYearRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [currentYear])

  return (
    <aside className={containerClasses} style={{ ["--accent" as any]: accent }}>
      <div className="space-y-3 border-b border-slate-200 bg-slate-50 px-5 py-5">
        <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[-0.04em] text-slate-500">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[-0.04em] text-slate-700 hover:bg-[color:var(--accent)] hover:text-white"
          >
            <Link href="/" aria-label="Go back home">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
          {variant === "sidebar" && <span>Timeline</span>}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-10 rounded-full border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-[color:var(--accent)] hover:text-white"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
        <div className="relative px-4 py-6">
          <div className="space-y-3">
            {displayYears.map((year) => {
              const isActive = year === currentYear
              const isPassed = currentYear ? year < currentYear : false
              const count = eventsPerYear[year]
              const milestone = KEY_MILESTONES[year]

              return (
                <div key={year} className="relative">
                  {/* Punto */}
                  <div
                    className={cn(
                      "absolute left-[28px] top-1/2 z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300 ease-out",
                      isActive && "border-slate-400 bg-white",
                      isPassed && !isActive && "border-slate-300 bg-white",
                      !isPassed && !isActive && "border-slate-200 bg-white",
                    )}
                  />

                  {/* Boton */}
                  <Button
                    ref={isActive ? currentYearRef : null}
                    variant="ghost"
                    className={cn(
                      "group relative w-full justify-start rounded-2xl border border-transparent pl-[44px] pr-3 py-4 text-left text-sm uppercase tracking-[-0.02em] transition-all duration-200 hover:bg-slate-100",
                      isActive && "text-[color:var(--accent)]",
                    )}
                    type="button"
                    aria-current={isActive ? "date" : undefined}
                    onClick={() => onYearClick(year)}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3 text-xs tracking-[-0.02em]">
                        <span
                          className={cn(
                            "font-body-medium text-base tabular-nums transition-colors",
                            isActive
                              ? "text-[color:var(--accent)]"
                              : isPassed
                                ? "text-slate-500"
                                : "text-slate-400",
                          )}
                        >
                          {year}
                        </span>
                        {typeof count === "number" && count > 0 && (
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full bg-[#f5f5f5] px-2 py-0.5 text-[10px] font-medium text-[#444]",
                              isActive && "bg-[color:var(--accent)]/10 text-[color:var(--accent)]",
                            )}
                          >
                            {count}
                          </span>
                        )}
                      </div>
                      {milestone && (
                        <div
                          className={cn(
                            "text-[11px] leading-tight text-slate-500 transition-colors",
                            isActive && "text-[color:var(--accent)]",
                          )}
                        >
                          {milestone}
                        </div>
                      )}
                    </div>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}
