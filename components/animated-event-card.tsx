"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import type { TimelineEvent } from "@/lib/data-parser"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, ChevronDown, ChevronUp, Link2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedEventCardProps {
  event: TimelineEvent
  index: number
  onEntityClick?: (entityId: string) => void
  onShowRelations?: (event: TimelineEvent) => void
  onView?: (eventTitle: string) => void
  variant?: "default" | "featured" | "compact"
}

export function AnimatedEventCard({
  event,
  index,
  onEntityClick,
  onShowRelations,
  onView,
  variant = "default",
}: AnimatedEventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded && onView) {
      onView(event.title)
    }
  }

  const importanceStyles = {
    high: {
      border: "border-l-4 border-l-primary",
      title: "text-lg font-bold",
      badge: "bg-primary/20 text-primary border-primary/30",
      glow: "shadow-primary/20",
    },
    medium: {
      border: "border-l-4 border-l-chart-2",
      title: "text-base font-semibold",
      badge: "bg-chart-2/20 text-chart-2 border-chart-2/30",
      glow: "shadow-chart-2/20",
    },
    low: {
      border: "border-l-2 border-l-muted-foreground/30",
      title: "text-base font-medium",
      badge: "bg-muted text-muted-foreground border-muted-foreground/30",
      glow: "shadow-muted/20",
    },
  }

  const style = importanceStyles[event.importance]

  const variantStyles = {
    featured: "md:col-span-2 bg-gradient-to-br from-primary/5 to-transparent",
    default: "",
    compact: "text-sm",
  }

  const isFeatured = variant === "featured" || event.importance === "high"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      data-event-id={event.title}
      className={variantStyles[variant]}
    >
      <motion.div whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.2 }}>
        <Card
          className={cn(
            style.border,
            "transition-all duration-200 relative overflow-hidden",
            "hover:shadow-xl",
            style.glow,
            "focus-within:shadow-xl focus-within:ring-2 focus-within:ring-primary/20",
            isFeatured && "bg-gradient-to-br from-primary/5 via-transparent to-transparent",
          )}
          tabIndex={0}
        >
          {isFeatured && (
            <motion.div
              className="absolute top-3 right-3"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
          )}

          <CardHeader className={cn("pb-3", isFeatured && "pt-6")}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <motion.div
                  className="flex items-center gap-2 mb-3 flex-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {event.date && (
                    <Badge variant="outline" className={cn("text-xs font-mono", style.badge)}>
                      {event.date}
                    </Badge>
                  )}
                  {event.tags.slice(0, isFeatured ? 5 : 3).map((tag, i) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Badge variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
                <h3 className={cn(style.title, "leading-tight text-balance", isFeatured && "text-xl md:text-2xl")}>
                  {event.title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setIsSaved(!isSaved)}
                aria-label={isSaved ? "Remove bookmark" : "Add bookmark"}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale: isSaved ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Bookmark className={cn("h-4 w-4", isSaved && "fill-current text-primary")} />
                </motion.div>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <motion.div initial={false} animate={{ height: "auto" }} transition={{ duration: 0.3 }}>
              <p
                className={cn(
                  "text-muted-foreground leading-relaxed",
                  isFeatured ? "text-base" : "text-sm",
                  !isExpanded && (isFeatured ? "line-clamp-3" : "line-clamp-2"),
                )}
              >
                {event.description}
              </p>
            </motion.div>

            {event.entities.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {event.entities.slice(0, isExpanded ? undefined : isFeatured ? 5 : 3).map((entity, i) => (
                  <motion.div
                    key={entity}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.03 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs bg-transparent hover:bg-primary/10"
                      onClick={() => onEntityClick?.(entity)}
                    >
                      @{entity}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpand}
                className="text-xs hover:text-primary"
                aria-label={isExpanded ? "Show less content" : "Show more content"}
                aria-expanded={isExpanded}
              >
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }} className="mr-1">
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </motion.div>
                {isExpanded ? "Show less" : "Show more"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs hover:text-primary"
                onClick={() => onShowRelations?.(event)}
                aria-label="Show related events"
              >
                <Link2 className="h-3 w-3 mr-1" />
                Related
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
