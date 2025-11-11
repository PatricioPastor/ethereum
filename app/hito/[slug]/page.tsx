import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag, ExternalLink, Bookmark, Share2 } from "lucide-react"
import { getTimelineData } from "@/lib/timeline-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export async function generateStaticParams() {
  const data = getTimelineData()
  const allEvents = data.flatMap((year) => year.events)

  return allEvents.map((event) => ({
    slug: event.id,
  }))
}

export default function HitoPage({ params }: { params: { slug: string } }) {
  const data = getTimelineData()
  const allEvents = data.flatMap((year) => year.events)
  const event = allEvents.find((e) => e.id === params.slug)

  if (!event) {
    notFound()
  }

  const yearData = data.find((y) => y.events.some((e) => e.id === params.slug))
  const relatedEvents = allEvents
    .filter(
      (e) =>
        e.id !== event.id &&
        (e.tags.some((tag) => event.tags.includes(tag)) ||
          e.entities.some((entity) => event.entities.includes(entity))),
    )
    .slice(0, 5)

  const importanceLabel = event.importance === 3 ? "Alta" : event.importance === 2 ? "Media" : "Baja"
  const importanceColor =
    event.importance === 3
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : event.importance === 2
        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
        : "bg-blue-500/10 text-blue-400 border-blue-500/20"

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#627EEA] hover:text-[#7B94F3] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al timeline
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="text-[#627EEA] border-[#627EEA]">
              <Calendar className="w-3 h-3 mr-1" />
              {event.date}
            </Badge>
            <Badge variant="outline" className={importanceColor}>
              Importancia: {importanceLabel}
            </Badge>
          </div>

          <h1 className="text-5xl font-bold mb-6 text-balance leading-tight">{event.title}</h1>

          <div className="flex gap-3 mb-8">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Bookmark className="w-4 h-4" />
              Guardar
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-300 leading-relaxed">{event.summary}</p>
        </div>

        {event.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 mb-3">TEMAS</h2>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-[#1A1B1F] text-gray-300">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {event.entities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 mb-3">PERSONAS Y ORGANIZACIONES</h2>
            <div className="flex flex-wrap gap-2">
              {event.entities.map((entity) => (
                <a
                  key={entity}
                  href={`https://twitter.com/${entity.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#1A1B1F] hover:bg-[#627EEA]/10 border border-gray-800 hover:border-[#627EEA] rounded-full text-sm text-gray-300 hover:text-[#627EEA] transition-colors"
                >
                  {entity}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {event.links && event.links.length > 0 && (
          <div className="mb-12 p-6 bg-[#1A1B1F] rounded-lg border border-gray-800">
            <h2 className="text-lg font-semibold mb-4 text-[#627EEA]">Referencias y enlaces</h2>
            <ul className="space-y-2">
              {event.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-[#627EEA] transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                    <span className="text-sm break-all">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {relatedEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-[#627EEA]">Eventos relacionados</h2>
            <div className="space-y-4">
              {relatedEvents.map((relatedEvent) => {
                const relatedYear = data.find((y) => y.events.some((e) => e.id === relatedEvent.id))
                return (
                  <Link
                    key={relatedEvent.id}
                    href={`/hito/${relatedEvent.id}`}
                    className="block p-4 bg-[#1A1B1F] hover:bg-[#1A1B1F]/80 border border-gray-800 hover:border-[#627EEA] rounded-lg transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-1">{relatedEvent.date}</div>
                        <h3 className="font-semibold text-white mb-2">{relatedEvent.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{relatedEvent.summary}</p>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-gray-600 rotate-180 flex-shrink-0" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
