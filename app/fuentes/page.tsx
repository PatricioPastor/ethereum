import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export default function FuentesPage() {
  const sources = [
    {
      category: 'Medios especializados',
      items: [
        { name: 'CriptoNoticias', url: 'https://criptonoticias.com' },
        { name: 'Diario Bitcoin', url: 'https://diariobitcoin.com' },
        { name: 'Cointelegraph en Español', url: 'https://es.cointelegraph.com' },
      ]
    },
    {
      category: 'Proyectos y empresas',
      items: [
        { name: 'Ripio', url: 'https://ripio.com' },
        { name: 'OpenZeppelin', url: 'https://openzeppelin.com' },
        { name: 'Decentraland', url: 'https://decentraland.org' },
        { name: 'Kleros', url: 'https://kleros.io' },
        { name: 'Exactly Protocol', url: 'https://exact.ly' },
      ]
    },
    {
      category: 'Comunidades y organizaciones',
      items: [
        { name: 'Bitcoin Argentina', url: 'https://bitcoinargentina.org' },
        { name: 'Ethereum Argentina', url: 'https://ethereumargentina.org' },
        { name: 'Blockchain Summit Latam', url: 'https://blockchainsummit.la' },
      ]
    },
    {
      category: 'Recursos técnicos',
      items: [
        { name: 'GitHub - OpenZeppelin', url: 'https://github.com/OpenZeppelin' },
        { name: 'GitHub - Decentraland', url: 'https://github.com/decentraland' },
        { name: 'Ethereum.org', url: 'https://ethereum.org' },
      ]
    },
    {
      category: 'Regulación y gobierno',
      items: [
        { name: 'Banco Central de la República Argentina', url: 'https://bcra.gob.ar' },
        { name: 'Comisión Nacional de Valores', url: 'https://cnv.gov.ar' },
      ]
    }
  ]

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

        <h1 className="text-5xl font-bold mb-6 text-balance">Fuentes y referencias</h1>
        
        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          Este timeline ha sido construido utilizando información de múltiples fuentes confiables. 
          A continuación, las principales referencias utilizadas para documentar la historia del 
          ecosistema cripto argentino.
        </p>

        <div className="space-y-12">
          {sources.map((section) => (
            <section key={section.category}>
              <h2 className="text-2xl font-semibold mb-4 text-[#627EEA]">
                {section.category}
              </h2>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-300 hover:text-[#627EEA] transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-500">{item.url}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-16 p-6 bg-[#1A1B1F] rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold mb-3 text-[#627EEA]">Contribuye</h3>
          <p className="text-gray-300 leading-relaxed">
            Si conoces fuentes adicionales que deberían incluirse, o si encuentras información 
            que necesita corrección, por favor ayúdanos a mejorar este recurso. La precisión 
            histórica es fundamental para preservar nuestra memoria colectiva.
          </p>
        </div>
      </div>
    </div>
  )
}
