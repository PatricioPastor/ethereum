"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { CSSProperties } from "react"
import { YearSidebar } from "@/components/year-sidebar"
import { ContinuousReadingView } from "@/components/continuous-reading-view"
import { EntitySidePanel } from "@/components/entity-side-panel"
import { SearchModal } from "@/components/search-modal"
import { RelationsDrawer } from "@/components/relations-drawer"
import { TimelineScrollInitializer } from "@/components/timeline-scroll-initializer"
import { ERAS } from "@/lib/era-data"
import { timelineData } from "@/lib/timeline-data"
import type { TimelineEvent } from "@/lib/data-parser"
import { useYears } from "@/hooks/use-years"
import { useTimelineNavigation } from "@/hooks/use-timeline-navigation"
import { useScrollSync } from "@/hooks/use-scroll-sync"
import { useEventNavigation } from "@/hooks/use-event-navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { PanelLeft, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TimelinePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [yearDrawerOpen, setYearDrawerOpen] = useState(false)
  const viewedEventsRef = useRef<Set<string>>(new Set())
  const [selectedEventForRelations, setSelectedEventForRelations] = useState<TimelineEvent | null>(null)
  const [relationsDrawerOpen, setRelationsDrawerOpen] = useState(false)
  const eraFilterId: string | "all" = "all"

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { years, filteredData } = useYears({
    timelineData,
    eraId: eraFilterId,
    filters: { tags: [], importance: [], yearRange: [2008, 2025] },
    searchQuery,
  })

  // Centralized navigation state management
  const {
    activeYear,
    activeEraId,
    currentEra,
    navigationState,
    isScrolled,
    navigateToYear,
    navigateToEra,
    scrollToElement,
    handleScroll,
    getHeaderHeight,
  } = useTimelineNavigation({
    initialYear: years[0] ?? 2008,
  })

  const headerHeight = getHeaderHeight()
  const headerScrollPadding = headerHeight

  // Scroll synchronization
  useScrollSync({
    scrollContainerRef,
    yearGroups: filteredData,
    activeYear,
    headerHeight,
    navigationState,
    onYearChange: (year) => navigateToYear(year, { trigger: "scroll" }),
    onEraChange: (eraId) => navigateToEra(eraId),
  })

  // Event navigation (from home page)
  const { navigateToEvent } = useEventNavigation({
    scrollContainerRef,
    navigateToYear,
    scrollToElement,
  })

  // Handle search event selection
  const handleSearchEventSelect = useCallback(
    async (year: number, event: TimelineEvent) => {
      // Navigate to year first
      navigateToYear(year, { forceCollapse: true, trigger: "manual" })

      // Wait for year navigation to start
      await new Promise((resolve) => setTimeout(resolve, 150))

      // Then scroll to event
      const container = scrollContainerRef.current
      if (!container) return

      // Wait for DOM to be ready
      let attempts = 0
      const maxAttempts = 20
      const checkElement = async (): Promise<HTMLElement | null> => {
        const eventElement = container.querySelector<HTMLElement>(`[data-event-id="${event.id}"]`)
        if (eventElement) return eventElement
        if (attempts++ < maxAttempts) {
          await new Promise((resolve) => requestAnimationFrame(resolve))
          return checkElement()
        }
        return null
      }

      const eventElement = await checkElement()
      if (eventElement) {
        await scrollToElement(eventElement, container, { behavior: "smooth" })
      }
    },
    [navigateToYear, scrollToElement],
  )

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

  const handleEventView = (eventTitle: string) => {
    viewedEventsRef.current.add(eventTitle)
  }

  const handleShowRelations = (event: TimelineEvent) => {
    setSelectedEventForRelations(event)
    setRelationsDrawerOpen(true)
  }

  // Keyboard shortcuts
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
  }, [])

  // Setup scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollListener = (e: Event) => {
      const scrollTop = container.scrollTop
      handleScroll(scrollTop)
    }

    container.addEventListener("scroll", scrollListener, { passive: true })
    return () => container.removeEventListener("scroll", scrollListener)
  }, [handleScroll])

  // Handle year click from sidebar
  const handleYearClick = useCallback(
    (year: number) => {
      const container = scrollContainerRef.current
      if (!container) return

      const element = container.querySelector<HTMLElement>(`[data-year="${year}"]`)
      if (element) {
        navigateToYear(year, { trigger: "manual" })
        scrollToElement(element, container, { behavior: "smooth" }).then(() => {
          // Focus first card after scroll completes
          const firstCard = element.querySelector<HTMLElement>('[role="article"]')
          firstCard?.focus({ preventScroll: true })
        })
      }
    },
    [navigateToYear, scrollToElement],
  )

  // Handle era click - navigates to era's start year and scrolls to it
  const handleEraClick = useCallback(
    (eraId: string) => {
      const era = ERAS.find((e) => e.id === eraId)
      if (!era) return

      const container = scrollContainerRef.current
      if (!container) return

      // Find the first year element for this era
      const targetYear = era.yearStart
      
      // First update the state
      navigateToYear(targetYear, { trigger: "manual" })
      
      // Wait for DOM to update, then scroll
      const scrollToEraElement = async () => {
        // Wait for multiple frames to ensure DOM is updated and React has re-rendered
        await new Promise((resolve) => requestAnimationFrame(resolve))
        await new Promise((resolve) => requestAnimationFrame(resolve))
        await new Promise((resolve) => setTimeout(resolve, 200))
        
        let targetElement: HTMLElement | null = null
        let attempts = 0
        const maxAttempts = 15
        
        // Try to find the element with retries
        while (!targetElement && attempts < maxAttempts) {
          // First try to find the era heading card (the visible title card)
          targetElement = container.querySelector<HTMLElement>(`[data-era-card-id="${eraId}"]`)
          
          // If era card not found, try the year element
          if (!targetElement) {
            targetElement = container.querySelector<HTMLElement>(`[data-year="${targetYear}"]`)
          }
          
          // If still not found, try finding the first event card of the era
          if (!targetElement) {
            const yearSection = container.querySelector<HTMLElement>(`[data-year="${targetYear}"]`)
            if (yearSection) {
              const firstEventCard = yearSection.querySelector<HTMLElement>('[role="article"]')
              if (firstEventCard) {
                targetElement = firstEventCard
              } else {
                targetElement = yearSection
              }
            }
          }
          
          // If still not found, try by ID
          if (!targetElement) {
            targetElement = container.querySelector<HTMLElement>(`#y-${targetYear}`)
          }
          
          // If still not found, wait and retry
          if (!targetElement && attempts < maxAttempts - 1) {
            await new Promise((resolve) => requestAnimationFrame(resolve))
            await new Promise((resolve) => setTimeout(resolve, 50))
            attempts++
          } else {
            break
          }
        }
        
        if (targetElement) {
          // Calculate scroll position relative to container
          // This works for both mobile and desktop since we're using the container's scroll
          const containerRect = container.getBoundingClientRect()
          const elementRect = targetElement.getBoundingClientRect()
          const headerHeight = getHeaderHeight()
          // Use slightly less offset on mobile for better visibility
          const isMobile = window.innerWidth < 768
          const offset = isMobile ? headerHeight + 16 : headerHeight + 32
          
          // Calculate the scroll position needed
          const elementTopRelativeToContainer = elementRect.top - containerRect.top + container.scrollTop
          const targetScrollTop = Math.max(0, elementTopRelativeToContainer - offset)
          
          // Scroll using the container - this works for both mobile and desktop
          container.scrollTo({
            top: targetScrollTop,
            behavior: "smooth",
          })
          
          // After scroll completes, ensure we're at the right position
          setTimeout(() => {
            const yearSection = container.querySelector<HTMLElement>(`[data-year="${targetYear}"]`)
            if (yearSection) {
              const firstCard = yearSection.querySelector<HTMLElement>('[role="article"]')
              if (firstCard) {
                firstCard.focus({ preventScroll: true })
              }
            }
          }, 500)
        } else {
          // Last resort: try scrolling to the year using direct scroll calculation
          console.warn(`Could not find element for era ${eraId}, year ${targetYear}, trying fallback`)
          const fallbackElement = container.querySelector<HTMLElement>(`#y-${targetYear}`)
          if (fallbackElement) {
            const containerRect = container.getBoundingClientRect()
            const elementRect = fallbackElement.getBoundingClientRect()
            const headerHeight = getHeaderHeight()
            const isMobile = window.innerWidth < 768
            const offset = isMobile ? headerHeight + 16 : headerHeight + 32
            const elementTopRelativeToContainer = elementRect.top - containerRect.top + container.scrollTop
            const targetScrollTop = Math.max(0, elementTopRelativeToContainer - offset)
            container.scrollTo({
              top: targetScrollTop,
              behavior: "smooth",
            })
          }
        }
      }
      
      scrollToEraElement()
    },
    [navigateToYear, scrollToElement, getHeaderHeight],
  )

  const relatedEvents = selectedEventForRelations ? getRelatedEvents(selectedEventForRelations) : []
  const accent = "#FF5728"
  const textColor = "#191919"
  const themeStyles = {
    "--accent": accent,
    "--text-color": textColor,
  } as CSSProperties

  return (
    <div className="relative min-h-screen bg-[#FFFDF7] text-[color:var(--text-color)]" style={{ ...themeStyles, overscrollBehavior: "none" }}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(255,127,80,0.35),transparent_70%)]" />
        <div className="absolute inset-y-0 right-0 w-64 bg-[linear-gradient(180deg,rgba(255,127,80,0.12)_0%,transparent_55%,rgba(255,127,80,0.16)_100%)]" />
      </div>
      <div className="flex h-screen overflow-hidden bg-[#FFFDF7] text-[#191919]" style={{ overscrollBehavior: "none" }}>
        <YearSidebar
          years={years}
          currentYear={activeYear}
          onYearClick={handleYearClick}
          onSearchChange={setSearchQuery}
          yearGroups={filteredData}
          onEventSelect={handleSearchEventSelect}
        />

        <main className="flex h-screen flex-1 flex-col overflow-hidden overflow-x-hidden border-l border-[rgba(0,0,0,0.08)] bg-[#FFFDF7]">
          {/* Mobile Header */}
          <div className="sticky top-0 z-50 border-b border-[rgba(0,0,0,0.08)] bg-gradient-to-b from-[#FEE8D1]/98 via-[#FFF5E6]/98 to-[#FFFDF7]/98 backdrop-blur-xl md:hidden">
            <div className="flex flex-col">
              <div className="flex h-16 items-center justify-between px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="rounded-full border border-[rgba(0,0,0,0.08)] bg-[#FFFDF7] p-2 text-[#191919] hover:bg-[color:var(--accent)] hover:text-white"
                >
                  <Link href="/" aria-label="Go back home">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>

                <div className="flex-1 px-3 text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-[0] text-[#7f796f]">
                    {currentEra?.yearStart}–{currentEra?.yearEnd}
                  </div>
                  <h2 className="text-sm font-bold uppercase tracking-[-0.02em] text-[#191919]">{currentEra?.name}</h2>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border border-[rgba(0,0,0,0.08)] bg-[#FFFDF7] p-2 text-[#191919] hover:bg-[color:var(--accent)] hover:text-white"
                  onClick={() => setYearDrawerOpen(true)}
                  aria-label="Open year navigation"
                >
                  <PanelLeft className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Era Navigation */}
              <div className="border-t border-[rgba(0,0,0,0.08)] bg-[#FFFDF7] px-4 py-3">
                <div className="flex items-center gap-2">
                  {ERAS.map((era) => {
                    const isActive = currentEra?.id === era.id
                    const currentIndex = ERAS.findIndex((e) => e.id === currentEra?.id)
                    const eraIndex = ERAS.findIndex((e) => e.id === era.id)
                    const isPast = eraIndex < currentIndex

                    return (
                      <button
                        key={era.id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleEraClick(era.id)
                        }}
                        onTouchEnd={(e) => {
                          // Ensure touch events also work
                          e.preventDefault()
                          e.stopPropagation()
                          handleEraClick(era.id)
                        }}
                        className={`flex-1 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0] transition ${
                          isActive
                            ? "bg-[#FF5728] text-white shadow-[0_4px_12px_rgba(255,87,40,0.35)]"
                            : isPast
                              ? "bg-[#FF5728]/20 text-[#FF5728]"
                              : "bg-[rgba(0,0,0,0.05)] text-[#7f796f]"
                        }`}
                        aria-label={`Go to ${era.name} era`}
                        aria-current={isActive ? "true" : undefined}
                      >
                        {era.name}
                      </button>
                    )
                  })}
                </div>
              </div>
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
                      onClick={() => handleEraClick(era.id)}
                      className={`flex h-full flex-col gap-3 rounded-3xl border px-5 py-5 text-left transition duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40 hover:scale-[1.01] ${
                        isEraActive
                          ? "border-transparent bg-[#FF5728] text-white shadow-[0_18px_40px_rgba(255,87,40,0.35)]"
                          : "border-[rgba(0,0,0,0.08)] bg-[#FFFDF7] text-[#191919] shadow-[0_12px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_30px_rgba(0,0,0,0.07)]"
                      }`}
                      aria-pressed={isEraActive}
                      aria-label={`Jump to ${era.name}`}
                    >
                      <span
                        className={`text-[11px] font-normal uppercase tracking-[0] ${
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
              overscrollBehaviorY: "none",
            }}
          >
            <div className="mx-auto w-full max-w-5xl px-6 pt-0 pb-10 md:px-8">
              <div className="w-full mt-[120px] md:mt-[120px]">
                <TimelineScrollInitializer
                  scrollContainerRef={scrollContainerRef}
                  yearGroups={filteredData}
                  headerHeight={headerHeight}
                />
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
        <SheetContent
          side="left"
          className="w-full max-w-xs gap-0 p-0 bg-[#FFFDF7] text-[#191919] md:hidden"
          onOpenAutoFocus={(e) => {
            // Prevent autofocus on mobile to avoid opening keyboard
            if (window.innerWidth < 768) {
              e.preventDefault()
            }
          }}
        >
          <SheetHeader className="border-b border-[rgba(0,0,0,0.08)] px-4 py-3">
            <SheetTitle>Select year</SheetTitle>
          </SheetHeader>
          <YearSidebar
            years={years}
            currentYear={activeYear}
            onYearClick={(year) => {
              handleYearClick(year)
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
