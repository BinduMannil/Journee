"use client";

import { useMemo, useState } from "react";
import { convert, availableCurrencies } from "@/lib/providers/fx/convert";
import type { FxRates } from "@/lib/providers/fx/types";

/**
 * Currency converter. Rates are resolved on the server (FX provider) and passed
 * in, so this component is pure presentation over the pure `convert` math. The
 * rate source + capture date are shown honestly — seed rates are labelled
 * "indicative", never presented as live.
 */
export function CurrencyConverter({ rates }: { rates: FxRates }) {
  const currencies = useMemo(() => [...availableCurrencies(rates)].sort(), [rates]);
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState(rates.base);
  const [to, setTo] = useState(currencies.find((c) => c !== rates.base) ?? rates.base);

  const result = convert(amount, from, to, rates);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const selectClass =
    "rounded-lg border border-sand/20 bg-ink px-3 py-2 text-sand focus:border-gold/60 focus:outline-none";

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="fx-amount" className="mb-1 block text-xs uppercase tracking-[0.2em] text-stone">
            Amount
          </label>
          <input
            id="fx-amount"
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-32 rounded-lg border border-sand/20 bg-transparent px-3 py-2 text-sand focus:border-gold/60 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="fx-from" className="mb-1 block text-xs uppercase tracking-[0.2em] text-stone">
            From
          </label>
          <select id="fx-from" value={from} onChange={(e) => setFrom(e.target.value)} className={selectClass}>
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={swap}
          aria-label="Swap currencies"
          className="rounded-full border border-sand/20 px-3 py-2 text-gold-bright transition-colors hover:bg-gold/10"
        >
          ⇄
        </button>
        <div>
          <label htmlFor="fx-to" className="mb-1 block text-xs uppercase tracking-[0.2em] text-stone">
            To
          </label>
          <select id="fx-to" value={to} onChange={(e) => setTo(e.target.value)} className={selectClass}>
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-5 font-display text-3xl text-sand">
        {result === null ? "—" : `${result.toLocaleString()} ${to}`}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone">
        {rates.source === "seed" ? "Indicative rates" : "Live rates"} · as of {rates.asOf}
      </p>
    </div>
  );
}
