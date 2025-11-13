"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { CSSProperties } from "react"
import { YearSidebar } from "@/components/year-sidebar"
import { ContinuousReadingView } from "@/components/continuous-reading-view"
import { EntitySidePanel } from "@/components/entity-side-panel"
import { SearchModal } from "@/components/search-modal"
import { RelationsDrawer } from "@/components/relations-drawer"
import { getEraForYear, ERAS } from "@/lib/era-data"
import { timelineData } from "@/lib/timeline-data"
import type { TimelineEvent } from "@/lib/data-parser"
import { useYears } from "@/hooks/use-years"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { PanelLeft } from "lucide-react"

export default function TimelinePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [yearDrawerOpen, setYearDrawerOpen] = useState(false)
  const viewedEventsRef = useRef<Set<string>>(new Set())
  const [selectedEventForRelations, setSelectedEventForRelations] = useState<TimelineEvent | null>(null)
  const [relationsDrawerOpen, setRelationsDrawerOpen] = useState(false)
  const eraFilterId: string | "all" = "all"
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeYear, setActiveYear] = useState(2008)
  const [activeEraId, setActiveEraId] = useState(() => getEraForYear(2008)?.id ?? ERAS[0].id)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const navigationInProgressRef = useRef(false)
  const hasCollapsedOnceRef = useRef(false)
  const hasNavigatedToEventRef = useRef(false)
  const hasInitializedScrollRef = useRef(false)

  const { years, filteredData } = useYears({
    timelineData,
    eraId: eraFilterId,
    filters: { tags: [], importance: [], yearRange: [2008, 2025] },
    searchQuery,
  })

  const fallbackEra = getEraForYear(activeYear)
  const currentEra = ERAS.find((era) => era.id === activeEraId) ?? fallbackEra

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return
      const { scrollTop } = scrollContainerRef.current
      if (scrollTop > 50) {
        hasCollapsedOnceRef.current = true
        setIsScrolled(true)
      } else {
        hasCollapsedOnceRef.current = false
        setIsScrolled(false)
      }
    }

    const container = scrollContainerRef.current
    container?.addEventListener("scroll", handleScroll)
    return () => container?.removeEventListener("scroll", handleScroll)
  }, [])

  const getRelatedEvents = (event: TimelineEvent): TimelineEvent[] => {
    const allEvents = timelineData.flatMap((group) => group.events)
    return allEvents
      .filter((e) => {
        if (e.title === event.title) return false
        const sharedTags = e.tags.some((tag) => event.tags.includes(tag))
        const sharedEntities = e.entities.some((entity) => event.entities.includes(entity))
        return sharedTags || sharedEntities
      })
      .slice(0, 10)
  }

  const headerScrollPadding = isScrolled ? 140 : 260

  const handleYearClick = useCallback(
    (year: number, options?: { forceCollapse?: boolean; trigger?: "arrow" | "manual" }) => {
      if (navigationInProgressRef.current) return

      navigationInProgressRef.current = true
      setActiveYear(year)

      const firstYear = years[0]
      const shouldExpand = firstYear !== undefined && year === firstYear && !options?.forceCollapse && options?.trigger !== "arrow"

      if (shouldExpand) {
        hasCollapsedOnceRef.current = false
        setIsScrolled(false)
      } else {
        hasCollapsedOnceRef.current = true
        setIsScrolled(true)
      }

      const container = scrollContainerRef.current
      const element = container?.querySelector<HTMLElement>(`[data-year="${year}"]`)
      if (element) {
        if (container) {
          const containerRect = container.getBoundingClientRect()
          const elementRect = element.getBoundingClientRect()
          const currentScroll = container.scrollTop
          const elementOffsetInContainer = elementRect.top - containerRect.top
          const target = currentScroll + elementOffsetInContainer - headerScrollPadding

          container.scrollTo({
            top: Math.max(0, target),
            behavior: "smooth",
          })
        }

        setTimeout(() => {
          const firstCard = element.querySelector<HTMLElement>('[role="article"]')
          firstCard?.focus({ preventScroll: true })
          navigationInProgressRef.current = false
        }, 400)
        return
      }

      navigationInProgressRef.current = false
    },
    [headerScrollPadding, years],
  )

  const handleSearchEventSelect = useCallback(
    (year: number, event: TimelineEvent) => {
      handleYearClick(year, { forceCollapse: true })
      setTimeout(() => {
        const eventElement = document.querySelector(`[data-event-id="${event.id}"]`)
        if (eventElement && scrollContainerRef.current) {
          eventElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 450)
    },
    [handleYearClick],
  )

  const navigateToEvent = useCallback(
    (eventId: string) => {
      const allEvents = timelineData.flatMap((group) => group.events)
      const event = allEvents.find((e) => e.id === eventId)

      if (event) {
        handleSearchEventSelect(event.year, event)
      }
    },
    [handleSearchEventSelect],
  )

  const handleEventView = (eventTitle: string) => {
    viewedEventsRef.current.add(eventTitle)
  }

  const handleShowRelations = (event: TimelineEvent) => {
    setSelectedEventForRelations(event)
    setRelationsDrawerOpen(true)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchModalOpen(true)
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchModalOpen])

  useEffect(() => {
    if (hasNavigatedToEventRef.current) return

    const params = new URLSearchParams(window.location.search)
    const eventId = params.get("event")

    if (eventId) {
      hasNavigatedToEventRef.current = true
      setTimeout(() => {
        navigateToEvent(eventId)
      }, 500)
    }
  }, [navigateToEvent])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const sections = Array.from(container.querySelectorAll<HTMLElement>("[data-year]"))
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (navigationInProgressRef.current) return

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        const current = visible[0]
        if (!current) return

        const yearAttr = (current.target as HTMLElement).dataset.year
        if (!yearAttr) return

        const year = Number(yearAttr)
        if (!Number.isNaN(year) && year !== activeYear) {
          setActiveYear(year)
        }
      },
      {
        root: container,
        rootMargin: `-${headerScrollPadding}px 0px -40% 0px`,
        threshold: [0, 0.1, 0.25, 0.5],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
      observer.disconnect()
    }
  }, [filteredData, activeYear, headerScrollPadding])

  useEffect(() => {
    if (!fallbackEra) return
    setActiveEraId((prev) => (prev === fallbackEra.id ? prev : fallbackEra.id))
  }, [fallbackEra])

  // Only fallback to first year on initial load, not during scrolling
  useEffect(() => {
    if (filteredData.length === 0) return
    if (navigationInProgressRef.current) return

    const hasActiveYear = filteredData.some((group) => group.year === activeYear)
    if (hasActiveYear) return

    const fallbackYear = filteredData[0]?.year
    if (!fallbackYear) return

    // Only navigate if this is initial load (activeYear is still default)
    if (activeYear === 2008) {
      requestAnimationFrame(() => {
        handleYearClick(fallbackYear)
      })
    }
  }, [filteredData, activeYear, handleYearClick])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const sentinels = Array.from(container.querySelectorAll<HTMLElement>("[data-era-sentinel-id]"))
    if (sentinels.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (navigationInProgressRef.current) return

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        const topEntry = visible[0]
        if (!topEntry) return

        const eraId = (topEntry.target as HTMLElement).dataset.eraSentinelId
        if (eraId) {
          setActiveEraId((prev) => (prev === eraId ? prev : eraId))
        }
      },
      {
        root: container,
        threshold: [0, 0.35, 0.65],
        rootMargin: "-25% 0px -60% 0px",
      },
    )

    sentinels.forEach((sentinel) => observer.observe(sentinel))

    return () => {
      sentinels.forEach((sentinel) => observer.unobserve(sentinel))
      observer.disconnect()
    }
  }, [filteredData])

  const relatedEvents = selectedEventForRelations ? getRelatedEvents(selectedEventForRelations) : []
  const accent = "#FF5728"
  const textColor = "#191919"
  const themeStyles = {
    "--accent": accent,
    "--text-color": textColor,
  } as CSSProperties

  // Set initial scroll position to offset the header - only once on mount
  useEffect(() => {
    if (hasInitializedScrollRef.current) return

    const container = scrollContainerRef.current
    if (container && filteredData.length > 0) {
      const firstYearElement = container.querySelector<HTMLElement>(`[data-year="${filteredData[0].year}"]`)
      if (firstYearElement) {
        const headerHeight = isScrolled ? 140 : 260
        const offset = firstYearElement.getBoundingClientRect().top + container.scrollTop - headerHeight
        if (offset < 0) {
          container.scrollTo({ top: Math.abs(offset), behavior: "instant" })
        }
        hasInitializedScrollRef.current = true
      }
    }
  }, [filteredData, isScrolled])

  return (
    <div className="relative min-h-screen bg-[#FFFDF7] text-[color:var(--text-color)]" style={{...themeStyles, overscrollBehavior: 'none'}}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(255,127,80,0.35),transparent_70%)]" />
        <div className="absolute inset-y-0 right-0 w-64 bg-[linear-gradient(180deg,rgba(255,127,80,0.12)_0%,transparent_55%,rgba(255,127,80,0.16)_100%)]" />
      </div>
      <div className="flex h-screen overflow-hidden bg-[#FFFDF7] text-[#191919]" style={{overscrollBehavior: 'none'}}>
        <YearSidebar
          years={years}
          currentYear={activeYear}
          onYearClick={(year) => handleYearClick(year, { trigger: "manual" })}
          onSearchChange={setSearchQuery}
          yearGroups={filteredData}
          onEventSelect={handleSearchEventSelect}
        />

        <main className="flex h-screen flex-1 flex-col overflow-hidden overflow-x-hidden border-l border-[rgba(0,0,0,0.08)] bg-[#FFFDF7]">
          {/* Mobile Header */}
          <div className="sticky top-0 z-50 border-b border-[rgba(0,0,0,0.08)] bg-gradient-to-b from-[#FEE8D1]/98 via-[#FFF5E6]/98 to-[#FFFDF7]/98 backdrop-blur-xl md:hidden">
            <div className="flex h-16 items-center justify-between px-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border border-[rgba(0,0,0,0.08)] bg-[#FFFDF7] p-2 text-[#191919] hover:bg-[color:var(--accent)] hover:text-white"
                onClick={() => setYearDrawerOpen(true)}
                aria-label="Open year navigation"
              >
                <PanelLeft className="h-5 w-5" />
              </Button>

              <div className="flex-1 px-3 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7f796f]">
                  {currentEra?.yearStart}–{currentEra?.yearEnd}
                </div>
                <h2 className="text-sm font-bold uppercase tracking-[-0.02em] text-[#191919]">
                  {currentEra?.name}
                </h2>
              </div>

              <div className="w-10" />
            </div>
          </div>

          {/* Desktop Header */}
          <div
            className={`sticky top-0 z-50 border-b border-[rgba(0,0,0,0.08)] bg-gradient-to-b from-[#FEE8D1]/98 via-[#FFF5E6]/98 to-[#FFFDF7]/98 backdrop-blur-xl transition-all duration-300 hidden md:block ${
              isScrolled ? "py-3" : "py-6"
            }`}
          >
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 md:px-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                {!isScrolled && (
                  <div className="flex flex-col gap-3 text-center md:text-left">
                    <h1 className="text-[42px] font-bold uppercase leading-tight tracking-[-0.04em] text-[#191919]">
                      Builders Archive
                    </h1>
                    <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#5d564d] md:mx-0 md:text-base">
                      Explore each project and contribution towards the broader crypto ecosystem.
                    </p>
                  </div>
                )}
              </div>

              <div className={`${isScrolled ? "mt-1" : "mt-4"} grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4`}>
                {ERAS.map((era) => {
                  const isEraActive = currentEra?.id === era.id
                  const range = `${era.yearStart}\u2013${era.yearEnd}`
                  return (
                    <button
                      key={era.id}
                      type="button"
                      onClick={() => handleYearClick(era.yearStart, { trigger: "manual" })}
                      className={`flex h-full flex-col gap-3 rounded-3xl border px-5 py-5 text-left transition duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40 hover:scale-[1.01] ${
                        isEraActive
                          ? "border-transparent bg-[#FF5728] text-white shadow-[0_18px_40px_rgba(255,87,40,0.35)]"
                          : "border-[rgba(0,0,0,0.08)] bg-[#FFFDF7] text-[#191919] shadow-[0_12px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_30px_rgba(0,0,0,0.07)]"
                      }`}
                      aria-pressed={isEraActive}
                      aria-label={`Jump to ${era.name}`}
                    >
                      <span
                        className={`text-[11px] font-normal uppercase tracking-[0.01em] ${
                          isEraActive ? "text-white/80" : "text-[#7f796f]"
                        }`}
                      >
                        {range}
                      </span>
                      <h3
                        className={`text-lg font-title-medium leading-snug tracking-[-0.04em] line-clamp-2 overflow-hidden ${
                          isEraActive ? "text-white" : "text-[#191919]"
                        }`}
                      >
                        {era.name}
                      </h3>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden snap-y snap-proximity scroll-smooth"
            style={{
              scrollPaddingTop: `${headerScrollPadding}px`,
              overscrollBehaviorY: 'none'
            }}
          >
            <div className="mx-auto w-full max-w-5xl px-6 pt-0 pb-10 md:px-8"> {/* Changed pt-16 to pt-0 */}
              <div className="w-full mt-[120px]"> {/* Added initial offset */}
                <ContinuousReadingView
                  yearGroups={filteredData}
                  onEntityClick={setSelectedEntity}
                  onEventView={handleEventView}
                  scrollContainerRef={scrollContainerRef}
                />
              </div>
            </div>
          </div>
        </main>

        <EntitySidePanel entityId={selectedEntity} onClose={() => setSelectedEntity(null)} />
      </div>

      <Sheet open={yearDrawerOpen} onOpenChange={setYearDrawerOpen}>
        <SheetContent side="left" className="w-full max-w-xs gap-0 p-0 bg-[#FFFDF7] text-[#191919] md:hidden">
          <SheetHeader className="border-b border-[rgba(0,0,0,0.08)] px-4 py-3">
            <SheetTitle>Select year</SheetTitle>
          </SheetHeader>
          <YearSidebar
            years={years}
            currentYear={activeYear}
            onYearClick={(year) => {
              handleYearClick(year, { trigger: "manual" })
              setYearDrawerOpen(false)
            }}
            onSearchChange={setSearchQuery}
            yearGroups={filteredData}
            onEventSelect={(year, event) => {
              handleSearchEventSelect(year, event)
              setYearDrawerOpen(false)
            }}
            variant="overlay"
            className="md:hidden"
          />
        </SheetContent>
      </Sheet>

      <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} onEventSelect={handleSearchEventSelect} />

      <RelationsDrawer
        event={selectedEventForRelations}
        relatedEvents={relatedEvents}
        open={relationsDrawerOpen}
        onOpenChange={setRelationsDrawerOpen}
        onEventClick={handleSearchEventSelect}
      />
    </div>
  )
}