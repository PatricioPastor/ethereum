/**
 * Generate compelling, professional titles for timeline events
 * Rules:
 * - Max 7 substantive words + 4 connectors
 * - Professional tone, not exaggerated
 * - Create hooks without being clickbait
 */

export function generateEventTitle(description: string, date: string): string {
  const lowerDesc = description.toLowerCase()
  const lowerDate = date.toLowerCase()

  // First/Launch patterns - innovation hooks
  if (lowerDesc.includes("first") && lowerDesc.includes("non-financial")) {
    return "First Non-Financial Blockchain Application"
  }
  if (lowerDesc.includes("first") && lowerDesc.includes("political party")) {
    return "First Digital Political Party in Americas"
  }
  if (lowerDesc.includes("first") && lowerDesc.includes("bank") && lowerDesc.includes("crypto")) {
    return "Bank Enables Cross-Border Payments via Bitcoin"
  }
  if (lowerDesc.includes("first") && lowerDesc.includes("university")) {
    return "Argentina's First University Blockchain Lab"
  }
  if (lowerDesc.includes("first") && lowerDesc.includes("turing-complete")) {
    return "First Turing-Complete Cryptocurrency Launches"
  }

  // Founding/Launch patterns - origin stories
  if (lowerDesc.includes("bitcoin was introduced") || lowerDesc.includes("white paper")) {
    return "Bitcoin Introduced via Satoshi's White Paper"
  }
  if (lowerDesc.includes("genesis block") || lowerDesc.includes("bitcoin network officially launched")) {
    return "Bitcoin Network Launches with Genesis Block"
  }
  if (lowerDesc.includes("xapo was founded") || (lowerDesc.includes("xapo") && lowerDesc.includes("vault"))) {
    return "Xapo Founded as Bitcoin Vault Service"
  }
  if (lowerDesc.includes("ripio") && (lowerDesc.includes("founded") || lowerDesc.includes("bitpagos"))) {
    return "Ripio Launches Bitcoin Exchange for Argentina"
  }
  if (lowerDesc.includes("casa voltaire")) {
    return "Casa Voltaire Becomes Crypto Coworking Commune"
  }
  if (lowerDesc.includes("openzeppelin") && lowerDesc.includes("began working")) {
    return "OpenZeppelin Begins Building Security Framework"
  }
  if (lowerDesc.includes("decentraland") && lowerDesc.includes("first blockchain virtual world")) {
    return "Decentraland Envisions User-Owned Metaverse"
  }
  if (lowerDesc.includes("kleros") && lowerDesc.includes("founded")) {
    return "Kleros Pioneers Decentralized Justice System"
  }
  if (lowerDesc.includes("poap") && lowerDesc.includes("founded")) {
    return "POAP Creates Digital Badges for Memories"
  }
  if (lowerDesc.includes("hardhat") && lowerDesc.includes("v2.0.0")) {
    return "Hardhat v2.0 Transforms Ethereum Development"
  }
  if (lowerDesc.includes("proof of humanity") && lowerDesc.includes("launched")) {
    return "Proof of Humanity Verifies Real Humans"
  }

  // Meetup/Community patterns
  if (lowerDesc.includes("labitconf") && lowerDesc.includes("first")) {
    return "LaBitConf Cements Argentina as Bitcoin Leader"
  }
  if (lowerDesc.includes("ethbuenosaires") && lowerDesc.includes("first")) {
    return "ETHBuenosAires Hosts First Latin America Hackathon"
  }
  if (lowerDesc.includes("eth latam")) {
    return "ETH Latam Unites Global Crypto Communities"
  }
  if (lowerDesc.includes("aleph") && lowerDesc.includes("pop-up city")) {
    return "Aleph Positions Argentina as Crypto Capital"
  }

  // Technical achievement patterns
  if (lowerDesc.includes("ethereum") && lowerDesc.includes("introduced")) {
    return "Vitalik Introduces Ethereum to the World"
  }
  if (lowerDesc.includes("frontier") && lowerDesc.includes("live")) {
    return "Ethereum Frontier Enables Smart Contracts"
  }
  if (lowerDesc.includes("rootstock") && lowerDesc.includes("whitepaper")) {
    return "Rootstock Brings Smart Contracts to Bitcoin"
  }
  if (lowerDesc.includes("rootstock") && lowerDesc.includes("mainnet")) {
    return "Rootstock Mainnet Goes Live"
  }
  if (lowerDesc.includes("erc-721") && lowerDesc.includes("formalized")) {
    return "Argentines Help Formalize NFT Standard"
  }
  if (lowerDesc.includes("weth") && lowerDesc.includes("deployed")) {
    return "WETH Contract Standardizes Wrapped Ethereum"
  }
  if (lowerDesc.includes("dai") && (lowerDesc.includes("launched") || lowerDesc.includes("sai"))) {
    return "DAI Stablecoin Launches from Buenos Aires"
  }
  if (lowerDesc.includes("merge") || lowerDesc.includes("proof-of-stake")) {
    return "Ethereum Transitions to Proof-of-Stake"
  }

  // Product/Feature launches
  if (lowerDesc.includes("debit card") && lowerDesc.includes("xapo")) {
    return "Xapo Introduces Bitcoin-Backed Debit Card"
  }
  if (lowerDesc.includes("muun") && lowerDesc.includes("launch")) {
    return "Muun Wallet Launches for Bitcoin"
  }
  if (lowerDesc.includes("lemon") && lowerDesc.includes("founded")) {
    return "Lemon Brings Crypto to Mainstream Retail"
  }
  if (lowerDesc.includes("exactly") && lowerDesc.includes("founded")) {
    return "Exactly Protocol Enables Fixed-Rate DeFi"
  }
  if (lowerDesc.includes("exactly") && lowerDesc.includes("exa card")) {
    return "Exactly Releases Crypto-Backed Credit Card"
  }

  // Funding/Growth patterns
  if (lowerDesc.includes("ico") && lowerDesc.includes("raising")) {
    const amountMatch = description.match(/\$(\d+)M/i)
    if (amountMatch) {
      return `ICO Raises $${amountMatch[1]}M for Crypto Platform`
    }
    return "ICO Raises Millions for Crypto Lending"
  }
  if (lowerDesc.includes("million users")) {
    return "Platform Reaches One Million Users"
  }

  // Collaboration/Partnership patterns
  if (lowerDesc.includes("dao hack") && lowerDesc.includes("openzeppelin")) {
    return "OpenZeppelin Secures Smart Contracts Post-Hack"
  }
  if (lowerDesc.includes("european union") && lowerDesc.includes("kleros")) {
    return "Kleros Collaborates with European Union"
  }
  if (lowerDesc.includes("mendoza") && lowerDesc.includes("court")) {
    return "Kleros Partners with Provincial Court"
  }

  // Regulatory/Legal patterns
  if (lowerDesc.includes("exchange law") || lowerDesc.includes("virtual asset")) {
    return "Argentina Defines Virtual Asset Regulations"
  }
  if (lowerDesc.includes("tax law") && lowerDesc.includes("blanqueo")) {
    return "Tax Law Includes Crypto Asset Disclosure"
  }
  if (lowerDesc.includes("tokenization regime")) {
    return "Argentina Launches Regulated Tokenization Regime"
  }

  // Audit/Security patterns
  if (lowerDesc.includes("audit") && lowerDesc.includes("zcash")) {
    return "Coinspect Audits zCash Initial Codebase"
  }
  if (lowerDesc.includes("red guild") && lowerDesc.includes("announced")) {
    return "Red Guild Safeguards Ethereum Applications"
  }
  if (lowerDesc.includes("phishing dojo")) {
    return "Red Guild Releases Web3 Security Trainer"
  }

  // Default patterns based on keywords
  if (lowerDesc.includes("founded") || lowerDesc.includes("co-founded")) {
    const match = description.match(/([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\s+(?:was\s+)?(?:co-)?founded/i)
    if (match) {
      return `${match[1]} Founded by Argentine Team`
    }
  }
  if (lowerDesc.includes("launched")) {
    const match = description.match(/([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\s+(?:was\s+)?launched/i)
    if (match) {
      return `${match[1]} Launches in Argentina`
    }
  }

  // Fallback: Extract first meaningful phrase (max 7 words)
  const sentences = description.split(/[.!?]/)
  const firstSentence = sentences[0]?.trim() || description
  const words = firstSentence.split(/\s+/)

  // Remove date prefixes and connectors to count substantive words
  const substantiveWords = words.filter(w =>
    !w.match(/^\d{4}$/) && // year
    !w.match(/^(in|the|a|an|of|to|for|with|by|from|at|on)$/i) // connectors
  )

  if (substantiveWords.length <= 7) {
    return firstSentence.length > 60
      ? firstSentence.substring(0, 57) + "..."
      : firstSentence
  }

  // Take first 7 substantive words plus necessary connectors
  let wordCount = 0
  let title = ""
  for (const word of words) {
    if (!word.match(/^(in|the|a|an|of|to|for|with|by|from|at|on)$/i)) {
      wordCount++
    }
    title += (title ? " " : "") + word
    if (wordCount >= 7) break
  }

  return title.length > 60 ? title.substring(0, 57) + "..." : title
}
