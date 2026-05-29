/**
 * Public-transport how-to (editorial seed data, per destination).
 *
 * A practical, editorial seed of how to get around each destination: which
 * transit modes are available and useful, how you pay (cards, cash, apps),
 * what passes or tickets are worth knowing about, and one local tip. This is
 * **editorial seed data**, not a live feed — routes, fares, passes and ticketing
 * apps change constantly, so `TRANSIT_HOWTO_NOTE` is surfaced with every consumer
 * and current operator details should be confirmed close to travel.
 * Mirrors the `connectivity.ts` content pattern.
 */

export type TransitMode =
  | "metro_subway"
  | "bus"
  | "tram"
  | "train"
  | "taxi"
  | "rideshare"
  | "ferry"
  | "bike_share"
  | "walk";

export type FarePayment =
  | "contactless_card"
  | "transit_card"
  | "cash"
  | "mobile_app"
  | "ticket_machine";

export interface TransitOption {
  readonly mode: TransitMode;
  /** One factual sentence on this mode's coverage/usefulness here. */
  readonly note: string;
}

export interface TransitHowToProfile {
  readonly destinationId: string;
  /** The modes most travellers will rely on, most useful first. */
  readonly primaryModes: readonly TransitMode[];
  readonly options: readonly TransitOption[];
  /** How fares are commonly paid. */
  readonly payment: readonly FarePayment[];
  /** Passes/tickets worth knowing about. */
  readonly passInfo: string;
  /** One practical, local tip. */
  readonly tip: string;
}

/** Shown with any transit data so details read as guidance, not guarantees. */
export const TRANSIT_HOWTO_NOTE =
  "Editorial guide; routes, fares, passes and ticketing apps change — verify " +
  "current operator info and prices before you travel.";

export const transitHowToProfiles: readonly TransitHowToProfile[] = [
  {
    destinationId: "kyoto",
    primaryModes: ["bus", "metro_subway", "walk"],
    options: [
      { mode: "bus", note: "City buses are the backbone of sightseeing travel, reaching most temples and districts the subway misses." },
      { mode: "metro_subway", note: "Two subway lines (Karasuma and Tozai) are fast for north–south and east–west trips across the centre." },
      { mode: "train", note: "JR and private lines (Keihan, Hankyu) link Kyoto to Osaka, Nara and the wider Kansai region." },
      { mode: "walk", note: "Historic districts like Gion and Higashiyama are compact and best explored on foot." },
    ],
    payment: ["transit_card", "contactless_card", "cash"],
    passInfo: "Rechargeable IC cards (ICOCA, Suica) tap on buses, subway and trains; one-day bus/subway passes suit temple-heavy days.",
    tip: "On most city buses you board at the rear and pay a flat fare when you get off at the front; have your IC card or coins ready.",
  },
  {
    destinationId: "santorini",
    primaryModes: ["bus", "taxi", "ferry"],
    options: [
      { mode: "bus", note: "Local KTEL buses are cheap and radiate from the main hub in Fira to Oia, Kamari, Perissa and the port." },
      { mode: "taxi", note: "Taxis are few in number and scarce in peak season, so book ahead or expect waits at the rank." },
      { mode: "ferry", note: "Ferries and catamarans connect the island's ports to the mainland and other Cyclades islands." },
      { mode: "walk", note: "Fira and Oia themselves are pedestrian, with stepped lanes that are walkable but steep." },
    ],
    payment: ["cash", "contactless_card"],
    passInfo: "No island-wide travel pass; pay the conductor per KTEL bus ride, and renting an ATV or small car is a popular flexible alternative.",
    tip: "Buses fill quickly in high season and most route through Fira, so allow buffer time and have small cash for the conductor.",
  },
  {
    destinationId: "marrakech",
    primaryModes: ["taxi", "walk", "bus"],
    options: [
      { mode: "taxi", note: "Beige 'petit taxis' handle short city hops; insist on the meter or agree the fare before setting off." },
      { mode: "walk", note: "The walled medina is a car-free maze best navigated on foot, with the souks and Jemaa el-Fnaa at its heart." },
      { mode: "bus", note: "Alsa city buses cover the new town (Gueliz) and outlying areas at low cost, mainly useful beyond the medina." },
    ],
    payment: ["cash", "mobile_app"],
    passInfo: "No integrated pass; petit-taxi rides are paid in cash and ride-hailing apps cover some routes, while horse-drawn caleches are a tourist novelty rather than transport.",
    tip: "Petit taxis legally seat up to three; agree the price or confirm the meter is running before you get in to avoid overcharging.",
  },
  {
    destinationId: "patagonia",
    primaryModes: ["bus", "taxi"],
    options: [
      { mode: "bus", note: "Long-distance coaches are the main way to move between towns like El Calafate, Puerto Natales and El Chaltén." },
      { mode: "taxi", note: "Taxis and transfer vans cover short hops within towns and runs to nearby trailheads and airports." },
      { mode: "bus", note: "Park shuttle and connection buses link gateway towns to Torres del Paine and Los Glaciares entrances." },
    ],
    payment: ["cash", "contactless_card", "mobile_app"],
    passInfo: "No regional transit pass; book intercity bus seats in advance in season, and renting a car gives the most freedom given sparse urban transit.",
    tip: "Distances are vast and services infrequent, so reserve long-distance buses ahead and don't count on hailing transport in remote areas.",
  },
];
