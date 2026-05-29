/**
 * Travel-data → intelligence bridge (pure).
 *
 * Turns travel-data provider responses (places, opening hours, events, safety
 * advisories) into the existing engines' input fragments. This is the seam that
 * lets the contract-ready travel-data layer feed the destination / disruption /
 * event engines without those engines depending on a vendor.
 *
 * HONEST BY CONSTRUCTION: a fragment is only produced from an `ok` response (and
 * optionally only from non-stale data). An unavailable/error/stale source yields
 * an EMPTY fragment, so the engine simply lacks that input — which lowers its
 * coverage-based `confidence` rather than fabricating a value. No live data is
 * involved today; the seed adapters feed this end-to-end. Pure, no I/O.
 */
import type { DestinationContext } from "./engines/destination";
import type { DisruptionContext } from "./engines/disruption";
import type { EventContext } from "./engines/events";
import type {
  LocalEvent,
  OpeningHours,
  SafetyAdvisory,
  TravelDataOk,
  TravelDataResponse,
} from "@/lib/providers/travel-data/contracts";
import { classifySourceQuality, isStale, type ResultQuality } from "@/lib/providers/travel-data/freshness";

export interface BridgeOptions {
  /** Clock for open-now + staleness; defaults to now. */
  readonly now?: Date;
  /** When true, treat stale sources as unusable (omit the fragment). */
  readonly dropStale?: boolean;
}

/** A response is usable when it succeeded, has usable quality, and isn't dropped for staleness. */
function usable<T>(res: TravelDataResponse<T>, opts: BridgeOptions): res is TravelDataOk<T> {
  if (res.status !== "ok") return false;
  const now = opts.now ?? new Date();
  if (classifySourceQuality(res.source, now) === "none") return false;
  if (opts.dropStale && isStale(res.source, now)) return false;
  return true;
}

/** The quality the bridge sees for a response (for callers/telemetry). */
export function responseQuality(res: TravelDataResponse<unknown>, now: Date = new Date()): ResultQuality {
  if (res.status !== "ok") return "none";
  return classifySourceQuality(res.source, now);
}

// ── Opening hours → "open now" ───────────────────────────────────────────────

function hhmmToMinutes(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 24 || min < 0 || min > 59) return null;
  return h * 60 + min;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Local (timezone-aware) day-of-week + minutes-since-midnight for an instant. */
function localDayMinutes(now: Date, timeZone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sunday";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const day = WEEKDAYS.indexOf(weekday);
  return { day: day < 0 ? 0 : day, minutes: hour * 60 + minute };
}

/**
 * Whether the given day-record covers `minutes`.
 * - `tail: false` — evaluate the day's own span: a normal span covers
 *   `[open, close)`; an overnight span (close <= open) contributes only its
 *   evening portion `[open, midnight)` here.
 * - `tail: true` — evaluate only the post-midnight tail `[midnight, close)` of
 *   an overnight span. Used for the *previous* day's record, whose overnight
 *   span runs into the current morning.
 */
function recordCovers(rec: OpeningHours["weekly"][number] | undefined, minutes: number, tail: boolean): boolean {
  if (!rec || rec.closed || !rec.open || !rec.close) return false;
  const open = hhmmToMinutes(rec.open);
  const close = hhmmToMinutes(rec.close);
  if (open === null || close === null) return false;
  const overnight = close <= open;
  if (tail) return overnight && minutes < close;
  if (overnight) return minutes >= open;
  return minutes >= open && minutes < close;
}

/**
 * Whether a place is open at `now`, honoring its timezone and overnight spans.
 *
 * Overnight spans (e.g. 22:00–02:00) are attributed to the day they *start*: the
 * early-morning portion belongs to the previous day's record, not today's. This
 * matters once weekday schedules differ (uniform seed data masks it).
 */
export function isOpenNow(hours: OpeningHours, now: Date = new Date()): boolean {
  const { day, minutes } = localDayMinutes(now, hours.timezone);
  const today = hours.weekly.find((d) => d.day === day);
  if (recordCovers(today, minutes, false)) return true;
  // Post-midnight tail of an overnight span that started yesterday.
  const yesterday = hours.weekly.find((d) => d.day === (day + 6) % 7);
  return recordCovers(yesterday, minutes, true);
}

export function openingHoursToDestinationContext(
  res: TravelDataResponse<OpeningHours>,
  opts: BridgeOptions = {},
): Partial<DestinationContext> {
  if (!usable(res, opts)) return {};
  return { isOpenNow: isOpenNow(res.data, opts.now ?? new Date()) };
}

// ── Safety advisory → disruption "advisory confidence" ───────────────────────

/** Map a 1..4 advisory level to 0..1 confidence (1 = level 1 safe, 0 = level 4). */
export function advisoryLevelToConfidence(level: number): number {
  const clamped = Math.min(4, Math.max(1, level));
  return (4 - clamped) / 3;
}

export function advisoryToDisruptionContext(
  res: TravelDataResponse<SafetyAdvisory>,
  opts: BridgeOptions = {},
): Partial<DisruptionContext> {
  if (!usable(res, opts)) return {};
  return { advisoryConfidence: advisoryLevelToConfidence(res.data.level) };
}

// ── Local events → event "festival intensity" ────────────────────────────────

/** Count events whose window contains `now` (open-ended end = ongoing). */
export function activeEventCount(events: readonly LocalEvent[], now: Date = new Date()): number {
  const t = now.getTime();
  return events.filter((e) => {
    const start = new Date(e.startsAt).getTime();
    const end = e.endsAt ? new Date(e.endsAt).getTime() : Infinity;
    return t >= start && t <= end;
  }).length;
}

export function eventsToEventContext(
  res: TravelDataResponse<readonly LocalEvent[]>,
  opts: BridgeOptions = {},
): Partial<EventContext> {
  if (!usable(res, opts)) return {};
  const now = opts.now ?? new Date();
  const active = activeEventCount(res.data, now);
  // 0 active → quiet (0); saturates at 3 concurrent events.
  return { festivalIntensity: Math.min(1, active / 3) };
}
