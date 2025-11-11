"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, X } from "lucide-react"
import { getProgress } from "@/lib/progress-storage"

interface ContinueReadingBannerProps {
  onContinue: (year: number) => void
}

export function ContinueReadingBanner({ onContinue }: ContinueReadingBannerProps) {
  const [lastReadYear, setLastReadYear] = useState<number | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const progress = getProgress()
    if (progress.lastReadYear && progress.lastReadYear > 2008) {
      setLastReadYear(progress.lastReadYear)
    }
  }, [])

  if (!lastReadYear || isDismissed) return null

  return (
    <Card className="mb-8 rounded-none border border-[rgba(31,18,13,0.2)] bg-[#f7f8eb] px-5 py-4 text-[rgba(31,18,13,0.8)] shadow-[4px_4px_0_rgba(31,18,13,0.15)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[-0.08em] text-[rgba(31,18,13,0.55)]">
            Continuar leyendo
          </p>
          <p className="text-sm leading-relaxed">
            Ultima lectura: <span className="font-semibold text-[color:var(--text-color)]">{lastReadYear}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="rounded-none border border-[rgba(31,18,13,0.3)] bg-[color:var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[-0.06em] text-[#f2f3e1] hover:bg-[color:var(--text-color)]"
            onClick={() => {
              onContinue(lastReadYear)
              setIsDismissed(true)
            }}
          >
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none border border-[rgba(31,18,13,0.25)] bg-transparent text-[rgba(31,18,13,0.7)] hover:bg-[color:var(--accent)] hover:text-[#f2f3e1]"
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}



