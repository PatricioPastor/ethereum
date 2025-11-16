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
    name: "Genesis",
    nameEs: "Génesis",
    description:
      "Early bitcoin experiments, Xapo, the first Argentinian crypto security firms, exchanges, and Casa Voltaire.",
    descriptionEs:
      "Primeros experimentos con Bitcoin, Xapo, las primeras firmas de seguridad crypto argentinas, exchanges y Casa Voltaire.",
    yearStart: 2008,
    yearEnd: 2015,
    color: "from-blue-950 to-blue-900",
    accentColor: "text-blue-400",
  },
  {
    id: "emergence",
    name: "Emergence",
    nameEs: "Emergencia",
    description:
      "Community meetups emerge, early contributions to ERC standards and DeFi, decentralized justice, ETHBuenosAires.",
    descriptionEs:
      "Surgen meetups comunitarios, primeras contribuciones a estándares ERC y DeFi, justicia descentralizada, ETHBuenosAires.",
    yearStart: 2016,
    yearEnd: 2019,
    color: "from-purple-950 to-purple-900",
    accentColor: "text-purple-400",
  },
  {
    id: "growth",
    name: "Growth",
    nameEs: "Crecimiento",
    description:
      "DeFi, security, identity, node infrastructure, and data products ripple outward. Argentine contributions scale globally.",
    descriptionEs:
      "DeFi, seguridad, identidad, infraestructura de nodos y productos de datos se expanden. Las contribuciones argentinas escalan globalmente.",
    yearStart: 2021,
    yearEnd: 2022,
    color: "from-violet-950 to-violet-900",
    accentColor: "text-violet-400",
  },
  {
    id: "scaling",
    name: "Scaling",
    nameEs: "Escalando",
    description:
      "Zero-knowledge proofs, L2 solutions, institutional adoption, and regulatory frameworks position Argentina as a global crypto hub.",
    descriptionEs:
      "Pruebas de conocimiento cero, soluciones L2, adopción institucional y marcos regulatorios posicionan a Argentina como un hub crypto global.",
    yearStart: 2023,
    yearEnd: 2025,
    color: "from-primary/20 to-primary/10",
    accentColor: "text-primary",
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
