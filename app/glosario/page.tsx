import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function GlosarioPage() {
  const glossaryTerms = [
    {
      letter: 'A',
      terms: [
        { term: 'Airdrop', definition: 'Distribución gratuita de tokens a wallets específicas, generalmente como estrategia de marketing o recompensa a usuarios tempranos.' },
        { term: 'Auditoría de seguridad', definition: 'Revisión exhaustiva del código de un smart contract para identificar vulnerabilidades y garantizar su seguridad antes del despliegue.' },
      ]
    },
    {
      letter: 'B',
      terms: [
        { term: 'Blockchain', definition: 'Tecnología de registro distribuido que almacena información en bloques enlazados criptográficamente, creando un historial inmutable de transacciones.' },
        { term: 'Bitcoin', definition: 'Primera criptomoneda descentralizada, creada en 2008 por Satoshi Nakamoto. Funciona como dinero digital peer-to-peer sin intermediarios.' },
      ]
    },
    {
      letter: 'D',
      terms: [
        { term: 'DAO', definition: 'Organización Autónoma Descentralizada. Entidad gobernada por smart contracts y sus miembros, sin estructura jerárquica tradicional.' },
        { term: 'DeFi', definition: 'Finanzas Descentralizadas. Ecosistema de aplicaciones financieras construidas sobre blockchain que operan sin intermediarios tradicionales.' },
        { term: 'Dapp', definition: 'Aplicación descentralizada que funciona sobre una blockchain, típicamente con un frontend y smart contracts como backend.' },
      ]
    },
    {
      letter: 'E',
      terms: [
        { term: 'Ethereum', definition: 'Plataforma blockchain que permite crear smart contracts y aplicaciones descentralizadas. Segunda criptomoneda más grande por capitalización.' },
        { term: 'ERC-20', definition: 'Estándar técnico para tokens fungibles en Ethereum. Define reglas comunes que todos los tokens deben seguir.' },
      ]
    },
    {
      letter: 'G',
      terms: [
        { term: 'Gas', definition: 'Unidad que mide el costo computacional de ejecutar operaciones en Ethereum. Los usuarios pagan gas fees para procesar transacciones.' },
        { term: 'Gobernanza', definition: 'Sistema mediante el cual los holders de tokens pueden votar y decidir sobre cambios en un protocolo o DAO.' },
      ]
    },
    {
      letter: 'M',
      terms: [
        { term: 'Metaverso', definition: 'Espacio virtual compartido y persistente donde usuarios pueden interactuar mediante avatares, típicamente con economía basada en blockchain.' },
        { term: 'Minería', definition: 'Proceso de validar transacciones y crear nuevos bloques en blockchains de Proof of Work, recompensado con criptomonedas.' },
      ]
    },
    {
      letter: 'N',
      terms: [
        { term: 'NFT', definition: 'Token No Fungible. Activo digital único e indivisible que representa propiedad de un item específico, como arte digital o coleccionables.' },
        { term: 'Node', definition: 'Computadora que ejecuta el software de una blockchain y mantiene una copia del registro distribuido.' },
      ]
    },
    {
      letter: 'S',
      terms: [
        { term: 'Smart Contract', definition: 'Programa autoejectable almacenado en blockchain que ejecuta acciones automáticamente cuando se cumplen condiciones predefinidas.' },
        { term: 'Staking', definition: 'Proceso de bloquear criptomonedas para apoyar operaciones de una blockchain y recibir recompensas, común en sistemas Proof of Stake.' },
      ]
    },
    {
      letter: 'T',
      terms: [
        { term: 'Token', definition: 'Unidad de valor digital creada sobre una blockchain existente, puede representar activos, utilidad o derechos de gobernanza.' },
        { term: 'TVL', definition: 'Total Value Locked. Métrica que mide el valor total de activos depositados en un protocolo DeFi.' },
      ]
    },
    {
      letter: 'W',
      terms: [
        { term: 'Wallet', definition: 'Aplicación que permite almacenar, enviar y recibir criptomonedas. Puede ser custodial (exchange) o no-custodial (usuario controla claves).' },
        { term: 'Web3', definition: 'Visión de internet descentralizada basada en blockchain, donde usuarios controlan sus datos y activos digitales.' },
      ]
    },
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

        <h1 className="text-5xl font-bold mb-6 text-balance">Glosario</h1>
        
        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          Términos clave del ecosistema cripto y blockchain para ayudarte a entender mejor 
          los eventos del timeline.
        </p>

        <div className="space-y-12">
          {glossaryTerms.map((section) => (
            <section key={section.letter} id={section.letter}>
              <h2 className="text-4xl font-bold mb-6 text-[#627EEA]">
                {section.letter}
              </h2>
              <dl className="space-y-6">
                {section.terms.map((item) => (
                  <div key={item.term} className="border-l-2 border-[#627EEA] pl-4">
                    <dt className="text-xl font-semibold mb-2 text-white">
                      {item.term}
                    </dt>
                    <dd className="text-gray-300 leading-relaxed">
                      {item.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <div className="mt-16 p-6 bg-[#1A1B1F] rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold mb-3 text-[#627EEA]">Nota</h3>
          <p className="text-gray-300 leading-relaxed">
            Este glosario cubre los términos más comunes encontrados en el timeline. 
            Para definiciones más técnicas o específicas, consulta las fuentes especializadas 
            en la sección de referencias.
          </p>
        </div>
      </div>
    </div>
  )
}
