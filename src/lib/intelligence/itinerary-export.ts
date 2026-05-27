/**
 * Itinerary → iCalendar (.ics) export (pure, no network).
 *
 * Turns a built itinerary into a standards-compliant VCALENDAR string: one
 * all-day VEVENT per itinerary day, starting from a chosen date. Lets a
 * traveler take the plan into any calendar app. Deterministic and unit-tested.
 */
import type { Itinerary } from "./itinerary";

/** Escape per RFC 5545 text rules (backslash, semicolon, comma, newline). */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** YYYYMMDD in UTC for a date-only (all-day) value. */
function dateOnly(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function addDaysUTC(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

export interface ICSOptions {
  /** First day of the trip (interpreted in UTC for the date-only values). */
  readonly startDate: Date;
  /** Stable timestamp for DTSTAMP/UID (defaults to startDate). */
  readonly now?: Date;
  readonly calendarName?: string;
}

export function itineraryToICS(itinerary: Itinerary, opts: ICSOptions): string {
  const now = opts.now ?? opts.startDate;
  const stamp = `${dateOnly(now)}T000000Z`;
  const name = opts.calendarName ?? "Journee trip";

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Journee//Trip Planner//EN",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${escapeText(name)}`,
  ];

  itinerary.days.forEach((day, i) => {
    const start = addDaysUTC(opts.startDate, i);
    const end = addDaysUTC(opts.startDate, i + 1);
    const titles = day.items.map((it) => it.title);
    const summary = `Day ${i + 1}: ${titles.join(", ")}`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:journee-day${i + 1}-${dateOnly(start)}@journee`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${dateOnly(start)}`,
      `DTEND;VALUE=DATE:${dateOnly(end)}`,
      `SUMMARY:${escapeText(summary)}`,
      `DESCRIPTION:${escapeText(titles.join("\n"))}`,
      "END:VEVENT",
    );
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
