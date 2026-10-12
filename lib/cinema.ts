import type { EventRecord } from "./eras";
import history from "./history.json";
import annual from "./annual.json";
import additional from "./additional.json";
export type WorldKind =
  | "city"
  | "hospital"
  | "office"
  | "war"
  | "factory"
  | "medieval"
  | "egypt"
  | "origins"
  | "dinosaurs"
  | "ocean"
  | "earth";
export type Shot = {
  id: string;
  label: string;
  year: string;
  world: WorldKind;
  title: string;
  caption: string;
  color: string;
  sourceId: string;
  filmStatus: "engine-preview" | "realized";
};
export type FilmState = {
  progress: number;
  shot: number;
  local: number;
  direction: number;
  paused: boolean;
  quality: "mobile" | "desktop";
  invalidate?: () => void;
};
export const filmState: FilmState = {
  progress: 0,
  shot: 0,
  local: 0,
  direction: 1,
  paused: false,
  quality: "desktop",
};
const byYear = new Map(
  [...(history as EventRecord[]), ...(annual as EventRecord[])]
    .filter((e) => /^20\d\d$/.test(e.year))
    .map((e) => [e.year, e]),
);
export const shots: Shot[] = [
  ...Array.from({ length: 27 }, (_, i) => {
    const year = String(2026 - i);
    const entry = byYear.get(year);
    return {
      id: `year-${year}`,
      label: year,
      year,
      world: (year === "2020" ? "hospital" : "city") as WorldKind,
      title:
        year === "2026"
          ? "Every second has a history."
          : entry?.title || "A changing world",
      caption:
        year === "2026"
          ? "The present is our point of departure. Move the scroll wheel to direct time."
          : entry?.summary ||
            "Explore the historical archive for the wider context of this year.",
      color: year === "2020" ? "#93afbd" : +year < 2010 ? "#c7af90" : "#adc5d6",
      sourceId: entry?.id || `annual-${year}`,
      filmStatus: "engine-preview" as const,
    };
  }),
  {
    id: "computing",
    label: "1981",
    year: "1981",
    world: "office",
    title: "The machine on the desk.",
    caption:
      "Enter the personal computing revolution. Follow the screen backward through generations of technology.",
    color: "#c3b497",
    sourceId: "ibmpc",
    filmStatus: "engine-preview",
  },
  {
    id: "moon",
    label: "1969",
    year: "1969",
    world: "earth",
    title: "A view beyond borders.",
    caption:
      "Apollo 11 reaches the Moon. Seen from space, Earth becomes one shared home.",
    color: "#c6d6df",
    sourceId: "1969",
    filmStatus: "engine-preview",
  },
  {
    id: "wwii",
    label: "1945",
    year: "1939–1945",
    world: "war",
    title: "A world at war.",
    caption:
      "Industry, occupation, resistance, and civilian lives. The human consequences remain at the center of this chapter.",
    color: "#b0a18a",
    sourceId: "world-war-ii",
    filmStatus: "engine-preview",
  },
  {
    id: "wwi",
    label: "1914",
    year: "1914–1918",
    world: "war",
    title: "The fracture of an old world.",
    caption:
      "A political crisis becomes a global war. Industrial power magnifies its terrible human cost.",
    color: "#a5a495",
    sourceId: "world-war-i",
    filmStatus: "engine-preview",
  },
  {
    id: "industry",
    label: "1760",
    year: "c. 1760–1840",
    world: "factory",
    title: "A new rhythm of life.",
    caption:
      "Steam, coal, factories, and changing work. Progress carries profound costs as well as possibilities.",
    color: "#d59960",
    sourceId: "industrial-revolution",
    filmStatus: "engine-preview",
  },
  {
    id: "renaissance",
    label: "1450",
    year: "c. 1400–1600",
    world: "medieval",
    title: "A new way of seeing.",
    caption:
      "Knowledge and art emerge through patronage, exchange, and renewed attention to the classical world.",
    color: "#bca784",
    sourceId: "renaissance",
    filmStatus: "engine-preview",
  },
  {
    id: "knowledge",
    label: "750 CE",
    year: "c. 750–1258 CE",
    world: "medieval",
    title: "Knowledge across worlds.",
    caption:
      "Scholars translate, test, and develop ideas across languages and cultures.",
    color: "#b0ac91",
    sourceId: "islamic-golden-age",
    filmStatus: "engine-preview",
  },
  {
    id: "rome",
    label: "27 BCE",
    year: "27 BCE onward",
    world: "egypt",
    title: "Power carved into stone.",
    caption:
      "Connected cities, roads, laws, and monumental ambition. Empire also means coercion and conquest.",
    color: "#c9ad89",
    sourceId: "roman-empire",
    filmStatus: "engine-preview",
  },
  {
    id: "egypt",
    label: "2500 BCE",
    year: "c. 2500 BCE",
    world: "egypt",
    title: "Life beside the Nile.",
    caption:
      "Trade, labor, belief, and a river shape an ancient society. A monument is only one part of its story.",
    color: "#d8b979",
    sourceId: "ancient-egypt",
    filmStatus: "engine-preview",
  },
  {
    id: "agriculture",
    label: "10K BCE",
    year: "from c. 10,000 BCE",
    world: "origins",
    title: "Learning to shape the land.",
    caption:
      "Food production develops in several regions, on different timelines. Human relationships with the land change.",
    color: "#b4a482",
    sourceId: "agriculture",
    filmStatus: "engine-preview",
  },
  {
    id: "humans",
    label: "300K",
    year: "c. 300,000 years ago",
    world: "origins",
    title: "Before written memory.",
    caption:
      "Homo sapiens evolves in Africa. Human evolution branches; it does not follow a simple ladder.",
    color: "#cf9167",
    sourceId: "human-origins",
    filmStatus: "engine-preview",
  },
  {
    id: "extinction",
    label: "66M",
    year: "66 million years ago",
    world: "dinosaurs",
    title: "An impact changes everything.",
    caption:
      "The end-Cretaceous extinction reshapes life. Non-avian dinosaurs disappear; birds survive.",
    color: "#9eac95",
    sourceId: "extinction",
    filmStatus: "engine-preview",
  },
  {
    id: "cretaceous",
    label: "145M",
    year: "145–66 million years ago",
    world: "dinosaurs",
    title: "The Cretaceous world.",
    caption:
      "Flowering plants spread through changing ecosystems. This chapter is distinct from the Jurassic.",
    color: "#9eae88",
    sourceId: "dinosaurs",
    filmStatus: "engine-preview",
  },
  {
    id: "jurassic",
    label: "201M",
    year: "201–145 million years ago",
    world: "dinosaurs",
    title: "The Jurassic world.",
    caption:
      "A changing planet supports diverse dinosaur lineages. The animals of another period are not mixed into this one.",
    color: "#8da69e",
    sourceId: "dinosaurs",
    filmStatus: "engine-preview",
  },
  {
    id: "triassic",
    label: "252M",
    year: "252–201 million years ago",
    world: "dinosaurs",
    title: "The Triassic world.",
    caption:
      "After the end-Permian crisis, life diversifies. Dinosaurs emerge late in the Triassic.",
    color: "#bbad89",
    sourceId: "dinosaurs",
    filmStatus: "engine-preview",
  },
  ...[
    "permian",
    "carboniferous",
    "devonian",
    "silurian",
    "ordovician",
    "cambrian",
    "ediacaran",
  ].map((id): Shot => {
    const entry = (additional as EventRecord[]).find((e) => e.id === id)!;
    return {
      id,
      label: (entry.year.match(/\d+(?:\.\d+)?/)?.[0] || "635") + "M",
      year: entry.year,
      world: "ocean",
      title: entry.title,
      caption: entry.summary,
      color: "#8da9ad",
      sourceId: id,
      filmStatus: "engine-preview",
    };
  }),
  {
    id: "early-life",
    label: "3.5B",
    year: "at least 3.5 billion years ago",
    world: "ocean",
    title: "A planet begins to live.",
    caption:
      "Preserved microbial traces reveal life long before animals. The exact origin remains uncertain.",
    color: "#809eac",
    sourceId: "early-life",
    filmStatus: "engine-preview",
  },
  {
    id: "formation",
    label: "4.54B",
    year: "c. 4.54 billion years ago",
    world: "earth",
    title: "A changing world.",
    caption:
      "Everything you have seen began with a changing world. Planetary formation was a process, not a single instant.",
    color: "#df8e61",
    sourceId: "earth-formation",
    filmStatus: "engine-preview",
  },
];
export const shotRails: Record<
  WorldKind,
  {
    from: [number, number, number];
    to: [number, number, number];
    look: [number, number, number];
  }
> = {
  city: { from: [0, 2, 18], to: [2.5, 2, -22], look: [0, 3, -30] },
  hospital: { from: [0, 1.7, 14], to: [0, 1.7, -17], look: [0, 1.7, -25] },
  office: { from: [5, 2, 12], to: [-2, 2, 0], look: [0, 1.6, -7] },
  war: { from: [-2, 2, 17], to: [2, 2, -13], look: [0, 2, -24] },
  factory: { from: [5, 3, 16], to: [-3, 4, -12], look: [0, 5, -22] },
  medieval: { from: [-4, 2, 18], to: [4, 4, -12], look: [0, 4, -23] },
  egypt: { from: [-10, 10, 22], to: [8, 3, -18], look: [0, 4, -30] },
  origins: { from: [-4, 1.4, 12], to: [4, 2, -12], look: [0, 1, -20] },
  dinosaurs: { from: [-8, 3, 20], to: [12, 12, -16], look: [0, 3, -26] },
  ocean: { from: [0, 2, 12], to: [7, 6, -14], look: [0, 0, -20] },
  earth: { from: [0, 2, 16], to: [7, 6, 12], look: [0, 0, 0] },
};
