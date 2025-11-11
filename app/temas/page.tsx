import { ThemeCard } from "@/components/theme-card"
import { themes } from "@/lib/theme-data"
import { timelineData } from "@/lib/timeline-data"
import { TimelineHeader } from "@/components/timeline-header"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TemasPage() {
  // Count events per theme
  const eventCounts = themes.reduce(
    (acc, theme) => {
      acc[theme.id] = timelineData.reduce((count, group) => {
        return count + group.events.filter((event) => event.tags.includes(theme.id)).length
      }, 0)
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="flex flex-col min-h-screen">
      <TimelineHeader />

      <main className="flex-1">
        <div className="container max-w-6xl px-4 py-8">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a la línea de tiempo
              </Link>
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Explorar por Tema</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Descubre los eventos organizados por categorías temáticas del ecosistema cripto argentino.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} eventCount={eventCounts[theme.id] || 0} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
