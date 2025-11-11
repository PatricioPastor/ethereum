"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowUp, Bookmark, Share2 } from "lucide-react"
import type { TimelineYear } from "@/lib/data-parser"
import { useState, useEffect, useMemo, type RefObject } from "react"
import { Badge } from "@/components/ui/badge"
import { ERAS } from "@/lib/era-data"

interface ContinuousReadingViewProps {
  yearGroups: TimelineYear[]
  onEntityClick?: (entityId: string) => void
  onEventView?: (eventTitle: string) => void
  scrollContainerRef?: RefObject<HTMLElement>
}

export function ContinuousReadingView({
  yearGroups,
  onEntityClick,
  onEventView,
  scrollContainerRef,
}: ContinuousReadingViewProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const container = scrollContainerRef?.current ?? null
    const target = container ?? (typeof window !== "undefined" ? window : null)
    if (!target) return

    let rafId: number | null = null
    const handleScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const scrollTop = container ? container.scrollTop : window.scrollY
        setShowScrollTop(scrollTop > 500)
        rafId = null
      })
    }

    target.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      target.removeEventListener("scroll", handleScroll as EventListener)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [scrollContainerRef])

  useEffect(() => {
    if (!onEventView) return
    const container = scrollContainerRef?.current ?? null
    if (!container) return

    const articles = Array.from(container.querySelectorAll<HTMLElement>("[data-event-id]"))
    if (articles.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const eventId = (entry.target as HTMLElement).dataset.eventId
          if (eventId) onEventView(eventId)
        })
      },
      { root: container, threshold: 0.6 },
    )

    articles.forEach((article) => observer.observe(article))

    return () => {
      articles.forEach((article) => observer.unobserve(article))
      observer.disconnect()
    }
  }, [onEventView, scrollContainerRef, yearGroups])

  const scrollToTop = () => {
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const yearContexts = useMemo(() => {
    return yearGroups.map((group) => ({
      year: group.year,
      context: `In ${group.year}, ${group.events.length} significant ${group.events.length === 1 ? "event" : "events"} shaped the crypto landscape in Argentina.`,
    }))
  }, [yearGroups])

  const eraLookup = useMemo(() => {
    const map = new Map<number, { title: string; range: string; id: string }>()
    ERAS.forEach((era) => {
      const title = era.name.toUpperCase()
      const range = `${era.yearStart}\u2013${era.yearEnd}`
      for (let year = era.yearStart; year <= era.yearEnd; year++) {
        map.set(year, { title, range, id: era.id })
      }
    })
    return map
  }, [])
  const renderedEraIds = new Set<string>()

  return (
    <>
      <article className="mx-auto w-full max-w-5xl snap-y px-5 text-slate-700 md:px-6 lg:px-0">
        {yearGroups.map((group) => {
          const eraMeta = eraLookup.get(group.year)
          const shouldRenderEraHeading = eraMeta && !renderedEraIds.has(eraMeta.id)
          if (shouldRenderEraHeading && eraMeta) {
            renderedEraIds.add(eraMeta.id)
          }
          const yearContext = yearContexts.find((c) => c.year === group.year)

          return (
            <section
              key={group.year}
              id={`y-${group.year}`}
              data-year={group.year}
              className="mb-20 scroll-mt-24 snap-start snap-always"
              aria-labelledby={`year-${group.year}`}
            >
              {shouldRenderEraHeading && eraMeta && (
                <motion.div
                  className="mb-6 flex flex-col gap-2"
                  initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={prefersReducedMotion ? undefined : { duration: 0.45 }}
                >
                  <span className="text-xs font-semibold uppercase tracking-[-0.04em] text-slate-400">
                    {eraMeta.range}
                  </span>
                  <h2 className="text-3xl font-bold uppercase leading-tight text-slate-900 md:text-[34px]">
                    {eraMeta.title}
                  </h2>
                </motion.div>
              )}

              <motion.div
                className="mb-6 flex flex-col gap-2"
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={prefersReducedMotion ? undefined : { duration: 0.35 }}
              >
                <span className="text-xs font-semibold uppercase tracking-[-0.04em] text-slate-500">
                  Year {group.year}
                </span>
                {yearContext?.context && (
                  <p className="max-w-prose text-sm leading-[1.7] text-slate-500">{yearContext.context}</p>
                )}
              </motion.div>

              <div className="mt-8 space-y-6">
                {group.events.map((event) => (
                  <article
                    key={event.title}
                    id={`e-${event.title.toLowerCase().replace(/\s+/g, "-")}`}
                    data-event-id={event.title}
                    role="article"
                    tabIndex={-1}
                    className="group scroll-mt-12 rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm transition hover:border-[color:var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[-0.02em] text-slate-400">
                        <span className="font-semibold text-[color:var(--accent)]">{event.date}</span>
                        {event.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[-0.02em] text-slate-600"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <h3 className="text-2xl font-semibold leading-tight text-slate-900 transition-colors group-hover:text-slate-950 md:text-[28px]">
                        {event.title}
                      </h3>

                      <p className="max-w-prose text-base leading-[1.7] text-slate-600">{event.description}</p>
                    </div>

                    {event.entities.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {event.entities.map((entity) => (
                          <button
                            key={entity}
                            onClick={() => onEntityClick?.(entity)}
                            className="text-sm font-semibold uppercase tracking-[-0.02em] text-slate-500 hover:text-[color:var(--accent)]"
                            aria-label={`View ${entity}`}
                          >
                            {entity}
                          </button>
                        ))}
                      </div>
                    )}

                    {event.sources && event.sources.length > 0 && (
                      <div className="mt-4 text-sm text-slate-500">
                        <span className="font-semibold uppercase tracking-[-0.02em] text-slate-500">Sources:</span>{" "}
                        {event.sources.map((source, i) => (
                          <span key={i}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline decoration-slate-300 underline-offset-4 hover:text-[color:var(--accent)]"
                            >
                              {source.name}
                            </a>
                            {i < event.sources.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Bookmark event"
                        className="h-8 rounded-full border border-slate-200 bg-transparent px-2 text-slate-500 hover:bg-[color:var(--accent)] hover:text-white"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Share event"
                        className="h-8 rounded-full border border-slate-200 bg-transparent px-2 text-slate-500 hover:bg-[color:var(--accent)] hover:text-white"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </article>

      {showScrollTop && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="rounded-full border border-slate-300 bg-[color:var(--accent)] px-4 py-4 text-white shadow-lg hover:bg-slate-900"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </>
  )
}

