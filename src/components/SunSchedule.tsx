"use client";

import { useEffect, useState } from "react";
import { sunTimes, formatSolarTime, type SunTimes } from "@/lib/intelligence/solar";

/**
 * Today's light schedule for a destination — sunrise, sunset, golden hour, and
 * day length — from real solar math (no network). Times are *local solar time*
 * (a few minutes off civil time; time zone, DST, and the equation of time are
 * omitted), labeled honestly rather than presented as a civil clock.
 */
function dayLength(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function SunSchedule({ lat }: { lat: number }) {
  const [t, setT] = useState<SunTimes | null>(null);

  useEffect(() => {
    setT(sunTimes(new Date(), lat));
  }, [lat]);

  if (!t) return null;

  return (
    <div className="mt-6 rounded-2xl border border-sand/10 p-7">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Today&rsquo;s light</p>
        <span
          className="text-[10px] uppercase tracking-[0.2em] text-stone"
          title="Computed from solar position; shown in approximate local solar time (no time zone/DST)."
        >
          Local solar time
        </span>
      </div>

      {t.condition === "midnight-sun" ? (
        <p className="text-sand/80">
          Midnight sun — the sun never sets today. Endless golden light.
        </p>
      ) : t.condition === "polar-night" ? (
        <p className="text-sand/80">
          Polar night — the sun stays below the horizon today.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-x-10 gap-y-3">
            <div>
              <p className="font-display text-3xl text-gold-bright">
                {formatSolarTime(t.sunrise ?? 0)}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-stone">Sunrise</p>
            </div>
            <div>
              <p className="font-display text-3xl text-gold-bright">
                {formatSolarTime(t.sunset ?? 0)}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-stone">Sunset</p>
            </div>
            <div>
              <p className="font-display text-3xl text-sand">{dayLength(t.dayLengthHours)}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-stone">Daylight</p>
            </div>
          </div>
          {t.eveningGolden && (
            <p className="mt-4 text-sm text-sand/70">
              <span className="uppercase tracking-[0.25em] text-gold">Golden hour</span>
              <span className="ml-3">
                {formatSolarTime(t.eveningGolden.start)}–{formatSolarTime(t.eveningGolden.end)}
              </span>
              {t.morningGolden && (
                <span className="ml-3 text-sand/50">
                  (and {formatSolarTime(t.morningGolden.start)}–
                  {formatSolarTime(t.morningGolden.end)} at dawn)
                </span>
              )}
            </p>
          )}
        </>
      )}
    </div>
  );
}
