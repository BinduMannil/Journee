/**
 * Connectivity & power (editorial seed data).
 *
 * The practical infrastructure a traveller needs to stay charged, connected and
 * hydrated at each destination: plug types and voltage, local SIM/eSIM options,
 * whether the tap water is potable, and how good mobile/wifi coverage is.
 * **Editorial seed data**, not a live feed — carriers, eSIM support and local
 * advisories change, so `CONNECTIVITY_DATA_NOTE` is surfaced with every consumer
 * and details should be confirmed close to travel.
 * Mirrors the `festivals.ts` content pattern.
 */

export interface ConnectivityProfile {
  readonly destinationId: string;
  /** Socket/plug standards in use (e.g. ["Type A","Type B"]). */
  readonly plugTypes: readonly string[];
  /** Mains voltage and frequency (e.g. "100V / 50–60Hz"). */
  readonly voltage: string;
  /** Local carriers / eSIM availability for staying connected. */
  readonly simOptions: readonly string[];
  /** Whether tap water is generally safe to drink. */
  readonly tapWaterPotable: boolean;
  /** Mobile coverage / wifi quality notes (e.g. patchy in remote areas). */
  readonly connectivityNote: string;
}

/** Shown with any connectivity data so details read as guidance, not guarantees. */
export const CONNECTIVITY_DATA_NOTE =
  "Editorial guide; plug standards, carriers, eSIM support and water advisories " +
  "change — verify current details and bring a universal adapter before you travel.";

export const connectivityProfiles: readonly ConnectivityProfile[] = [
  {
    destinationId: "kyoto",
    plugTypes: ["Type A", "Type B"],
    voltage: "100V / 50–60Hz",
    simOptions: ["eSIM widely supported", "Docomo/au/SoftBank prepaid SIMs", "Airport SIM rental kiosks"],
    tapWaterPotable: true,
    connectivityNote: "Excellent 4G/5G coverage citywide and abundant free wifi at stations, cafés and convenience stores.",
  },
  {
    destinationId: "santorini",
    plugTypes: ["Type C", "Type F"],
    voltage: "230V / 50Hz",
    simOptions: ["eSIM supported", "EU/Greek SIMs (Cosmote, Vodafone, Nova)", "EU roaming (no extra cost for EU plans)"],
    tapWaterPotable: false,
    connectivityNote: "Good mobile coverage across the island; tap water is mostly desalinated/borehole — locals and hotels recommend bottled water for drinking.",
  },
  {
    destinationId: "marrakech",
    plugTypes: ["Type C", "Type E"],
    voltage: "220V / 50Hz",
    simOptions: ["Local SIMs (Maroc Telecom, Orange, Inwi)", "eSIM availability growing", "SIMs sold at the airport and in the medina"],
    tapWaterPotable: false,
    connectivityNote: "Good 4G coverage in the city; tap water is not safe for visitors to drink — stick to sealed bottled water.",
  },
  {
    destinationId: "patagonia",
    plugTypes: ["Type C", "Type I"],
    voltage: "220V / 50Hz",
    simOptions: ["Local SIMs (Claro, Movistar, Personal/Entel)", "eSIM in larger towns and cities", "Buy SIMs in El Calafate / Puerto Natales / Bariloche"],
    tapWaterPotable: true,
    connectivityNote: "Tap water is generally potable in towns; mobile and wifi coverage is patchy to absent across remote parks (Torres del Paine, Los Glaciares) — plan to be offline.",
  },
];
