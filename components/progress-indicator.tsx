"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { getProgress } from "@/lib/progress-storage"
import type { YearGroup } from "@/lib/types"

interface ProgressIndicatorProps {
  yearGroups: YearGroup[]
}

export function ProgressIndicator({ yearGroups }: ProgressIndicatorProps) {
  const [progressPercent, setProgressPercent] = useState(0)
  const [readCount, setReadCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const progress = getProgress()
    const total = yearGroups.reduce((sum, group) => sum + group.events.length, 0)
    const read = progress.readEvents.length

    setReadCount(read)
    setTotalCount(total)
    setProgressPercent(total > 0 ? (read / total) * 100 : 0)
  }, [yearGroups])

  if (totalCount === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progreso de lectura</span>
        <span className="font-medium">
          {readCount} / {totalCount}
        </span>
      </div>
      <Progress value={progressPercent} className="h-2" />
      <p className="text-xs text-muted-foreground">{progressPercent.toFixed(0)}% completado</p>
    </div>
  )
}
