import { parseTimelineData, extractEntities } from "./data-parser"

const RAW_TIMELINE_DATA = `2008-2013
* October 2008: Seventeen years ago, Bitcoin was introduced via a white paper by Satoshi Nakamoto.
* January 2009: The Bitcoin network officially launched with the mining of the genesis block.
* In 2011, Wenceslao Casares lacked secure storage for Bitcoin, so he built a personal "vault" (cold storage solution). Friends and institutions soon requested access, laying the groundwork for Xapo.
* 2012: @sdlerner first proposed MavePay: a lightweight payment system designed for P2P digital currency networks running on similar hardware to Bitcoin's.
* April 2012: @santisiri co-founds Partido de la Red (Net Party), the first digital political party in the Americas. It aims to integrate internet-based decision-making into politics, inspired by local corruption issues.
* December 2012: The earliest open and registered meeting was held in Belgrano, Buenos Aires, led by early adopters like Wenceslao Casares after the first Bitcoin Halvening.
* May 2013: QixCoin: the first Turing-complete cryptocurrency was launched by @sdlerner. It had smart contracts similar to Ethereum, but was only used to implement Sergio's p2p card gaming platform.
* May 2013: Proof of Existence was one of the world's first non-financial blockchain applications, and it was created by @maraoz. It allowed anyone to verify that a document existed at a certain point in time. Demonstrating ownership, without revealing data.
* Mid 2013: @sdlerner and  @julianor co-founded the auditing company Coinspect. The firm audited the initial codebase for zCash and its forks, Ledger's wallet firmwares and Grin's cryptocurrency.
* 2013: Ripio (f.k.a BitPagos) was founded. The Exchange was first a payments processor for merchants, allowing Argentinians to sell pesos for bitcoin. It later launched one of the most known local Bitcoin wallets.
* Late 2013: Xapo was founded by Casares (CEO) and Murrone (COO/co-founder). It started as a Bitcoin wallet and vault service, headquartered initially in Palo Alto, CA. 
* 2013: First classes around crypto within ITBA and UTN. Classes covered how to create Bitcoin wallets with Rodolfo Andragnes (ITBA), and general crypto education with Pablo Iglesias (UTN).
* November 2013: Vitalik introduced Ethereum to the world. The whitepaper presented the world computer with flexibility to create new tokens, DAOs, and financial applications.
* December 2013: The first LaBitConf, which cemented Argentina as a Bitcoin leader in the region. The conference included speakers like @ErikVoorhees, Bitcoin Core dev @jgarzik, and members of the Bitcoin foundation, with sponsorships from BitPay, AstroPay and The Bitcoin Magazine. The conference became an annual traveling event, visiting Brazil, Mexico, Colombia and other countries, before returning to Buenos Aires in 2016.
2014
* March 2014: Bitex launches with a US$ 2 million investment from a UK-based firm. Initial target markets included Argentina (base in Buenos Aires), Colombia, Mexico, Spain, and the USA, aiming to provide a competitive Bitcoin trading platform amid regional economic volatility.
* April 2014: Appecoin was launched by @sdlerner, the first attempt to create an anonymous coin that was perfect binding, instead of perfect hiding.
* April 2014:  Xapo introduced a debit card backed by Bitcoin and linked to the user's Xapo Wallet.
* 2014: BTC meetups began in Mendoza.
* 2014: In 2014, a group of young Argentine programmers turned a rented house in Palermo, Buenos Aires into a crypto coworking commune known as Casa Voltaire. Founded by @maraoz with about 15 developers, many of them friends from ITBA. Their ethos was: transparency, decentralization, and using crypto to fix broken systems. Casa Voltaire became an incubator for several of Argentina's most successful crypto startups. Projects that were built include: Decentraland, the Ethereum-based virtual world, Muun, a user-friendly Bitcoin/Lightning wallet, and OpenZeppelin, a smart contract security platform.
* 2014: Coinfabrik was founded by @sdlerner,  Pablo Yabo and Sebastian Wain. CoinFabrik became one of the world's first specialized crypto R&D labs and software factories.
* 2014: SatoshiTango, one of Argentina's oldest crypto exchanges, was founded by @matiasbari, @NLoterspil, and Mariano Craiem.
* 2014: LambdaClass was founded. Lambda is a software factory. They are building Starknet and Ethereum clients, validator networks.
* 2014: @franamat and team began working on Bitcourt: an arbitration platform, so commercial disputes could be resolved quickly and professionally on Bitcoin.


2015


* January 2015: Streamium, a project to broadcast live video and get paid in real time through crypto, achieved the first successful stream with a functioning micropayments channel.
* July 2015: Ethereum's Frontier release went live, enabling developers to deploy smart contracts on-chain. This introduced decentralized applications.
* 2015: Co-founders @demibrener and @maraoz, began working on OpenZeppelin (Zeppelin Solutions). OpenZeppelin is one of the most known blockchain security company that created the most widely used smart contract framework. 
* 2015: Decentraland, the first blockchain virtual world project. @eordano and Ariel Meilich, envisioned a metaverse owned by its users: a limited 3D land space that users could purchase using a cryptocurrency, build content on, and even govern collectively through a DAO.
* November 2015: The original whitepaper for Rootstock (later RSK) was released. It outlined the platform's architecture, a smart contract platform that brought Ethereum-like functionality to Bitcoin.
* November 2015: Bitcourt, now Signatura, collaborates with CESYT college to notarize the first official career diplomas on Bitcoin. @franamati and @federicobond, founder of EspacioBitcoin, Bitcoin Argentina NGO, and founding member of labitconf were the core team behind Signatura.
2016
* 2016: Ripio introduced a P2P credit network and held an ICO selling RCN tokens, raising $37M to power crypto lending.
* July 2016: After The DAO hack, OpenZeppelin rose to prominence by offering audited, reusable contract libraries that developers could trust. OpenZeppelin Contracts library, a set of battle-tested Solidity code for ERC-20 tokens, ownership, crowdfunding contracts, and more, quickly became the industry standard.
* July 2016: Signatura released its private beta and signed its first document.
* August 2016: Bitex launched Remitex, a cross-border remittance service using Bitcoin as a settlement vehicle.
* October 2016: Signatura  launched public beta.
* 2016: Protofire is a dev firm originally spun out of Altoros. Protofire helped projects like Gnosis, Kyber, The Graph, and Maker with development and audits. They developed early dashboards for Maker and were early participants in The Graph network, writing subgraphs for protocols and even running Graph indexer nodes.
* Late 2016: Flixxo is an Ethereum-powered video sharing platform experiment, a decentralized alternative to YouTube. It was founded by a team including @adriangarelik, Federico Abad, and Pablo Carbajo. The platform combined BitTorrent file-sharing with a crypto token (FLIXX) to reward content creators and viewers.
2017
* 2017: Early Ethereum smart contracts needed reliable price feeds. Argentinian developers were at the forefront of oracle solutions. @nanexcool helping build the first decentralized price feeds that backed the DAI stablecoin
* 2017: Kleros was founded by @federicoast. Kleros pioneered "decentralized justice" using crowdsourced jurors and a native token (PNK) for arbitration.
* June, 2017: @santisiri publishes the Democracy Earth whitepaper on GitHub, outlining proof-of-identity (POI), attention mining, and UBI via vote tokens. Introduces concepts like singularity scores and quadratic voting.
* July 2017: OpenZeppelin was hired by Augur to audit the Serpent compiler. "Whether or not to migrate Augur's smart contracts to Solidity has been a topic of ongoing debate (...) our back-end team is now in unanimous agreement: we have to migrate to Solidity." This is one of many cases where Zeppelin grew the adoption of Solidity, best practices in writing code.
* August 2017: The Decentraland Foundation held the MANA ICO, raising about $26 million.
* Mid-late 2017: A core infrastructure that enabled ICOs, Coral, was developed by OpenZeppelin. The protocol was designed as a secure token sale framework: projects would submit their token to Coral for review, and once accepted, the public could buy the token through a compliant, user-friendly interface.
* November 2017: OpenZeppelin engineers launched Ethernaut, a Web3 capture-the-flag game for learning Solidity security. Debuting around Devcon 3, Ethernaut presented vulnerable smart contracts for players to hack. 
* December 2017: The canonical WETH9 contract, deployed on Ethereum mainnet. This was possible with core contributions by @nanexcool. WETH established a standardized, secure ERC-20-compliant version of ETH, allowing users to convert ETH to WETH without using a centralized party.
* December 2017: MakerDAO's DAI stablecoin was originally known as SAI (Single-Collateral Dai) when it launched from Buenos Aires. SAI was a decentralized USD-pegged stablecoin backed solely by ETH, and it quickly became a lifesaver for Argentines facing ~50% annual inflation and strict currency controls.


2018
* January 2018: Rootstock's mainnet went live.
* February 2018: EasyTrade, the first decentralized exchange, is launched by @dmf7z under the motto: "a decentralized Shapeshift".
* Early 2018: The NFT standard ERC-721 was formalized, and Argentine developers @smpalladino, tibi and @facuspagnuolo played a role in its implementation and popularization. OpenZeppelin provided open-source ERC-721 library code, guides and security audits, facilitating some of the first NFT projects. 
* May 2018: ETHBuenosAires was the very first community-organized ETHGlobal hackathon. The event was led by @0xtoucan and @ornellacordoba and brought builders from all over the world together for ETHGlobal's third hackathon ever, and the first one held in Latin America. ETHBuenosAires onboarded many of today's community members into crypto.
* May 2018: Mike Barrow (a U.S. expat winemaker in Mendoza) launched OpenVino, an Argentine initiative at the intersection of blockchain and wine. OpenVino tokenized wine through MTB18 (for the 2018 vintage of Costaflores Malbec) – each token represented one bottle of wine. In May 2018, the entire 2018 harvest (16,384 bottles) was tokenized and offered via a public token sale at cost price.  
* May 2018: Kleros has its first ICO, raising $2.6M
* May 2018: Argentina's Banco Masventas became the first bank in the country (and one of the first globally) to use cryptocurrency for cross-border money transfers. This was prompted by a collaboration with Bitex that allowed them to route international payments through Bitcoin instead of Swift.
* July 2018: EOAs can easily sign messages with private keys, but contracts had no private keys. ERC-1271 proposal coauthored by Zeppelin's Fran Giordano solved this by defining a common interface that contract wallets can implement to prove a signature's validity.
* Mid 2018: @fedeogue launched Buenbit (f.k.a Buendolar) as an Argentine crypto exchange focused on stablecoins. By actively marketing DAI savings during the 2020–21 inflation spike with support from the Maker Foundation's outreach, Buenbit attracted thousands of Argentines to crypto.
* Mid 2018: Students and professors at the National Technological University in La Plata (UTN-FRLP) created Argentina's first university-backed blockchain lab. By 2019 it had 19 members: 3 professors and 16 students.
* August 2018: CryptoMondays began: meetups held to share their views, networking, learning and having a blast.
* October 2018: Official launch of Muun, by @esneider and a team that had been long term participants in the Bitcoin ecosystem. Muun is a self-custodial, non-custodial mobile wallet designed for Bitcoin, and implemented a multi-signature and non custodial security model.
* 2018: Xivis was formed: a Buenos Aires-based software development agency began contributing and developing for other crypto companies. Xivis built a reputation for quickly delivering quality solutions for hackathons and community initiatives.
* 2018: @claberus began contributing to OpenEthereum, a now deprecated client for the Ethereum mainnet. Olano joined the project and contributed to the network resilience in collaboration with Gnosis and the Ethereum Foundation.
* Late 2018: Celo chose Argentina for its first field pilot. Celo's first Argentine contributor, Nicolás Michnowicz, led a 5-month test in Buenos Aires and Córdoba. Starting in late 2018, Celo deployed a test version of its wallet (what became Valora) to several low-income communities in the country. About 500 users were given a small amount of cUSD, which they could use for P2P payments and purchases at local merchants. The Argentina pilot informed Celo's mainnet launch in 2020 and demonstrated strong demand for stable currencies in emerging markets.
* November, 2018: Muun partnered with GiveCrypto to distribute Bitcoin and promote financial inclusion. Muun continued to drive initiatives focused on the unbanked population of Argentina.
2019
* February 2019: Moloch DAO was launched by @ameensol to fund Ethereum public goods. It popularized a simple framework where members contribute ETH to a common pool and vote on grant proposals. Several Argentines were among the early members and @nanexcool went on to create Sellout DAO in ETHBerlinZwei, an early experiment on vote buying way before Lobby.fi.
* February 2019: Bitex facilitated the first reported international export transaction settled with Bitcoin, between an Argentine seller and a Paraguayan buyer. The $7,100 deal used Bitcoin as an intermediary for currency conversion, with the seller receiving local fiat in under an hour at a 1% fee.
* February 2019: POAP was founded with the idea of minting digital badges for specific memories. POAP originates in ETH Denver 2019, where attendees received NFT "POAPs" as proof of participation through a locally-hosted website.
* 2019: Ripio hits over 300,000 users in Latin America, reaching 1 million in 2020.
* April 2019: POAP experiments with voting/polling systems gated by POAP ownership at EDCON Sydney. Here, POAP issues tokens manually for the first time.
* May 2019: POAP is appointed by ETHGlobal to issue POAPs to all 300+ hackers in ETH New York City via Kickback API. Here, POAP debuts POAP rosettes.
* 2019: EthereumBA began. The meetups were organized by members of Xivis, as well as @0xtoucan and @saldasoro. EthereumBA grew into monthly gatherings to share knowledge with collaboration Maker DAO, Zerion, Synthetix, among other projects.
* Mid-2019: Xivis assembled a dedicated team to develop the POAP claim system in time for DevCon 5, enabling attendees in Osaka to receive NFTs on-site. 
* 2019: Around 2019, Cartesi started reaching out to Argentina's developer community and their dev firms to introduce its tech. Cartesi was preparing for its CTSI token launch (which happened in 2020), building a developer base was crucial. Argentine devs showed interest in Cartesi's promise of coding smart contracts in familiar languages (like C++ or Python via Linux). Their software tooling resonated with local developers, and even collaborated to create demo apps with Think & Dev.
* 2019: Argentines like @facuspagnuolo began contributing to the dispute resolution of Aragon Court, development of Aragon One, among other Aragon projects.
* 2019: Lemon is a crypto fintech startup by @lemoncheli and @borjamartels. They launched a mobile wallet that lets users buy/sell crypto and earn rewards through their own exchange. It later issued a Visa card that gives Bitcoin cashback on everyday purchases. The company became known for bringing crypto into mainstream retail in Argentina.
* 2019: NGO Bitcoin Argentina, with IDB and IOV support, launched the DIDI Project to give people in Buenos Aires' underserved communities a way to build a verifiable reputation history. Underbanked individuals could record microfinance loan repayments and get digital credentials attesting to their creditworthiness.
* October 2019: Muun launches Muun iOS, a non-custodial wallet for Bitcoin and Lightning Network Lightning, becomes a top rated Bitcoin Wallet. 
* October 2019: Devconnect in Argentina has been a long time coming. In Osaka, all the Argentinians organized to push for DevconBA. Speakers had agreed to include one slide in their presentations to promote Buenos Aires as the next Devcon location as well as wearing DevconWine and DevconMate shirts around the venue. See nanexcool's talk "Living on Defi: How I Survive Argentina's 50% Inflation".
* October 2019: POAP issues POAPs to all 5,000+ attendees to Devcon V via Ethereum Foundation partnership.


2020


* January 2020: Lauch of BeloApp, a seamless crypto-fiat wallet for freelancers and remote workers in Latin America.
* January 2020: DIDI project launches the ai didi app, allowing users to store and manage SSI credentials on mobile devices.
* Early 2020: DeFi LATAM was part of this movement. A collective, organizing meetups, sustaining the Mateando con DeFi newsletter to spread DeFi education and producing Spanish guides on using MakerDAO, Uniswap, etc. By teaching hundreds of newcomers the DeFi basics, it significantly lowered the entry barriers to DeFi for Argentinians.
* Early 2020: Kleros has its second ICO, raising $2.5M
* Early 2020: DAI volume on local exchanges had grown six-fold, and stablecoin trading overall grew 20× year-on-year. Maker noted Argentina and Brazil as its fastest-growing markets for Dai.
* February 2020: Argentines began contributing to Yearn (@SaltyFacu, among them), who pioneered yield aggregation in DeFi, automating farming across protocols like Compound to lower costs and compound rewards. By simplifying complex strategies into easy deposits, Yearn lets users grow their holdings without active management. 
* March 2020: Balancer V1 was launched, with active contributions to its smart contract development and protocol design features by @facuspagnuolo.
* 2020: After 2 years of development, the Decentraland platform officially launched, allowing users worldwide to explore and create within its VR world. Users can create avatars, buy NFT wearables, build scenes, and trade land on the marketplace.
* May 2020: The official release of Hardhat v2.0.0 was published. Hardhat (f.k.a Buidler) is one of the most widely used Ethereum development environments co-founded by @zfran and @alcuadrado. The team developed hardhat's console (REPL) and Javascript tasks, its built-in network for debugging, and the ability to write tests in a familiar Mocha/Chai setup. Both team members continue to lead Hardhat development today.
* June 2020: Kleros collaborates with the European Union.
* Summer 2020: DeFi summer was an explosive phase of growth, the TVL in lending platforms, decentralized exchanges, and yield-generating protocols expanded at an unprecedented rate. This period saw a surge of activity across Ethereum and represented the rapid adoption of financial services in Argentina.
* July 2020: Rather Labs, an engineering studio, was founded. Later on, Argentinian members began collaborating with startups and organizations looking to launch Web3 products.
* 2020: The Banco de Alimentos with Ripio's #DonáConBitcoin campaign, and Pulenta with Xcapit enabling traceable blockchain giving.
* 2020: Red Cross Argentina accepts crypto donations via Satoshi Tango.
* 2020: Karpatkey is founded to manage Gnosis DAO's treasury, introducing non-custodial DeFi solutions for underutilized DAO assets amid DeFi Summer risks. Assets under management grew from $300 million to $1.8 billion in under three years.
* 2020: Mountain Protocol was founded, a fully collateralized, yield-bearing stablecoin backed by short-term U.S. Treasury bonds created in Argentina by @mcarrica & @mattiascaricato.


2021
* February, 2021: Muun fully open-sourced the wallet codebase, enabling audits, forks, and community contributions to Bitcoin wallet security and UX.  
* March 2021: Proof of Humanity was launched by the Kleros Team and @santisiri is a sybil-resistant identity verification protocol on Ethereum, to offer decentralized human validation. In the same month UBI was launched to stream income to verified humans. Raises $1.2M in regulated sales but faced immediate volatility.
* May 2021: @mrnventuro, @dmf7z and @facuspagnuolo played a key role in Balancer V2, delivering modular pools, stronger security, and L2 readiness.
* June 2021: A team of OG contributors in the Argentina ecosystem, including@facuspagnuolo, brunob @dmf7z gather and found Mimic Protocol:  a DeFi protocol that aims to automate onchain operations. 
* July 2021: Exactly Protocol was founded by Gabriel Gruber in Argentina.
* September 2021: @mrnventuro designed a global role governance system for Balancer with action IDs and disambiguators to prevent clashes.  
* 2021-2022: KPK Built non-custodial asset management infrastructure using on-chain permissions policies, Safe Smart Accounts, and automated Guardians for transparent, risk-minimized DeFi strategies.
* 2021: KPK began contributing to DAO treasury management for protocols like Balancer, focusing on capital efficiency and risk reduction.
* 2021: Xeibo, an Argentine crypto venture firm and incubator was founded to support Web3 startups. Its portfolio includes leading local projects like SenseiNode, WakeUp Labs, Welook, Defiant, and Pinta. 
* 2021: Coinfabrik audits 1Inch Money Market. It would later audit Money Market 2.


2022
* March 2022: The Buenos Aires city government announced and released the whitepaper for TangoID, as a SSI platform for citizens to store official documents in wallets and present them selectively via blockchain.
* April 2022: The NFT boom would attract the attention of established companies outside of crypto to the Metaverse. At Coachella 2022, Absolut.Land in Decentraland attracted 21,000+ visitors from 100 countries.
* April 2022: Community led meetup to educate and discuss Cairo and a Circom Exporter. In August, Starkware organizes a side event around Ethlatam.
* May 2022: LambdaClass begins work on CairoVM, a Rust implementation of the Cairo Virtual Machine.
* 2022: WakeUp Labs collaborated with Kilimo, developing non-fungible water tokens (NFTs) to represent farmers' water savings. Kilimo secured a funding round after demonstrating its ability to build on-chain.
* 2022: Pulenta project facilitated donations to vulnerable sectors via crypto.
* 2022: Satoshi Tango grew to about a million users and launched a Visa Card in 2022.
* 2022: Lemon hits over 1.6 million users in Argentina and Brazil.
* 2022: Wonderland launches of Keep3r Network, one of its core projects. A decentralized network for projects that need external DevOps, and for external teams to find keeper jobs.
* 2022: SenseiNode began hosting over 50 validator nodes on leading protocols, including Ethereum, Polygon, etc. The same year Launched SenseiStake, a non-custodial ETH2 staking platform using NFTs for tokenized validators on Latin American infrastructure.
* July 2022: During the NFT boom, Lemon launched Lemon Nation as a community engagement program built around profile-picture NFTs called Lemmys. By mid-2022, Lemon had minted over 400,000 Lemmy NFTs on Ethereum and distributed them to its users.  
* Mid 2022: NFC enables physical taps for POAP claims via chips in cards, stickers, or merch.
* August 2022: ETH Latam was a three-day event that brought the global community of builders and educators to Argentina. While ETHBuenosAires marked the first large-scale Ethereum event in the country, connecting Argentina to the broader ETHGlobal community, and EthereumBA focused on gathering the local ecosystem, ETH Latam combined both worlds: it united communities, highlighted local protocols, and introduced international projects to Argentina.
* September 2022: Ethereum transitioned from Proof-of-Work to Proof-of-Stake. It reduced Ethereum's energy usage by over 99% and set the stage for scaling upgrades like sharding. This was the most significant technical change in Ethereum's history –so far.
* November 2022: Exactly launched on the Ethereum Mainnet, enabling fixed and variable interest rate markets for DeFi credit.
2023
* 2023: Coinfabrik audits Fireblocks API and SDK.
* Early 2023 Initial Adoption, Mimic began automating tasks for ParaSwap, the DeFi aggregator.
* 2023: KPK Assisted the Ethereum Foundation in developing a values-aligned Treasury Policy
* February 2023: Invest in Music was an onchain media organization focused on music NFTs, turning fans into investors via platforms like Zora and Optimism. It was cofounded by @saldasoro and Cooper Turley.
* March 2023: Exactly expanded to the Optimism network.
* March 2023 Founding: The Red Guild was publicly announced by co-founders @mattaereal@tinchoabbate as a group dedicated to safeguarding Ethereum applications through research, education, and advocacy.
* April 2023: LambdaClass begins work on Lambdaworks, implementations for both SNARKs and STARKs provers; they enable building customized SNARKs.
* May 2023: Launch of Bombo: a platform providing NFT ticketing solutions, using blockchain under the hood, fully integrated into their entertainment services.
* June 2023: As early DVT adopters (global rank #12), SenseiNode deployed the first Distributed Validator Solo Cluster on Obol's Alpha Release for Ethereum mainnet.
* July 2023: Mimic v3 introduced a modular framework for DeFi automation with customizable workflows, triggers, cross-chain compatibility, and connectors for seamless integration with protocols like swaps and bridging. By this point, Mimic was running over 200,000 tasks monthly.
* August 2023 First IRL campaign at Ethereum Argentina: The security campaign simulated threats like USB drops, QR code phishing, fake flyers, a mirrored conference website, and unattended laptop flagging.
* August 2023: Damm launches the custodial private DAMMstable fund on Arbitrum in stealth mode for friends and family. Operated through USDT, USDC, and DAI liquidity provision on Uniswap LPs, marking the beginning of DAMM's market-neutral stablecoin strategies.
* September 2023: First major Bombo implementation in Mar del Plata, Argentina, for the Mariano Mellino show at a nightclub.
*  September 2023: Fernet protocol, a fully permissionless random leader election protocol, proposed by @smpalladino was chosen as the final design for Aztec's Sequencer Selection.
* 2023: Ongoing contributions by Argentines to smart account abstraction in Aztec (@mrnventuro).
* October, 2023: Integration of Bombo with Binance Pay as part of its expansion in Argentina and the region.
* 2023: WakeUp Labs began contributing open-source code to some of the largest DAOs in the crypto ecosystem, such as the "Built Status History Search" on the OP Blockchain. They also partnered with WIN Investments to promote the democratization of the football industry and worked with Num Finance (acquired), a company from the Argentine crypto ecosystem.
* Kleros even began collaborating with the Mendoza provincial court (a first-of-its-kind pilot using Kleros juries for small cases) https://thedefiant.io/news/regulation/kleros-to-collaborate-with-supreme-court-of-mendoza
2024
* January 2024: Argentines become part of the first set of Optimism's Security Council.
* January 2024: @gonnaeth becomes Grants Council Lead at the Optimism Collective, where he continues to lead funding in the Superchain today.
* 2024: QuarkID went live city-wide in Buenos Aires, using zero-knowledge proofs for secure, self-sovereign IDs. It expanded to include health data and payments, becoming the world's first zk-backed municipal ID system.
* 2024: BootNode, Web3 venture builder and dev agency, built the zkSync Azure Smart Contract Wallet dApp, integrating zkSync Era's native Account Abstraction with Azure SSO to enable seamless, seed-less Web3 onboarding.
* 2024: Wonderland collaborated with Optimism to co-develop the Superchain ERC-20 standard and the opUSDC architecture for Optimism. These contributions aim to standardize tokens across Optimism's Superchain and enable a native stablecoins on Optimism.
* 2024: Wonderland delivered a private oracle solution for Aztec, encrypting the request and the answer, ensuring no other party than the requester has access to itt.
* 2024: WakeUp Labs developed Arbitrum Connect, later expanded to Orbit Chains.
* 2024: Argentinians @mattaereal (June) and @pablosabatella (February) joined SEAL, where both became active contributors. 
* June 2024: Belo expands in Latin America, to Mexico and Brazil, enabling users to receive payments across borders.
* June 2024: @mattaereal led the security initiatives of SEAL Frameworks.
* March 2024: Exchange law formally defined virtual assets as digital representations of value used for payments or investments and virtual asset providers, who must register with the National Securities Commission. Crypto platforms and custodians are now understood as "obliged subjects," meaning they must identify customers, verify beneficial owners, monitor risks, report suspicious transactions, and keep records for 10 years. Also creates a centralized and public registry of crypto service providers.
* April 2024: Sonata, a music client on Farcaster (built on Base, an Optimism L2), launched as the first dedicated music app there. It was cofounded by @saldasoro and sweetman.eth.
* June 2024: Eryx, in collaboration with Manas.Tech, received a Ethereum Foundation ZK Grant for Noirky2: A Plonky2 Backend for Noir. The project focuses on building an open-source Arithmetic Circuit Virtual Machine (ACVM) backend for the Plonky2 prover.
* July 2024: Red Guild oft-released the Phishing Dojo (https://www.phishingdojo.com/), a threat simulation platform for training users on social engineering, phishing, and scams in Web3.
* July 2024: A tax law was the first formal inclusion of crypto in Argentina. The informally known as "blanqueo" tax law encouraged bringing in undeclared assets back into the system, paying a special tax. Undeclared crypto assets were included within the scope  https://www.boletinoficial.gob.ar/detalleAviso/primera/310191/20240708 
* August 2024: Migration to the 100% algorithmic version of DAMMstable, enabling full on-chain strategy automation.
* August 2024: Aleph was a transformative pop-up city launched by Crecimiento, that led to positioning Argentina as the "Crypto Capital of the World." The movement emerged from contributors at The Mu, Solow, POAP, Beefy, The Graph and ETHLatam 2022. With 3000 attendees in its first iteration, Aleph served as a vibrant hub for crypto innovation. Subsequent editions, like Aleph de Verano and Aleph March 2025, continued to emphasize growing startups in Argentina.
* August 2024: Argentina hosted the first edition of the Privacy Scaling Core Program, designed for university students with programming experience who want to deepen their knowledge of privacy solutions on Ethereum.
* November 2024: Red Guild hosted "The REKT Games" CTF at Devcon SEA, focusing on crypto and Web3 security challenges, 
* November 2024: Eryx announced the release of STWO-GPU, a set of open-source prototypes designed to accelerate the execution times of Starkware's STWO prover. Their implementation leverages NVIDIA GPU parallelization via CUDA.  
* November 2024 Founding Opsek by @theSouilos and @PabloSabatella a Web3 Operational Security Services offering security audits, threat modeling and more.
* November 2024: POAP pilots location-based drops via GPS on Devcon SEA.
* December 2024 Opsek conducts a security audit for Contango: Conducted operational security audit for Contango, focusing on team hardening and risk mitigation.
* December 2024: CoBuilders is founded, a software firm providing software design and development services.
2025
* January 2025: Lambda begins collaborating with Commit-Boost, a new Ethereum validator sidecar focused on standardizing the communication between validators and third-party protocols.
* January 2025: World funds CoBuilders to develop AskHumans, a voting system we created for the World App.
* Feb 2025: Fat solutions releases Sumo, a zk-powered social login system using JWT proofs and account abstraction, built for seamless user onboarding.
* Feb 2025: Fat Solutions releases Terry Escape, a multiplayer private shared-state game using oblivious transfers, homomorphic encryption and zk proofs, built with Noir.
* Early 2025: Mimic reaches 18M automated transactions and managing 4 billion dollars in total automated value.
* February 2025: Exactly approved a proposal to integrate a crypto-backed credit card through a partnership with Uphold, aiming to increase liquidity and expand user access.
* 2025: Wonderland contributed to the 0xbow to ensure privacy pool integrity.
* 2025: Co-founded by Diego Fernández (QuarkID), Sovra is a zk-validium L2 on Ethereum focused on decentralized identity (DID) and real-world assets (RWAs). It provides infrastructure for governments and citizens to issue/verify credentials privately, already serving over 8 million users across Argentina, Mexico, and Colombia.
* March, 2025: Announced as a platform powered by ZKsync, with features like socialFi, NFT ticketing, and Bombo Swap (secure NFTicket resales).
* April 2025: Bootnode co-develops the Open Intents Framework (OIF) in partnership with Hyperlane and the Ethereum Foundation.  Also built an Integration with EigenLayer's Slashing Upgrade, assisting YieldNest in adapting to EigenLayer's slashing mechanism by implementing dynamic withdrawal synchronization and balance tracking. 
* May 2025 - Integration of DAMMstable with RWA tokenizers such as Bondi Finance (Base) and Agni DEX (Mantle), providing access to secondary market liquidity for tokenized emerging-market bonds and connecting on-chain fixed-income products.
* May 2025: Ripio launches LaChain, an L2 with ZKSync.
* May 2025: Launch of the KPK Token for DAO governance, community involvement, and alignment; distributed via vesting, swaps, and airdrops.
* June 2025: Exactly released the Exa App, featuring the Exa Card, a crypto-backed credit card available in over 160 countries, offering users access without requiring a bank account or credit score.
* June 2025: Fat Solutions contributes to Privacy Pools, and built a compliant non KYC mixer. 
* June 2025: Argentina launches its first regulated tokenization regime, allowing real-world assets to be issued and traded under CNV oversight — a key step toward modernizing its capital markets. Launches a one-year regulatory sandbox to test and supervise tokenized asset operations and enables trading through Virtual Asset Service Providers (VASPs).
* June 2025: POAP becomes more social, allowing users to create profiles, link social accounts, follow friends, and tag each other in shared moments.  
* July 2025: Fat Solutions built @tongoxyz within the Starknet ecosystem, a real confidential token wrapper aimed for payments 
* 2025: Wonderland began working on Interoperable Addresses for Ethereum, authoring ERC-7930 and CAIP-350 and contributing to ERC-7828, ERC-7683.
* August 2025: Completion of the audit for Permission Helpers on Uniswap v4, a smart-contract framework that enables asset managers to operate under Zodiac Roles for non-custodial asset management. This milestone made it possible to deploy DAMM as DeFi-as-a-Service (DaaS), offering permissionless and self-custodial active market making on Uniswap v4 for clients.
* 2025: WakeUp Labs delivered Velora's Trustless Rewards Distribution.
* 2025: WakeUp Labs Developed the UltraHonk Verifier and Noir zk-proofs integration, enabling native ZK execution in Arbitrum Stylus
* September 2025: Major Protocol Updates and Integrations to Mimic including validators for improved verification, support for event triggered tasks. Additionally, expanded Solana and broadened the scope for non-EVM integration.  
* September 2025: A second iteration followed in September 2025 under the name ZKET Core Program, this time focusing on advanced cryptography topics such as zero-knowledge proofs (ZKPs), multi-party computation (MPC), and fully homomorphic encryption (FHE).
* September 2025: Launch of the DAMMstable fund on Lagoon Finance, opening deposits in a non-custodial format for whitelisted investors. This integration connected DAMM's strategies to a broader DeFi vault ecosystem. DAMM became the only manager achieving real yield without token incentives.
* October 2025: Launch of DAMMeth in stealth mode for private investors, expanding to ETH-denominated strategies.
* 2025: Kleros builds an agreement with Oxford (find link) and partners with Stanford Journal of Blockchain.
* November 2025: Ethrex, an L1 and L2 execution client coded in Rust, is launched by LambdaClass.`

export const timelineData = parseTimelineData(RAW_TIMELINE_DATA)
export const entities = extractEntities(timelineData)

export function getTimelineData() {
  return timelineData
}
