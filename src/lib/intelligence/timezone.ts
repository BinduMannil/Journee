/**
 * Timezone & business hours accessor (pure, no I/O).
 *
 * Reads the editorial timezone seed data and answers "what is the local time
 * here", "what are the typical hours for this category of place", and "what's
 * the timezone profile". Deterministic + unit-tested. Pair output with
 * `TIMEZONE_DATA_NOTE` (re-exported) so hours read as typical guidance, not
 * guaranteed live opening times.
 */
import {
  TIMEZONE_DATA_NOTE,
  timezoneProfiles,
  type BusinessHours,
  type HoursCategory,
  type TimezoneProfile,
} from "@/content/timezone";

export { TIMEZONE_DATA_NOTE };
export type {
  TimezoneProfile,
  BusinessHours,
  HoursCategory,
} from "@/content/timezone";

/** The timezone profile for a destination, or null when none is catalogued. */
export function getTimezoneProfile(destinationId: string): TimezoneProfile | null {
  return timezoneProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Typical business hours for a category at a destination, or null when unknown. */
export function businessHoursFor(
  destinationId: string,
  category: HoursCategory,
): BusinessHours | null {
  return (
    getTimezoneProfile(destinationId)?.hours.find((h) => h.category === category) ?? null
  );
}

/**
 * The current local time at a destination as "HH:mm" (24-hour), or null for an
 * unknown destination. Pass `now` for deterministic output; defaults to the
 * current instant.
 */
export function currentTimeAt(destinationId: string, now?: Date): string | null {
  const profile = getTimezoneProfile(destinationId);
  if (!profile) return null;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: profile.ianaTimeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now ?? new Date());
}
