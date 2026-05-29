/**
 * Deterministic SEED dataset for the travel-data contracts.
 *
 * This is clearly-labeled sample data for local development and contract
 * testing — NOT live observations and never to be presented as such. It exists
 * so the travel-data pipeline (provider → response → freshness/quality) is
 * exercisable end-to-end before any live vendor is wired. No network, fully
 * deterministic. Keyed to the seed destinations in `src/content/destinations`.
 */
import type {
  LocalEvent,
  OpeningHours,
  Place,
  ReviewSummary,
  SafetyAdvisory,
  TicketLink,
  TicketPrice,
} from "../contracts";

/** Standard weekly hours: open daily 09:00–17:00 (overridable per place). */
function dailyHours(open = "09:00", close = "17:00"): OpeningHours["weekly"] {
  return Array.from({ length: 7 }, (_, day) => ({ day, closed: false, open, close }));
}

export const SEED_PLACES: Readonly<Record<string, readonly Place[]>> = {
  kyoto: [
    { id: "kyoto-fushimi-inari", destinationId: "kyoto", name: "Fushimi Inari Taisha", category: "landmark", coordinates: { lat: 34.9671, lon: 135.7727 }, summary: "Thousands of vermilion torii winding up the mountain." },
    { id: "kyoto-kinkakuji", destinationId: "kyoto", name: "Kinkaku-ji", category: "landmark", coordinates: { lat: 35.0394, lon: 135.7292 }, summary: "The Golden Pavilion mirrored in its pond." },
    { id: "kyoto-arashiyama", destinationId: "kyoto", name: "Arashiyama Bamboo Grove", category: "park", coordinates: { lat: 35.0170, lon: 135.6716 }, summary: "Light filtered through towering bamboo." },
  ],
  santorini: [
    { id: "santorini-oia", destinationId: "santorini", name: "Oia Village", category: "viewpoint", coordinates: { lat: 36.4618, lon: 25.3753 }, summary: "Whitewashed cliffs above the caldera at sunset." },
    { id: "santorini-akrotiri", destinationId: "santorini", name: "Akrotiri Archaeological Site", category: "museum", coordinates: { lat: 36.3514, lon: 25.4036 }, summary: "A Bronze Age town preserved under ash." },
  ],
  marrakech: [
    { id: "marrakech-jemaa", destinationId: "marrakech", name: "Jemaa el-Fnaa", category: "landmark", coordinates: { lat: 31.6258, lon: -7.9891 }, summary: "The medina's pulsing night market square." },
    { id: "marrakech-majorelle", destinationId: "marrakech", name: "Jardin Majorelle", category: "park", coordinates: { lat: 31.6417, lon: -8.0033 }, summary: "Cobalt-blue garden of cacti and calm." },
  ],
  patagonia: [
    { id: "patagonia-torres", destinationId: "patagonia", name: "Torres del Paine Base", category: "viewpoint", coordinates: { lat: -50.9423, lon: -73.4068 }, summary: "Granite towers above a glacial lake." },
  ],
};

export const SEED_OPENING_HOURS: Readonly<Record<string, OpeningHours>> = {
  "kyoto-fushimi-inari": { placeId: "kyoto-fushimi-inari", timezone: "Asia/Tokyo", weekly: Array.from({ length: 7 }, (_, day) => ({ day, closed: false, open: "00:00", close: "23:59" })) },
  "kyoto-kinkakuji": { placeId: "kyoto-kinkakuji", timezone: "Asia/Tokyo", weekly: dailyHours("09:00", "17:00") },
  "kyoto-arashiyama": { placeId: "kyoto-arashiyama", timezone: "Asia/Tokyo", weekly: Array.from({ length: 7 }, (_, day) => ({ day, closed: false, open: "00:00", close: "23:59" })) },
  "santorini-oia": { placeId: "santorini-oia", timezone: "Europe/Athens", weekly: Array.from({ length: 7 }, (_, day) => ({ day, closed: false, open: "00:00", close: "23:59" })) },
  "santorini-akrotiri": { placeId: "santorini-akrotiri", timezone: "Europe/Athens", weekly: Array.from({ length: 7 }, (_, day) => ({ day, closed: day === 1, open: day === 1 ? undefined : "08:00", close: day === 1 ? undefined : "20:00" })) },
  "marrakech-jemaa": { placeId: "marrakech-jemaa", timezone: "Africa/Casablanca", weekly: Array.from({ length: 7 }, (_, day) => ({ day, closed: false, open: "00:00", close: "23:59" })) },
  "marrakech-majorelle": { placeId: "marrakech-majorelle", timezone: "Africa/Casablanca", weekly: dailyHours("08:00", "18:00") },
  "patagonia-torres": { placeId: "patagonia-torres", timezone: "America/Punta_Arenas", weekly: Array.from({ length: 7 }, (_, day) => ({ day, closed: false, open: "00:00", close: "23:59" })) },
};

export const SEED_TICKET_PRICES: Readonly<Record<string, TicketPrice>> = {
  "kyoto-fushimi-inari": { placeId: "kyoto-fushimi-inari", currency: "JPY", free: true, adult: 0 },
  "kyoto-kinkakuji": { placeId: "kyoto-kinkakuji", currency: "JPY", free: false, adult: 500, child: 300 },
  "kyoto-arashiyama": { placeId: "kyoto-arashiyama", currency: "JPY", free: true, adult: 0 },
  "santorini-oia": { placeId: "santorini-oia", currency: "EUR", free: true, adult: 0 },
  "santorini-akrotiri": { placeId: "santorini-akrotiri", currency: "EUR", free: false, adult: 12, child: 6 },
  "marrakech-jemaa": { placeId: "marrakech-jemaa", currency: "MAD", free: true, adult: 0 },
  "marrakech-majorelle": { placeId: "marrakech-majorelle", currency: "MAD", free: false, adult: 150, child: 0 },
  "patagonia-torres": { placeId: "patagonia-torres", currency: "CLP", free: false, adult: 35000, child: 18000 },
};

/**
 * Seed ticket links use a neutral placeholder host (`example.com`) on purpose:
 * the contract supports ticket links, but we do NOT couple to or imply any real
 * ticketing vendor until one is actually integrated behind this contract.
 */
export const SEED_TICKET_LINKS: Readonly<Record<string, readonly TicketLink[]>> = {
  "kyoto-kinkakuji": [{ placeId: "kyoto-kinkakuji", vendor: "Official Site (seed placeholder)", url: "https://example.com/tickets/kyoto-kinkakuji" }],
  "santorini-akrotiri": [{ placeId: "santorini-akrotiri", vendor: "Official Site (seed placeholder)", url: "https://example.com/tickets/santorini-akrotiri" }],
  "marrakech-majorelle": [{ placeId: "marrakech-majorelle", vendor: "Official Site (seed placeholder)", url: "https://example.com/tickets/marrakech-majorelle" }],
  "patagonia-torres": [{ placeId: "patagonia-torres", vendor: "Park Authority (seed placeholder)", url: "https://example.com/tickets/patagonia-torres" }],
};

export const SEED_REVIEWS: Readonly<Record<string, ReviewSummary>> = {
  "kyoto-fushimi-inari": { placeId: "kyoto-fushimi-inari", averageRating: 4.7, reviewCount: 1820, highlights: ["Go at dawn to beat the crowds", "Magical torii tunnels"] },
  "kyoto-kinkakuji": { placeId: "kyoto-kinkakuji", averageRating: 4.5, reviewCount: 1340, highlights: ["Stunning reflection", "Can get busy midday"] },
  "kyoto-arashiyama": { placeId: "kyoto-arashiyama", averageRating: 4.4, reviewCount: 980, highlights: ["Surreal light", "Early morning is calmest"] },
  "santorini-oia": { placeId: "santorini-oia", averageRating: 4.6, reviewCount: 2110, highlights: ["Best sunset in the Aegean", "Arrive early for a spot"] },
  "santorini-akrotiri": { placeId: "santorini-akrotiri", averageRating: 4.3, reviewCount: 540, highlights: ["Well-preserved", "Bring water"] },
  "marrakech-jemaa": { placeId: "marrakech-jemaa", averageRating: 4.2, reviewCount: 1660, highlights: ["Electric at night", "Watch your belongings"] },
  "marrakech-majorelle": { placeId: "marrakech-majorelle", averageRating: 4.4, reviewCount: 1290, highlights: ["Peaceful oasis", "That blue is unreal"] },
  "patagonia-torres": { placeId: "patagonia-torres", averageRating: 4.8, reviewCount: 760, highlights: ["Worth the trek", "Weather changes fast"] },
};

export const SEED_EVENTS: Readonly<Record<string, readonly LocalEvent[]>> = {
  kyoto: [
    { id: "kyoto-gion-matsuri", destinationId: "kyoto", name: "Gion Matsuri", category: "festival", startsAt: "2026-07-01T00:00:00Z", endsAt: "2026-07-31T23:59:59Z", venue: "Gion district" },
  ],
  santorini: [
    { id: "santorini-jazz", destinationId: "santorini", name: "Santorini Jazz Festival", category: "music", startsAt: "2026-07-10T18:00:00Z", endsAt: "2026-07-19T23:00:00Z", venue: "Kamari Beach" },
  ],
  marrakech: [
    { id: "marrakech-popular-arts", destinationId: "marrakech", name: "National Festival of Popular Arts", category: "culture", startsAt: "2026-07-04T17:00:00Z", endsAt: "2026-07-08T23:00:00Z", venue: "El Badi Palace" },
  ],
  patagonia: [],
};

export const SEED_ADVISORIES: Readonly<Record<string, SafetyAdvisory>> = {
  kyoto: { destinationId: "kyoto", level: 1, headline: "Exercise normal precautions", updatedAt: "2026-05-01T00:00:00Z" },
  santorini: { destinationId: "santorini", level: 1, headline: "Exercise normal precautions", updatedAt: "2026-05-01T00:00:00Z" },
  marrakech: { destinationId: "marrakech", level: 2, headline: "Exercise increased caution", summary: "Petty crime in crowded markets; watch belongings.", updatedAt: "2026-05-01T00:00:00Z" },
  patagonia: { destinationId: "patagonia", level: 1, headline: "Exercise normal precautions", summary: "Remote terrain; check weather and trail status before treks.", updatedAt: "2026-05-01T00:00:00Z" },
};
