/**
 * Timezone & business hours (editorial seed data, per destination).
 *
 * Captures a destination's IANA timezone and UTC offset, whether it observes
 * daylight saving, which days form the local weekend, and the *typical* opening
 * hours travellers can expect for shops, restaurants, banks and the like — plus
 * any midday-closure / siesta custom worth knowing. These are **editorial,
 * typical** hours, not live opening times: individual establishments, seasons,
 * public holidays and DST shifts all move the dates and times around, so
 * `TIMEZONE_DATA_NOTE` is surfaced with every consumer and details should be
 * confirmed before relying on them. Mirrors the `connectivity.ts` content pattern.
 */

export type HoursCategory =
  | "shops"
  | "restaurants"
  | "banks"
  | "government"
  | "markets";

export interface BusinessHours {
  readonly category: HoursCategory;
  /** Typical opening hours in plain text (e.g. "10:00–20:00, closed Sun"). */
  readonly typical: string;
}

export interface TimezoneProfile {
  readonly destinationId: string;
  /** Valid IANA zone ID (e.g. "Asia/Tokyo"). */
  readonly ianaTimeZone: string;
  /** Human-readable standard-time offset label (e.g. "UTC+9"). */
  readonly utcOffsetLabel: string;
  /** Whether the zone observes daylight saving (offset shifts seasonally). */
  readonly observesDst: boolean;
  /** Days locals treat as the weekend (e.g. ["Saturday","Sunday"]). */
  readonly weekendDays: readonly string[];
  readonly hours: readonly BusinessHours[];
  /** Any siesta / midday-closure custom worth flagging. */
  readonly siestaNote?: string;
}

/** Shown with any timezone data so hours read as typical guidance, not guarantees. */
export const TIMEZONE_DATA_NOTE =
  "Editorial guide to typical business hours and local time; actual hours vary " +
  "by establishment, season and public holiday, and daylight-saving changes can " +
  "shift both clocks and the dates they apply — verify current hours before you " +
  "rely on them.";

export const timezoneProfiles: readonly TimezoneProfile[] = [
  {
    destinationId: "kyoto",
    ianaTimeZone: "Asia/Tokyo",
    utcOffsetLabel: "UTC+9",
    observesDst: false,
    weekendDays: ["Saturday", "Sunday"],
    hours: [
      { category: "shops", typical: "10:00–20:00 daily; department stores often to 20:00" },
      { category: "restaurants", typical: "11:00–14:00 lunch, 17:00–22:00 dinner; many close between services" },
      { category: "banks", typical: "09:00–15:00, closed Sat/Sun and national holidays" },
      { category: "government", typical: "08:30–17:15 Mon–Fri, closed weekends" },
    ],
    siestaNote: "No siesta custom; many restaurants close in the mid-afternoon between lunch and dinner service.",
  },
  {
    destinationId: "santorini",
    ianaTimeZone: "Europe/Athens",
    utcOffsetLabel: "UTC+2",
    observesDst: true,
    weekendDays: ["Saturday", "Sunday"],
    hours: [
      { category: "shops", typical: "09:00–14:00 and 17:30–21:00 in summer; many close Sun" },
      { category: "restaurants", typical: "Lunch from 13:00, dinner from 20:00 and often late into the night" },
      { category: "banks", typical: "08:00–14:30 Mon–Thu, to 14:00 Fri, closed weekends" },
    ],
    siestaNote: "Observe the Greek afternoon rest (mesimeri): many shops and offices shut roughly 14:00–17:30, especially in summer.",
  },
  {
    destinationId: "marrakech",
    ianaTimeZone: "Africa/Casablanca",
    utcOffsetLabel: "UTC+1",
    observesDst: false,
    weekendDays: ["Friday", "Sunday"],
    hours: [
      { category: "shops", typical: "09:00–13:00 and 15:00–19:00; souks open later, quieter midday Fri" },
      { category: "markets", typical: "Souks roughly 09:00–21:00 daily; busiest in the evening" },
      { category: "banks", typical: "08:30–15:30 Mon–Fri; reduced hours during Ramadan" },
      { category: "government", typical: "08:30–16:30 Mon–Fri, with a Friday midday prayer break" },
    ],
    siestaNote: "Friday is the main prayer day; many places go quiet around midday Friday for jumu'ah, and the local weekend pattern varies (Fri/Sun is common).",
  },
  {
    destinationId: "patagonia",
    ianaTimeZone: "America/Argentina/Rio_Gallegos",
    utcOffsetLabel: "UTC-3",
    observesDst: false,
    weekendDays: ["Saturday", "Sunday"],
    hours: [
      { category: "shops", typical: "09:00–13:00 and 17:00–21:00; smaller towns close midday" },
      { category: "restaurants", typical: "Dinner rarely before 21:00, often running past midnight Argentine-style" },
      { category: "banks", typical: "10:00–15:00 Mon–Fri, closed weekends" },
    ],
    siestaNote: "Argentina currently observes no daylight saving; expect a long midday break in smaller towns and very late evening dining.",
  },
];
