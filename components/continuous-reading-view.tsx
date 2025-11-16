"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowUpRight } from "lucide-react"
import type { TimelineEvent, TimelineYear } from "@/lib/data-parser"
import { useState, useEffect, useMemo, type RefObject, type ReactNode } from "react"
import { ERAS } from "@/lib/era-data"

type TimelineLink = NonNullable<TimelineEvent["links"]>[number]

const TRAILING_PUNCTUATION = new Set([",", ".", ";", ":", ")", "]"])

function stripTrailingPunctuation(value: string) {
  let trimmed = value
  let suffix = ""
  while (trimmed && TRAILING_PUNCTUATION.has(trimmed.charAt(trimmed.length - 1))) {
    suffix = trimmed.slice(-1) + suffix
    trimmed = trimmed.slice(0, -1)
  }
  return { trimmed, suffix }
}

function ensureProtocol(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `https://${url}`
}

function formatLinkLabel(link: TimelineLink) {
  if (link.label) return link.label
  try {
    const parsed = new URL(ensureProtocol(link.url))
    const hostname = parsed.hostname.replace(/^www\./, "")
    // Truncate long hostnames
    return hostname.length > 30 ? `${hostname.substring(0, 27)}...` : hostname
  } catch {
    // If URL parsing fails, return a generic label
    return "Source"
  }
}

function linkifyDescription(text: string): ReactNode[] {
  const pattern = /(@[a-zA-Z0-9_]+)|(https?:\/\/[^\s]+)|(www\.[^\s]+)/g
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const rawMatch = match[0]
    const { trimmed, suffix } = stripTrailingPunctuation(rawMatch)
    if (!trimmed) continue

    let href = trimmed
    let label = trimmed

    if (trimmed.startsWith("@")) {
      const handle = trimmed.slice(1)
      href = `https://twitter.com/${handle}`
      label = `@${handle}`
    } else {
      href = ensureProtocol(trimmed)
      try {
        const parsed = new URL(href)
        const hostname = parsed.hostname.replace(/^www\./, "")
        // Show only domain for URLs in text, truncate if too long
        label = hostname.length > 25 ? `${hostname.substring(0, 22)}...` : hostname
      } catch {
        // If URL parsing fails, show a generic label
        label = "Link"
      }
    }

    nodes.push(
      <a
        key={`auto-link-${key++}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#b44521] decoration-transparent underline-offset-4 hover:text-[color:var(--accent)] hover:underline"
      >
        {label}
      </a>,
    )

    if (suffix) {
      nodes.push(suffix)
    }

    lastIndex = match.index + rawMatch.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function getEventLinks(event: TimelineEvent): TimelineLink[] {
  if (event.links && event.links.length > 0) return event.links
  if (event.sources && event.sources.length > 0) return event.sources
  return []
}

interface ContinuousReadingViewProps {
  yearGroups: TimelineYear[]
  onEntityClick?: (entityId: string) => void
  onEventView?: (eventTitle: string) => void
  scrollContainerRef?: RefObject<HTMLElement | null>
}

export function ContinuousReadingView({
  yearGroups,
  onEntityClick,
  onEventView,
  scrollContainerRef,
}: ContinuousReadingViewProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const [hasMounted, setHasMounted] = useState(false)

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

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const scrollToTop = () => {
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
  const canAnimate = hasMounted && !prefersReducedMotion
  const animationMode = canAnimate ? "animate" : "static"
  const getRevealProps = (offset = 12, duration = 0.35) =>
    canAnimate
      ? {
          initial: { opacity: 0, y: offset },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration },
        }
      : {
          initial: { opacity: 1, y: 0 },
        }

  return (
    <>
      <article className="mx-auto w-full max-w-5xl snap-y px-5 text-[#4f473e] md:px-6 lg:px-0">
        {yearGroups.map((group, groupIndex) => {
          const eraMeta = eraLookup.get(group.year)
          const shouldRenderEraHeading = eraMeta && !renderedEraIds.has(eraMeta.id)
          if (shouldRenderEraHeading && eraMeta) {
            renderedEraIds.add(eraMeta.id)
          }

          return (
            <section
              key={group.year}
              id={`y-${group.year}`}
              data-year={group.year}
              className="mb-20 scroll-mt-24 snap-start snap-always"
              aria-labelledby={`year-${group.year}`}
            >
              {shouldRenderEraHeading && eraMeta && (
                <>
                  {groupIndex > 0 && (
                    <div className="mb-16 mt-8">
                      <div className="mb-8 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FF5728]/30 to-transparent" />
                      </div>
                    </div>
                  )}
                  <span
                    data-era-sentinel-id={eraMeta.id}
                    aria-hidden="true"
                    className="-mt-24 block h-px w-full opacity-0"
                  />
                  <motion.div
                    key={`${animationMode}-era-${eraMeta.id}-${group.year}`}
                    data-era-card-id={eraMeta.id}
                    className="mb-8 flex flex-col gap-2 rounded-2xl border border-[#FF5728]/20 bg-gradient-to-r from-[#FFF5F0] to-[#FFFDF7] px-6 py-4 shadow-[0_8px_20px_rgba(255,87,40,0.08)]"
                    {...getRevealProps(12, 0.35)}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0] text-[#FF5728]/70">
                      {eraMeta.range}
                    </p>
                    <h2 className="text-[22px] font-bold uppercase tracking-[-0.02em] text-[#191919]">
                      {eraMeta.title}
                    </h2>
                  </motion.div>
                </>
              )}

              <motion.div
                key={`${animationMode}-year-${group.year}`}
                className="mb-8 flex flex-col gap-1"
                {...getRevealProps(10, 0.3)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[28px] font-bold tabular-nums tracking-[-0.02em] text-[#191919]">
                    {group.year}
                  </span>
                  <div className="h-px flex-1 bg-[rgba(0,0,0,0.08)]" />
                </div>
              </motion.div>

              <div className="mt-8 space-y-5">
                {group.events.map((event) => {
                  const relatedLinks = getEventLinks(event)
                  return (
                    <article
                      key={event.id}
                      id={`e-${event.title.toLowerCase().replace(/\s+/g, "-")}`}
                      data-event-id={event.id}
                      role="article"
                      tabIndex={-1}
                      className="group scroll-mt-12 rounded-[34px] border border-[rgba(0,0,0,0.08)] bg-[#FFFDF7] px-8 py-8 shadow-[0_4px_12px_rgba(255,87,40,0.04),0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,87,40,0.12),0_2px_6px_rgba(0,0,0,0.04)] hover:border-[#FF5728]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/30"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0] text-[#a29385]">
                          <span>{event.date}</span>
                        </div>
                        <h3 className="text-[19px] font-semibold leading-snug text-[#191919] md:text-[20px]">
                          {event.title}
                        </h3>
                        <p className="text-[15px] leading-[1.7] text-[#4a4038] md:text-[16px]">{linkifyDescription(event.description)}</p>
                      </div>

                      {event.entities.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {event.entities.map((entity, entityIndex) => (
                            <a
                              key={`${event.id}-entity-${entityIndex}-${entity}`}
                              href={`https://twitter.com/${entity}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                // Also trigger the entity click handler if provided (e.g., to open side panel)
                                if (onEntityClick && e.metaKey) {
                                  e.preventDefault()
                                  onEntityClick(entity)
                                }
                              }}
                              className="rounded-full border border-[rgba(0,0,0,0.15)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0] text-[#6d645a] transition hover:border-[#FF5728]/50 hover:text-[#191919] cursor-pointer"
                              aria-label={`View ${entity} on Twitter`}
                            >
                              @{entity}
                            </a>
                          ))}
                        </div>
                      )}

                      {relatedLinks.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                          {relatedLinks.map((link) => (
                            <a
                              key={`${event.id}-${link.url}`}
                              href={ensureProtocol(link.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.12)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0] text-[#6d645a] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] max-w-full"
                              title={link.url}
                            >
                              <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="truncate">{formatLinkLabel(link)}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </article>
                  )
                })}
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
            className="rounded-full border border-transparent bg-[color:var(--accent)] px-4 py-4 text-white shadow-[0_14px_30px_rgba(255,87,40,0.35)] hover:bg-[#e74f22]"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </>
  )
}



