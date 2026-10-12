export type Era = {
  id: string;
  name: string;
  range: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  image: string;
  atmosphere: string;
  symbol: string;
  scale: string;
  events: string[];
  threshold: string;
  fact: string;
  factLabel: string;
};
export const eras: Era[] = [
  {
    id: "digital",
    name: "The connected world",
    range: "2025 — 1989",
    year: "2025",
    title: "A world.\nRewritten.",
    subtitle: "THE DIGITAL AGE",
    description:
      "Ideas cross oceans in milliseconds. Machines begin to speak. The distance between us disappears—and new divides emerge.",
    accent: "#a4bed3",
    image: "city",
    atmosphere: "digital",
    symbol: "01",
    scale: "YEARS → DECADES",
    events: [
      "2025",
      "2024",
      "2023",
      "2022",
      "2021",
      "2020",
      "2019",
      "2007",
      "2001",
      "1989-web",
    ],
    threshold: "The signal begins to fade.",
    fact: "1989",
    factLabel: "A proposal that became the World Wide Web",
  },
  {
    id: "coldwar",
    name: "A divided planet",
    range: "1989 — 1947",
    year: "1969",
    title: "One small\nstep.",
    subtitle: "THE COLD WAR & SPACE AGE",
    description:
      "A planet divided by ideology looks toward the same sky. The race for space reveals something no border can contain: our shared home.",
    accent: "#d2d9de",
    image: "space",
    atmosphere: "orbit",
    symbol: "02",
    scale: "DECADES",
    events: ["berlin-wall", "1969", "cold-war"],
    threshold: "Beyond the atmosphere. Beneath the conflict.",
    fact: "384,400",
    factLabel: "Kilometres from Earth to the Moon, on average",
  },
  {
    id: "conflict",
    name: "The fractured century",
    range: "1945 — 1914",
    year: "1939",
    title: "The world\nbreaks.",
    subtitle: "THE AGE OF WORLD WARS",
    description:
      "Industrial power becomes industrial war. Lives, cities, and entire communities are destroyed. Remembering means looking beyond the maps.",
    accent: "#c2a48b",
    image: "mountains",
    atmosphere: "archive",
    symbol: "03",
    scale: "DECADES",
    events: ["world-war-ii", "world-war-i"],
    threshold: "The archive opens. The noise falls away.",
    fact: "1914–1945",
    factLabel: "Two world wars reshape a generation",
  },
  {
    id: "transformation",
    name: "Engines of change",
    range: "1913 — 1450",
    year: "1760",
    title: "Everything\nin motion.",
    subtitle: "INDUSTRY & THE RENAISSANCE",
    description:
      "Steam remakes work. Print carries ideas. Artists and thinkers question inherited truths. Progress transforms lives—and exacts a price.",
    accent: "#daa365",
    image: "city",
    atmosphere: "industrial",
    symbol: "04",
    scale: "CENTURIES",
    events: ["industrial-revolution", "renaissance"],
    threshold: "From electricity to steam. From screens to ink.",
    fact: "c. 1450",
    factLabel: "Movable-type printing expands in Europe",
  },
  {
    id: "civilizations",
    name: "Cities of memory",
    range: "1258 CE — 3000 BCE",
    year: "2500 BCE",
    title: "Built to\noutlast us.",
    subtitle: "THE FIRST CIVILIZATIONS",
    description:
      "Stone holds a ruler’s ambition. Ink carries knowledge across languages. Cities become laboratories for the ways we live together.",
    accent: "#d5ba82",
    image: "egypt",
    atmosphere: "sand",
    symbol: "05",
    scale: "CENTURIES → MILLENNIA",
    events: [
      "islamic-golden-age",
      "roman-empire",
      "ancient-egypt",
      "bronze-age",
    ],
    threshold: "The modern horizon dissolves into sand.",
    fact: "c. 2560 BCE",
    factLabel: "The Great Pyramid takes its place on the horizon",
  },
  {
    id: "origins",
    name: "Before written memory",
    range: "10,000 BCE — 300,000 YEARS AGO",
    year: "300,000",
    title: "A spark.\nA beginning.",
    subtitle: "HUMAN ORIGINS",
    description:
      "Before cities, before nations, before words were written, there was a hand, a tool, a story—and the extraordinary possibility of being human.",
    accent: "#df9468",
    image: "mountains",
    atmosphere: "ember",
    symbol: "06",
    scale: "MILLENNIA → AGES",
    events: ["agriculture", "human-origins", "early-hominins"],
    threshold: "The written record ends. The earth remembers.",
    fact: "~300,000",
    factLabel: "Years since the earliest known Homo sapiens",
  },
  {
    id: "prehistoric",
    name: "A world without us",
    range: "66 — 230 MILLION YEARS AGO",
    year: "66 million",
    title: "Their world.\nBefore ours.",
    subtitle: "THE AGE OF DINOSAURS",
    description:
      "Forests breathe under unfamiliar skies. Continents drift. For more than 160 million years, dinosaurs shape a world no human will ever see.",
    accent: "#a8b7a0",
    image: "forest",
    atmosphere: "forest",
    symbol: "07",
    scale: "GEOLOGICAL PERIODS",
    events: ["extinction", "dinosaurs"],
    threshold: "Human time disappears. Deep time begins.",
    fact: "66 million",
    factLabel: "Years since an impact changed the course of life",
  },
  {
    id: "earth",
    name: "The beginning of everything",
    range: "3.5 — 4.54 BILLION YEARS AGO",
    year: "4.54 billion",
    title: "No history.\nOnly possibility.",
    subtitle: "EARTH & THE FIRST LIFE",
    description:
      "A planet gathers from dust and rock. Its surface cools. Water finds a home. In a world without witnesses, life begins its longest story.",
    accent: "#e49973",
    image: "space",
    atmosphere: "molten",
    symbol: "08",
    scale: "BILLIONS OF YEARS",
    events: ["early-life", "earth-formation"],
    threshold: "Back to the fire from which it all began.",
    fact: "4.54 billion",
    factLabel: "Years of Earth. One fleeting moment of us.",
  },
];
export type EventRecord = {
  id: string;
  year: string;
  title: string;
  summary: string;
  why: string;
  people: string;
  source: string;
  sourceName?: string;
  details?: string;
};
export const supplemental: EventRecord[] = [
  {
    id: "cold-war",
    year: "1947–1991",
    title: "A world divided",
    summary:
      "The United States and Soviet Union lead rival political and military blocs. Nuclear deterrence, proxy wars, and competition in science shape international life.",
    why: "The rivalry leaves enduring alliances and conflicts. Many societies outside the two superpowers also pursue independent paths through decolonization and the Non-Aligned Movement.",
    people: "United States · Soviet Union · Non-Aligned Movement",
    source: "https://history.state.gov/milestones/1945-1952",
  },
  {
    id: "berlin-wall",
    year: "1989",
    title: "The wall opens",
    summary:
      "On 9 November, East German border crossings open after mounting protests and political changes. People cross a barrier that had divided Berlin since 1961.",
    why: "The opening becomes a powerful symbol of the end of Europe’s Cold War division, followed by German reunification in 1990.",
    people: "East German protesters · citizens of Berlin",
    source: "https://www.berlin.de/mauer/en/history/",
  },
  {
    id: "bronze-age",
    year: "c. 3300–1200 BCE",
    title: "Metal, trade, and the city",
    summary:
      "In parts of western Asia and the eastern Mediterranean, bronze technology accompanies expanding cities, writing, and long-distance exchange. These changes happen at different times in different regions.",
    why: "Copper and tin connect distant communities. New tools and weapons transform production and power, while written records offer a new kind of historical evidence.",
    people: "Sumerian city-states · craftspeople · merchants",
    source: "https://www.metmuseum.org/toah/hd/ubay/hd_ubay.htm",
  },
  {
    id: "early-hominins",
    year: "Millions of years ago",
    title: "The long road to humanity",
    summary:
      "Human evolution is a branching history. Several hominin species live at different times, and some overlap; walking upright evolves before the large brains of later humans.",
    why: "Fossils, archaeology, and genetics reveal relationships rather than a simple ladder of progress. Our species is one surviving branch of a much larger family.",
    people: "Australopithecus · Homo erectus · Neanderthals",
    source:
      "https://humanorigins.si.edu/education/introduction-human-evolution",
  },
];
