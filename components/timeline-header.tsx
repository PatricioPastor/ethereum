"use client"

import { Search, Menu, Bookmark, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FilterState } from "./filter-panel"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface TimelineHeaderProps {
  onSearchChange?: (query: string) => void
  onMenuClick?: () => void
  filters?: FilterState
  onFiltersChange?: (filters: FilterState) => void
  minYear?: number
  maxYear?: number
  showFilters?: boolean
}

export function TimelineHeader({ onSearchChange, onMenuClick }: TimelineHeaderProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          {!isHomePage && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isHomePage && (
            <div className="relative hidden md:block">
              <div
                className={`flex items-center transition-all duration-300 ease-in-out ${
                  isSearchExpanded ? "w-64" : "w-10"
                }`}
              >
                {isSearchExpanded ? (
                  <>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search events..."
                      className="pl-9"
                      onChange={(e) => onSearchChange?.(e.target.value)}
                      onBlur={() => setIsSearchExpanded(false)}
                      autoFocus
                    />
                  </>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => setIsSearchExpanded(true)} className="h-10 w-10">
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          )}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/guardados">
              <Bookmark className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
