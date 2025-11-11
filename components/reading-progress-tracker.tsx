"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"

interface ReadingProgressTrackerProps {
  totalEvents: number
  viewedEvents: Set<string>
}

export function ReadingProgressTracker({ totalEvents, viewedEvents }: ReadingProgressTrackerProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const percentage = totalEvents > 0 ? (viewedEvents.size / totalEvents) * 100 : 0
    setProgress(percentage)
  }, [viewedEvents.size, totalEvents])

  return (
    <div
      className="fixed bottom-6 right-6 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg w-64 z-50"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Reading Progress</span>
        <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
      </div>

      <Progress value={progress} className="h-2 mb-2" aria-label={`Reading progress: ${Math.round(progress)}%`} />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {viewedEvents.size} of {totalEvents} events
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  )
}
