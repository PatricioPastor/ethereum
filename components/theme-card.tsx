import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import type { ThemeInfo } from "@/lib/theme-data"

interface ThemeCardProps {
  theme: ThemeInfo
  eventCount: number
}

export function ThemeCard({ theme, eventCount }: ThemeCardProps) {
  return (
    <Link href={`/temas/${theme.id}`}>
      <Card
        className={cn(
          "group hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50",
          "bg-gradient-to-br",
          theme.color,
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="text-4xl mb-2">{theme.icon}</div>
            <Badge variant="secondary" className="text-xs">
              {eventCount} eventos
            </Badge>
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">{theme.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{theme.description}</p>
          <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
            Explorar
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
