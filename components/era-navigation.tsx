"use client"

import { Button } from "@/components/ui/button"
import { getAllEras, type Era } from "@/lib/era-data"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface EraNavigationProps {
  currentEra: Era | null
  onEraChange: (era: Era, options?: { trigger?: "arrow" | "manual" }) => void
}

export function EraNavigation({ currentEra, onEraChange }: EraNavigationProps) {
  const eras = getAllEras()
  const currentIndex = currentEra ? eras.findIndex((e) => e.id === currentEra.id) : -1
  const accent = "#ff5728"

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onEraChange(eras[currentIndex - 1], { trigger: "arrow" })
    }
  }

  const handleNext = () => {
    if (currentIndex < eras.length - 1) {
      onEraChange(eras[currentIndex + 1], { trigger: "arrow" })
    }
  }

  return (
    <div className="mb-6 flex flex-col gap-3 text-[rgba(31,18,13,0.75)]" style={{ ["--accent" as any]: accent }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[-0.08em] text-[rgba(31,18,13,0.55)]">
            Current era
          </span>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-2xl font-semibold leading-tight text-[color:var(--text-color)]">
            {currentEra?.name ?? "Choose an era"}
          </span>
          {currentEra && (
            <span className="text-sm uppercase tracking-[-0.06em] text-[rgba(31,18,13,0.55)]">
              {currentEra.yearStart} - {currentEra.yearEnd}
            </span>
          )}
        </div>
      </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex <= 0}
            aria-label="Previous era"
            className="rounded-none border border-[rgba(31,18,13,0.35)] bg-transparent px-3 py-2 text-xs uppercase tracking-[-0.08em] text-[rgba(31,18,13,0.75)] hover:bg-[color:var(--accent)] hover:text-[#f2f3e1]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex >= eras.length - 1}
            aria-label="Next era"
            className="rounded-none border border-[rgba(31,18,13,0.35)] bg-transparent px-3 py-2 text-xs uppercase tracking-[-0.08em] text-[rgba(31,18,13,0.75)] hover:bg-[color:var(--accent)] hover:text-[#f2f3e1]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {eras.map((era, index) => {
          const isActive = index === currentIndex
          const isPast = index < currentIndex
          return (
            <button
              key={era.id}
              onClick={() => onEraChange(era, { trigger: "manual" })}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                isActive
                  ? "bg-[color:var(--accent)]"
                  : isPast
                    ? "bg-[color:var(--accent)]/45"
                    : "bg-[rgba(31,18,13,0.2)]"
              }`}
              aria-label={`${era.name} (${era.yearStart}-${era.yearEnd})`}
              aria-current={isActive ? "true" : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
