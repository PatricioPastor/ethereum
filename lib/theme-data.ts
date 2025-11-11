import type { Theme } from "./types"

export interface ThemeInfo {
  id: Theme
  name: string
  description: string
  icon: string
  color: string
}

export const themes: ThemeInfo[] = [
  {
    id: "defi",
    name: "DeFi",
    description: "Finanzas descentralizadas, lending, stablecoins y protocolos",
    icon: "💰",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "nfts",
    name: "NFTs",
    description: "Tokens no fungibles, metaverso y coleccionables digitales",
    icon: "🎨",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "security",
    name: "Seguridad",
    description: "Auditorías, hacks y mejores prácticas de seguridad",
    icon: "🔒",
    color: "from-red-500/20 to-orange-500/20",
  },
  {
    id: "governance",
    name: "Gobernanza",
    description: "DAOs, votaciones y sistemas de decisión descentralizados",
    icon: "🗳️",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "infrastructure",
    name: "Infraestructura",
    description: "Protocolos, redes y desarrollo de blockchain",
    icon: "⚙️",
    color: "from-gray-500/20 to-slate-500/20",
  },
  {
    id: "education",
    name: "Educación",
    description: "Hackathons, conferencias y formación",
    icon: "📚",
    color: "from-yellow-500/20 to-amber-500/20",
  },
  {
    id: "regulation",
    name: "Regulación",
    description: "Leyes, políticas y marco legal",
    icon: "⚖️",
    color: "from-indigo-500/20 to-violet-500/20",
  },
  {
    id: "community",
    name: "Comunidad",
    description: "Meetups, eventos y construcción de comunidad",
    icon: "👥",
    color: "from-teal-500/20 to-green-500/20",
  },
]
