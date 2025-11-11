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
    return parsed.hostname.replace(/^www\./, "")
  } catch {
    return link.url
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
      if (trimmed.startsWith("www.")) {
        label = trimmed
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
        {yearGroups.map((group) => {
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
                  <span
                    data-era-sentinel-id={eraMeta.id}
                    aria-hidden="true"
                    className="-mt-24 block h-px w-full opacity-0"
                  />
                  <motion.div
                    key={`${animationMode}-era-${eraMeta.id}-${group.year}`}
                    className="mb-4 flex flex-col gap-1"
                    {...getRevealProps(12, 0.35)}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.01em] text-[#8a8176]">
                      {eraMeta.range} {" · "} {eraMeta.title}
                    </p>
                  </motion.div>
                </>
              )}

              <motion.div
                key={`${animationMode}-year-${group.year}`}
                className="mb-6 flex flex-col gap-1"
                {...getRevealProps(10, 0.3)}
              >
                <span className="text-[13px] font-semibold uppercase tracking-[0.01em] text-[#6b5f55]">
                  {group.year}
                </span>
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
                      className="group scroll-mt-12 rounded-[34px] border border-[rgba(0,0,0,0.08)] bg-[#FFFDF7] px-8 py-8 shadow-[0_22px_35px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:border-[color:var(--accent)]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/30"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.01em] text-[#a29385]">
                          <span>{event.date}</span>
                        </div>
                        <h3 className="text-[20px] font-title-medium leading-snug text-[#191919] transition-colors group-hover:text-[#0f0f0f] md:text-[22px]">
                          {event.title}
                        </h3>
                        <p className="text-[15px] leading-7 text-[rgba(25,25,25,0.78)]">{linkifyDescription(event.description)}</p>
                      </div>

                      {event.entities.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {event.entities.map((entity) => (
                            <button
                              key={entity}
                              onClick={() => onEntityClick?.(entity)}
                            className="rounded-full border border-[rgba(0,0,0,0.15)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.01em] text-[#6d645a] transition hover:border-[#FF5728]/50 hover:text-[#191919]"
                              aria-label={`View ${entity}`}
                            >
                              @{entity}
                            </button>
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
                              className="inline-flex items-center gap-1 rounded-full border border-[rgba(0,0,0,0.12)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.01em] text-[#6d645a] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                            >
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              {formatLinkLabel(link)}
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



