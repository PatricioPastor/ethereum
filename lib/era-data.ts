export interface Era {
  id: string
  name: string
  nameEs: string
  description: string
  descriptionEs: string
  yearStart: number
  yearEnd: number
  color: string
  accentColor: string
}

export const ERAS: Era[] = [
  {
    id: "genesis",
    name: "Genesis & Early Builders",
    nameEs: "Genesis y primeros builders",
    description:
      "Bitcoin lands, the first wallets emerge, and Argentine pioneers begin shaping what will become a thriving crypto landscape.",
    descriptionEs:
      "Llega Bitcoin, aparecen las primeras wallets y los pioneros argentinos empiezan a moldear lo que sera un ecosistema crypto vibrante.",
    yearStart: 2008,
    yearEnd: 2013,
    color: "from-blue-950 to-blue-900",
    accentColor: "text-blue-400",
  },
  {
    id: "ecosystem-foundations",
    name: "Emergence & Ecosystem Foundations",
    nameEs: "Fundaciones del ecosistema",
    description:
      "Communities organize, cultural landmarks appear, and the groundwork for Argentinas Ethereum presence solidifies.",
    descriptionEs:
      "Las comunidades se organizan, surgen hitos culturales y se consolida la base de la presencia argentina en Ethereum.",
    yearStart: 2014,
    yearEnd: 2016,
    color: "from-purple-950 to-purple-900",
    accentColor: "text-purple-400",
  },
  {
    id: "ethereum-era",
    name: "Expansion & Ethereum Era",
    nameEs: "Expansion y era Ethereum",
    description:
      "Builders rally around Ethereum, new protocols launch, and Argentina gains a reputation for world-class engineering.",
    descriptionEs:
      "Los builders se unen alrededor de Ethereum, nacen nuevos protocolos y Argentina gana reputacion por su ingenieria de clase mundial.",
    yearStart: 2017,
    yearEnd: 2020,
    color: "from-violet-950 to-violet-900",
    accentColor: "text-violet-400",
  },
  {
    id: "defi-nft-growth",
    name: "DeFi, NFTs & Institutional Growth",
    nameEs: "DeFi, NFTs y crecimiento institucional",
    description:
      "DeFi Summer, NFT experimentation, and institutional adoption put Argentine teams in the global spotlight.",
    descriptionEs:
      "DeFi Summer, la experimentacion con NFTs y la adopcion institucional ponen a los equipos argentinos en el foco global.",
    yearStart: 2021,
    yearEnd: 2023,
    color: "from-primary/20 to-primary/10",
    accentColor: "text-primary",
  },
  {
    id: "zk-ai-leadership",
    name: "ZK, AI & Global Leadership",
    nameEs: "ZK, IA y liderazgo global",
    description:
      "Zero-knowledge, artificial intelligence, and public goods collide, with Argentine contributors leading international coalitions.",
    descriptionEs:
      "Zero-knowledge, inteligencia artificial y bienes publicos convergen con contribuciones argentinas liderando coaliciones internacionales.",
    yearStart: 2024,
    yearEnd: 2025,
    color: "from-orange-950 to-orange-900",
    accentColor: "text-orange-400",
  },
];

export function getEraForYear(year: number): Era | undefined {
  return ERAS.find((era) => year >= era.yearStart && year <= era.yearEnd)
}

export function getAllEras(): Era[] {
  return ERAS
}

export function getEraById(id: string): Era | undefined {
  return ERAS.find((era) => era.id === id)
}

export function getYearsInEra(eraId: string): number[] {
  const era = getEraById(eraId)
  if (!era) return []

  const years: number[] = []
  for (let year = era.yearStart; year <= era.yearEnd; year++) {
    years.push(year)
  }
  return years
}
