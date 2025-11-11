"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import type { CSSProperties } from "react"
import { useSearchParams } from "next/navigation"
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
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams()
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
  const deepLinkHandledRef = useRef<string | null>(null)
  const allTimelineEvents = useMemo(() => timelineData.flatMap((group) => group.events), [])

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

const deepLinkEventId = searchParams.get("event")

useEffect(() => {
  if (!deepLinkEventId || deepLinkHandledRef.current === deepLinkEventId) return
  const event = allTimelineEvents.find((evt) => evt.id === deepLinkEventId)
  if (!event) return
  deepLinkHandledRef.current = deepLinkEventId
  handleSearchEventSelect(event.year, event)
}, [deepLinkEventId, allTimelineEvents, handleSearchEventSelect])

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

  const headerScrollPadding = isScrolled ? 120 : 240

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
        setTimeout(() => {
          const firstCard = element.querySelector<HTMLElement>('[role="article"]')
          firstCard?.focus({ preventScroll: true })
          navigationInProgressRef.current = false
        }, 350)
        if (container) {
          const target = Math.max(0, element.offsetTop - headerScrollPadding)
          container.scrollTo({
            top: target,
            behavior: "smooth",
          })
        }
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
      }, 350)
    },
    [handleYearClick],
  )
  const searchParams = useSearchParams()

  const handleEventView = (eventTitle: string) => {
    viewedEventsRef.current.add(eventTitle)
  }

  const handleShowRelations = (event: TimelineEvent) => {
    setSelectedEventForRelations(event)
    setRelationsDrawerOpen(true)
  }

  useEffect(() => {
    const rafId: number | null = null

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchModalOpen(true)
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [searchModalOpen])

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
        threshold: [0.4, 0.6, 0.9],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
      observer.disconnect()
    }
  }, [filteredData, activeYear])

  useEffect(() => {
    if (!fallbackEra) return
    setActiveEraId((prev) => (prev === fallbackEra.id ? prev : fallbackEra.id))
  }, [fallbackEra])

  useEffect(() => {
    if (filteredData.length === 0) return
    const hasActiveYear = filteredData.some((group) => group.year === activeYear)
    if (hasActiveYear) return

    const fallbackYear = filteredData[0]?.year
    if (!fallbackYear) return

    requestAnimationFrame(() => {
      handleYearClick(fallbackYear)
    })
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

  return (

    <div className="relative min-h-screen bg-[#FFFDF7] text-[color:var(--text-color)]" style={themeStyles}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(255,127,80,0.35),transparent_70%)]" />
        <div className="absolute inset-y-0 right-0 w-64 bg-[linear-gradient(180deg,rgba(255,127,80,0.12)_0%,transparent_55%,rgba(255,127,80,0.16)_100%)]" />
      </div>
      <div className="flex h-screen overflow-hidden bg-[#FFFDF7] text-[#191919]">
        <YearSidebar
          years={years}
          currentYear={activeYear}
          onYearClick={(year) => handleYearClick(year, { trigger: "manual" })}
          onSearchChange={setSearchQuery}
          yearGroups={filteredData}
          onEventSelect={handleSearchEventSelect}
        />

        <main className="flex h-screen flex-1 flex-col overflow-hidden border-l border-[rgba(0,0,0,0.08)] bg-[#FFFDF7]">
          <div
            className={`sticky top-0 z-40 border-b border-[rgba(0,0,0,0.08)] bg-gradient-to-b from-[#FEE8D1]/95 via-[#FFF5E6]/95 to-[#FFFDF7]/95 backdrop-blur-lg transition-all duration-300 ${
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
                <Button
                  variant="outline"
                  size="sm"
                  className="self-center rounded-full border border-[rgba(0,0,0,0.08)] bg-[#FFFDF7] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.01em] text-[#191919] hover:bg-[color:var(--accent)] hover:text-white md:hidden md:self-start"
                  onClick={() => setYearDrawerOpen(true)}
                  aria-label="Open year navigation"
                >
                  <PanelLeft className="mr-2 h-4 w-4" />
                  Years
                </Button>
              </div>

              <div className={`${isScrolled ? "mt-1" : "mt-4"} grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5`}>
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
            className="flex-1 overflow-y-auto snap-y snap-proximity scroll-smooth"
            style={{ scrollPaddingTop: `${headerScrollPadding}px` }}
          >
            <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-8">
              <div className="w-full">
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
