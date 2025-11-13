"use client"
import { useEffect, useMemo, useRef } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import type { TimelineEvent } from "@/lib/data-parser"
import { extractEntities } from "@/lib/data-parser"
import { getTimelineData } from "@/lib/timeline-data"

const heroCopy = {
  title: {
    prefix: "Builders",
    suffix: "Archive",
  },
  description:
    "From the very beginning, Argentina was always at the forefront of Ethereum innovation. The Builders Archive gathers origin stories of Argentina's crypto startups, early experiments, and ongoing contributions to the world computer.",
}

const eraPreviewData = [
  {
    title: "Genesis",
    years: "2008 - 2015",
    summary: "Early bitcoin experiments, Xapo, the first Argentinian crypto security firms, exchanges, and Casa Voltaire.",
    logos: ["Ripio", "Xapo", "Casa Voltaire"],
    active: true,
    faded: false,
  },
  {
    title: "Emergence",
    years: "2016 - 2020",
    summary: "Community meetups emerge, early contributions to ERC standards and DeFi, decentralized justice, ETHBuenosAires.",
    logos: ["OpenZeppelin", "POAP", "Kleros"],
    active: false,
    faded: false,
  },
  {
    title: "Growth",
    years: "2021 - 2022",
    summary: "DeFi, security, identity, node infrastructure, and data products ripple outward. Argentine contributions scale globally.",
    logos: ["Hardhat", "Muun", "Proof of Humanity"],
    active: false,
    faded: true,
  },
]

const infoTiles = [
  {
    icon: "arc",
    kicker: "17 Years Captured",
    body: "Trace every inflection from the Bitcoin genesis block to emerging AI-enabled crypto services.",
  },
  {
    icon: "double",
    kicker: "Buenos Aires To The World",
    body: "See how local experiments in payments, DAOs, and public goods rippled outward into global ecosystems.",
  },
  {
    icon: "stack",
    kicker: "A Ledger For Builders",
    body: "Designed so researchers, product teams, and newcomers can map who shipped what - and why it mattered.",
  },
]

const primaryNavLinks = [
  { label: "Home", href: "/" },
  { label: "Timeline", href: "/timeline" },
] as const

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
}

export default function HomePage() {
  const timeline = getTimelineData()
  const entities = extractEntities(timeline)
  const totalEvents = timeline.reduce((sum, group) => sum + group.events.length, 0)
  const flattenedEvents = timeline.flatMap((group) => group.events)
  const highImportanceEvents = flattenedEvents.filter((event) => event.importance === "high")
  const milestoneEvents = (highImportanceEvents.length >= 10 ? highImportanceEvents : flattenedEvents).slice(0, 10)

  return (
    <div className="bg-[#F2F3E1] text-[#191919]">
      <main className="flex flex-col gap-0">
        <HeroSection />
        <EraPreviewSection />
        <WhyItMattersSection builderCount={entities.length} milestones={milestoneEvents} />
        <Footer />
      </main>
    </div>
  )
}

function HeroSection() {
  const pathname = usePathname()

  return (
    <section className="panel section section--hero relative isolate px-6 text-white" id="sec-1" tabIndex={-1}>
      <div className="section__bg" aria-hidden="true">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline poster="/HERO.jpg">
          <source src="/Hero Timeline (1).mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#c17b62]/10 via-[#a05946]/10 to-[#3a170f]/10" />
      </div>

      <div className="px-6 pt-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Image
            src="/crecimiento-logo-header.svg"
            alt="Crecimiento Logo"
            width={220}
            height={70}
            priority
            className="h-12 w-auto sm:h-16"
          />
          <div className="flex justify-end">
            <nav
              aria-label="Primary"
              className="flex items-center rounded-full bg-black/90 p-1 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
            >
              {primaryNavLinks.map((link) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-full px-6 py-1.5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      isActive
                        ? "bg-[#FF5728] text-white shadow-[0_12px_30px_rgba(255,87,40,0.35)]"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col px-0">
        <div className="pointer-events-none absolute right-0 top-1/2 z-20 hidden translate-y-[-60%] items-start gap-4 text-white sm:flex">
            <ArrowUpRight className="h-10 w-10 text-white" />
            <div className="flex flex-col text-left text-sm font-semibold uppercase tracking-[-0.01em] leading-tight sm:text-base">
              <span>Bring</span>
              <span>Argentina</span>
              <span>Onchain</span>
            </div>
          </div>

          <div className="relative z-10 flex min-h-[inherit] flex-col justify-center gap-8 py-32 sm:py-36 lg:py-40">
            <div className="max-w-2xl space-y-6 text-left">
              <span className="inline-flex items-center rounded-full border border-white/80 bg-white/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                2008 – 2025
              </span>
            <motion.h1
              {...fadeIn}
              className="text-[48px] font-bold uppercase leading-[1.05] tracking-[-0.04em] text-white sm:text-[60px]"
            >
                <span className="font-normal not-italic text-white/90">{heroCopy.title.prefix}</span>{" "}
                <span className="font-medium italic">{heroCopy.title.suffix}</span>
              </motion.h1>
            <motion.p
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
              className="max-w-xl text-base leading-relaxed text-white/85"
            >
              {heroCopy.description}
            </motion.p>
          </div>

          <motion.div
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <Button
              asChild
              className="group w-fit rounded-full border border-black/50 bg-black/90 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition hover:bg-black"
            >
              <Link href="/timeline">
                Explore timeline
                <ArrowUpRight className="ml-3 h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
      
    </section>
  )
}

function EraPreviewSection() {
  return (
    <section
      className="relative z-20 -mt-16 overflow-hidden rounded-t-[56px] bg-gradient-to-b from-[#fffdf9] via-[#fff3ea] to-[#ffe3cf] px-4 pb-20 shadow-[0_50px_140px_rgba(0,0,0,0.18)] sm:-mt-20 sm:px-6 md:-mt-28 lg:-mt-[180px] lg:px-8"
      aria-labelledby="era-preview-heading"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-6 pt-24 pb-24 sm:px-10 sm:pt-28 md:px-16 md:pt-32">
        <motion.div
          {...fadeIn}
          className="grid gap-10 text-[#191919] md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:items-start"
          id="era-preview-heading"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7a7267]">
              <span>Era Preview</span>
              <span className="hidden h-px flex-1 bg-[#d6cdc1] sm:block" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-semibold uppercase tracking-[-0.03em] text-[#191919] sm:text-[40px]">
              Four eras, one through-line of Argentine craft.
            </h2>
          </div>
          <div className="flex justify-center md:justify-end">
            <Image
              src="/rectangle-80.png"
              alt="Era preview texture"
              width={320}
              height={480}
              className="h-32 w-auto -rotate-90 object-contain sm:h-36 md:h-40 lg:h-44"
              priority
            />
          </div>
        </motion.div>

        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-[#d7cdc0] via-[#b5a799] to-transparent"
          />
          <div className="flex flex-col gap-16">
            {eraPreviewData.map((era, index) => {
              const alignRight = index % 2 === 1;

              return (
                <motion.article
                  key={era.title}
                  {...fadeIn}
                  transition={{ ...fadeIn.transition, delay: index * 0.1 }}
                  className="relative grid gap-8 md:grid-cols-[1fr_auto_1fr] md:grid-rows-[auto_auto] md:items-start"
                >
                  <div
                    className={`order-2 md:order-1 md:col-span-1 ${alignRight ? "md:col-start-3" : "md:col-start-1"} w-full md:row-span-1`}
                  >
                    <div
                      className={`space-y-3 transition duration-300 ${alignRight ? "md:text-right text-left" : "text-left"} ${
                        era.faded ? "text-[#b3a395]" : "text-[#1d1c1a]"
                      }`}
                    >
                      <div className={`text-xs uppercase tracking-[0.2em] ${era.faded ? "text-[#c0b1a3]" : "text-[#7a7267]"}`}>{era.years}</div>
                      <h3 className={`text-xl font-title-medium uppercase tracking-[0.1em] ${era.faded ? "text-[#b8a99d]" : "text-[#191919]"}`}>{era.title}</h3>
                      <p className={`text-sm leading-relaxed ${era.faded ? "text-[#c7b7ac]" : "text-[#4d463d]"}`}>{era.summary}</p>
                      <div
                        className={`mt-4 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] ${
                          alignRight ? "md:justify-end" : ""
                        } ${era.faded ? "text-[#d1c1b4]" : "text-[#a59c90]"}`}
                      >
                        {era.logos.map((logo) => (
                          <span key={logo} className={`font-semibold ${era.faded ? "text-[#e0d3c9]" : "text-[#c8beb3]"}`}>
                            {logo}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`relative order-1 md:order-2 md:col-start-2 md:row-start-1 flex justify-center items-start md:items-center ${alignRight ? "pt-[52px]" : "pt-7"}`}>
                    <span
                      className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        era.active ? "border-[#FF6B2C] bg-[#FF6B2C]" : era.faded ? "border-[#d7c9bf] bg-[#fff9f3]" : "border-[#d7c9bf] bg-[#fff9f3]"
                      }`}
                    >
                      {!era.active && <span className={`h-2 w-2 rounded-full ${era.faded ? "bg-[#e5ddd4]" : "bg-[#d7c9bf]"}`} />}
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </div>
          {/* <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#ffe8d7]/85 to-[#ffe8d7]"
            aria-hidden="true"
          /> */}
        </div>

        <div className="flex z-[10] justify-center pt-4">
          <Button
            asChild
            className="rounded-full border border-black/5 bg-black px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition hover:scale-[1.01] hover:bg-[#1a1a1a]"
          >
            <Link href="/timeline">
              Explore full timeline
              <ArrowUpRight className="ml-3 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[500px] bg-gradient-to-b from-transparent via-[#ffe8d7]/85 to-[#ffe8d7]"
        aria-hidden="true"
      /> 
    </section>
  );
}

function WhyItMattersSection({ builderCount, milestones }: { builderCount: number; milestones: TimelineEvent[] }) {
  const builderLabel = `[${builderCount.toLocaleString("en-US")} BUILDERS]`

  return (
    <section
      className="relative z-30 -mt-12 overflow-hidden rounded-t-[56px] bg-gradient-to-b from-[#0b0b0b] via-[#050505] to-[#1b0804] px-4 pb-20 pt-14 text-white shadow-[0_50px_140px_rgba(0,0,0,0.4)] sm:-mt-16 sm:px-6 sm:pt-16 md:-mt-20 lg:-mt-[140px] lg:px-8 lg:pt-20"
      aria-labelledby="why-it-matters-heading"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-6 py-16 sm:px-10 md:px-16">
        <div className="grid gap-10 text-white/85 md:grid-cols-3" id="why-it-matters-heading">
          {infoTiles.map((tile, index) => (
            <motion.div key={tile.kicker} {...fadeIn} transition={{ ...fadeIn.transition, delay: index * 0.1 }} className="space-y-4">
              <Glyph variant={tile.icon} />
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.35em] text-white">{tile.kicker}</h3>
              <p className="text-sm leading-relaxed text-white/70">{tile.body}</p>
            </motion.div>
          ))}
        </div>

        <MilestoneSlider milestones={milestones} />

        <div className="flex flex-col items-center gap-6 text-center">
          <span className="inline-flex h-px w-20 bg-white/20" aria-hidden="true" />
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">
            <span className="italic text-white/70">THANK YOU TO THE</span> <span className="font-semibold text-white">{builderLabel}</span> and{" "}
            <span className="font-semibold">[FOUNDERS]</span> <span className="italic text-white/70">FOR SHARING YOUR STORIES.</span>
          </p>
          <Button
            asChild
            className="rounded-full border border-transparent bg-[#FF5728] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_20px_60px_rgba(255,87,40,0.45)] transition hover:bg-[#ff6f46]"
          >
            <Link href="https://tally.so/r/5BKdMP" target="_blank" rel="noreferrer">
              Add your contribution
              <ArrowUpRight className="ml-3 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-[radial-gradient(circle_at_bottom,rgba(255,102,44,0.7),rgba(0,0,0,0))] opacity-90 blur-3xl"
        aria-hidden="true"
      />
    </section>
  )
}

function MilestoneSlider({ milestones }: { milestones: TimelineEvent[] }) {
  if (milestones.length === 0) return null
  const LOOP_MULTIPLIER = 3
  const sliderRef = useRef<HTMLDivElement>(null)
  const setWidthRef = useRef(0)
  const loopedMilestones = useMemo(() => Array.from({ length: LOOP_MULTIPLIER }, () => milestones).flat(), [milestones])

  const scrollByAmount = (delta: number) => {
    if (!sliderRef.current) return

    // Calcular el ancho de una tarjeta más el gap
    const slider = sliderRef.current
    const firstCard = slider.querySelector('button[class*="snap-center"]')
    if (!firstCard) return

    const cardWidth = firstCard.getBoundingClientRect().width
    const gap = 24 // 24px = gap-6 de Tailwind
    const scrollAmount = delta > 0 ? (cardWidth + gap) : -(cardWidth + gap)

    slider.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }
  const router = useRouter()

  const handleScroll = () => {
    const slider = sliderRef.current
    const setWidth = setWidthRef.current
    if (!slider || !setWidth) return

    const minThreshold = setWidth * 0.2
    const maxThreshold = setWidth * (LOOP_MULTIPLIER - 1) - minThreshold

    if (slider.scrollLeft <= minThreshold) {
      slider.scrollLeft += setWidth
    } else if (slider.scrollLeft >= maxThreshold) {
      slider.scrollLeft -= setWidth
    }
  }

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider || loopedMilestones.length === 0) return

    const updateSetWidth = () => {
      setWidthRef.current = slider.scrollWidth / LOOP_MULTIPLIER
    }

    const initialize = () => {
      updateSetWidth()
      slider.scrollLeft = setWidthRef.current
    }

    initialize()

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        initialize()
      })
      resizeObserver.observe(slider)
    }

    return () => resizeObserver?.disconnect()
  }, [loopedMilestones.length])

  return (
    <div className="relative" role="region" aria-label="Key timeline milestones">
      <button
        type="button"
        onClick={() => scrollByAmount(-1)}
        className="pointer-events-auto absolute left-0 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 p-2 text-white transition hover:bg-black/80 sm:flex"
        aria-label="Scroll milestones left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount(1)}
        className="pointer-events-auto absolute right-0 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 p-2 text-white transition hover:bg-black/80 sm:flex"
        aria-label="Scroll milestones right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-6 sm:mx-0 sm:px-0"
      >
        {loopedMilestones.map((milestone, index) => {
          return (
            <button
              key={`${milestone.id}-${index}`}
              type="button"
              onClick={() => router.push(`/timeline?event=${milestone.id}`)}
              className="snap-center shrink-0 basis-[90%] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5728]/60 sm:basis-[70%] lg:basis-[55%]"
            >
              <article className="h-full rounded-[40px] border border-white/10 bg-gradient-to-br from-[#151515] to-[#0a0a0a] px-8 py-10 text-white shadow-[0_25px_70px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out hover:border-[#FF6B2C] hover:shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
                <div className="mb-5 text-[11px] uppercase text-white/60">
                  <span>{formatMilestoneDate(milestone)}</span>
                </div>
                <h3 className="text-2xl font-semibold uppercase text-white">{milestone.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-white/80">{formatHandles(milestone.description)}</p>
              </article>
            </button>
          )
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent" aria-hidden="true" />
    </div>
  )
}

function formatMilestoneDate(event: TimelineEvent) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  if (event.month) {
    return `${months[event.month - 1]} ${event.year}`
  }

  const lowerDate = event.date.toLowerCase()
  const matchedMonth = months.find((month) => lowerDate.includes(month.toLowerCase()))
  return matchedMonth ? `${matchedMonth} ${event.year}` : `${event.year}`
}

function Footer() {
  return (
    <footer className="bg-[#050505] text-white">
      <div className="container flex flex-col gap-10 py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-2xl flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Builders Archive</span>
            <p className="text-base text-white/80">
              Documenting Argentina&apos;s crypto ingenuity, from the first experiments to today&apos;s global-scale infrastructure. Keep exploring the
              timeline or share the next chapter.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
            <Link href="https://crecimiento.build/" target="_blank" rel="noreferrer">
              <Image src="/crecimiento-logo-footer.svg" alt="Crecimiento Logo" width={180} height={50} className="w-36 md:w-44" />
            </Link>
            <Button
              asChild
              className="w-full max-w-[260px] rounded-full border border-white/20 bg-white/10 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20"
            >
              <Link href="/timeline">
                View full timeline
                <ArrowUpRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:text-white md:self-end"
            >
              <Link href="https://tally.so/r/5BKdMP" target="_blank" rel="noreferrer">
                Share a story
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

function Glyph({ variant }: { variant: string }) {
  switch (variant) {
    case "double":
      return (
        <svg viewBox="0 0 80 80" className="h-10 w-10 text-[#FF6B2C]" aria-hidden="true">
          <path d="M0 20a20 20 0 0 1 40 0H0Z" fill="currentColor" />
          <path d="M40 20a20 20 0 0 0 40 0H40Z" fill="currentColor" opacity={0.75} />
        </svg>
      )
    case "stack":
      return (
        <svg viewBox="0 0 80 80" className="h-10 w-10 text-[#FF6B2C]" aria-hidden="true">
          <path d="M0 20h80v20H0z" fill="currentColor" />
          <path d="M0 40h80v20H0z" fill="currentColor" opacity={0.6} />
        </svg>
      )
    case "arc":
    default:
      return (
        <svg viewBox="0 0 80 80" className="h-10 w-10 text-[#FF6B2C]" aria-hidden="true">
          <path d="M0 40a40 40 0 0 1 80 0H0Z" fill="currentColor" />
        </svg>
      )
  }
}

function formatHandles(text: string): ReactNode[] {
  const parts = text.split(/(@[a-zA-Z0-9_]+)/g)
  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <Link
          key={`${part}-${index}`}
          href={`https://twitter.com/${part.slice(1)}`}
          className="text-[#FF8B60] underline decoration-transparent underline-offset-4 transition hover:decoration-[#FF8B60]"
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </Link>
      )
    }
    return <span key={`${part}-${index}`}>{part}</span>
  })
}
