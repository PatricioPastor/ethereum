import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AcercaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to timeline
        </Link>

        <h1 className="text-5xl font-bold mb-6 text-balance">About this project</h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-primary">Purpose</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This interactive timeline documents early events, companies, and Ethereum-related contributions by
              Argentinians from 2008 to 2025. This is not meant as a registry for community developments or community
              contributions—it is a historical record of Argentina's role in Ethereum's development.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Early Ethereum history overlaps with Bitcoin, as such some early Bitcoin-related events have been
              included. Historical markers are there to help us locate events in time and understand the broader context
              of the crypto ecosystem's evolution.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-primary">Methodology</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Events included in this timeline have been collected through:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Research of public sources and specialized media</li>
              <li>Documentation of ecosystem projects and companies</li>
              <li>Interviews and testimonies from key protagonists</li>
              <li>Analysis of social networks and Argentine crypto communities</li>
              <li>Review of historical records from events and conferences</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Each event has been verified with multiple sources when possible, and links to original references are
              included for transparency and verification.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-primary">Inclusion criteria</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Events included meet at least one of these criteria:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <strong>Technical impact:</strong> Technological advances, protocol launches, important audits
              </li>
              <li>
                <strong>Economic impact:</strong> Investment rounds, business adoption, market milestones
              </li>
              <li>
                <strong>Social impact:</strong> Community events, educational initiatives, cultural movements
              </li>
              <li>
                <strong>Regulatory impact:</strong> Legal changes, public policies, regulatory frameworks
              </li>
              <li>
                <strong>Historical relevance:</strong> Firsts, pioneers, defining moments of the ecosystem
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-primary">Team</h2>
            <p className="text-muted-foreground leading-relaxed">
              This project is maintained by members of the Argentine crypto community with the goal of documenting and
              preserving our collective history. If you have suggestions, corrections, or events that should be
              included, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4 text-primary">Technology</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This site is built with modern technologies to ensure a fast and accessible experience:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Next.js 15 with App Router for optimized rendering</li>
              <li>Ethereum-inspired design with dark mode by default</li>
              <li>Virtualized infinite scroll for optimal performance</li>
              <li>Local storage for progress tracking without requiring an account</li>
              <li>Fully responsive and accessible</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
