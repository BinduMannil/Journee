/**
 * Best time to visit (editorial seed data, per destination).
 *
 * A month-by-month editorial read on *when* to visit each destination, rating
 * each of the twelve months for the typical balance of weather, crowds and
 * prices, with a short reason per month. This is general seasonality guidance —
 * it describes a *typical* year, not a forecast — so peak/shoulder/off framing
 * helps travellers weigh trade-offs, never guarantee them. `BEST_TIME_DATA_NOTE`
 * is surfaced with every consumer. Mirrors the `festivals.ts` content pattern.
 */

export type SeasonRating = "ideal" | "good" | "fair" | "avoid";

export interface MonthAssessment {
  /** Calendar month, 1 (January) … 12 (December). */
  readonly month: number;
  readonly rating: SeasonRating;
  /** One short reason covering weather, crowds and/or prices. */
  readonly note: string;
}

export interface BestTimeProfile {
  readonly destinationId: string;
  readonly summary: string;
  /** Exactly 12 entries, months 1..12 in ascending order. */
  readonly months: readonly MonthAssessment[];
}

/** Shown with any best-time data so it reads as general guidance, not a forecast. */
export const BEST_TIME_DATA_NOTE =
  "Editorial general guidance based on typical seasonality; actual weather, " +
  "crowds and prices vary year to year and by event — verify the live forecast " +
  "and event calendar before booking.";

export const bestTimeProfiles: readonly BestTimeProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "Spring cherry blossom and autumn foliage are the standout windows — both stunning but busy; summer is hot and humid, winter cool and quiet.",
    months: [
      { month: 1, rating: "good", note: "Cold and quiet with occasional light snow on temples; low crowds and off-peak prices." },
      { month: 2, rating: "good", note: "Still cold but calm; plum blossoms begin and visitor numbers stay low." },
      { month: 3, rating: "good", note: "Mild and improving; late-month cherry blossom starts to draw early crowds and rising prices." },
      { month: 4, rating: "ideal", note: "Peak cherry blossom and pleasant temperatures — spectacular but very crowded with premium prices." },
      { month: 5, rating: "ideal", note: "Warm, fresh greenery and comfortable weather; busy around Golden Week but excellent overall." },
      { month: 6, rating: "fair", note: "Rainy season brings humidity and frequent showers, though crowds and prices ease." },
      { month: 7, rating: "fair", note: "Hot and humid; the Gion Matsuri festival is a highlight but the heat is taxing." },
      { month: 8, rating: "fair", note: "Peak summer heat and humidity make midday sightseeing tiring despite lively summer events." },
      { month: 9, rating: "good", note: "Heat eases late in the month; some typhoon risk but crowds remain moderate." },
      { month: 10, rating: "ideal", note: "Crisp, clear autumn weather with early foliage — one of the best months to visit." },
      { month: 11, rating: "ideal", note: "Peak autumn foliage is breathtaking; expect heavy crowds and higher prices." },
      { month: 12, rating: "good", note: "Cool and increasingly quiet after the foliage rush; pleasant for unhurried temple visits." },
    ],
  },
  {
    destinationId: "santorini",
    summary:
      "May and October shoulder months hit the sweet spot of warm weather and thinner crowds; summer is hot, crowded and pricey, and winter sees many closures.",
    months: [
      { month: 1, rating: "avoid", note: "Cool, windy and very quiet with many hotels, tours and restaurants closed for winter." },
      { month: 2, rating: "avoid", note: "Still low season; limited services open and changeable, breezy weather." },
      { month: 3, rating: "fair", note: "Mild and quiet as the island slowly wakes up; some venues remain closed." },
      { month: 4, rating: "good", note: "Spring warmth returns and most businesses reopen; pleasant with modest crowds and prices." },
      { month: 5, rating: "ideal", note: "Warm, sunny shoulder weather with manageable crowds and good value — an excellent window." },
      { month: 6, rating: "good", note: "Hot and sunny as peak season ramps up; crowds and prices climbing but not yet at their worst." },
      { month: 7, rating: "fair", note: "Peak heat and very heavy crowds with the highest prices of the year." },
      { month: 8, rating: "fair", note: "The hottest, most crowded and most expensive month; book everything well ahead." },
      { month: 9, rating: "good", note: "Still warm with sea swimming and easing crowds as peak season winds down." },
      { month: 10, rating: "ideal", note: "Mild, golden shoulder weather with far fewer crowds and lower prices — a favourite time." },
      { month: 11, rating: "fair", note: "Cooling and quieter as many seasonal businesses begin to close for winter." },
      { month: 12, rating: "avoid", note: "Cool, windy off-season with widespread closures and minimal nightlife." },
    ],
  },
  {
    destinationId: "marrakech",
    summary:
      "Spring and autumn are ideal for comfortable sightseeing; summer brings extreme, draining heat, while winter is mild and pleasant.",
    months: [
      { month: 1, rating: "good", note: "Mild, sunny days and cool nights; low-season calm and good value." },
      { month: 2, rating: "good", note: "Pleasant winter weather with comfortable daytime temperatures and modest crowds." },
      { month: 3, rating: "ideal", note: "Warm, dry spring days are perfect for the medina and gardens, with manageable crowds." },
      { month: 4, rating: "ideal", note: "Excellent spring weather and lively atmosphere; popular but very comfortable." },
      { month: 5, rating: "ideal", note: "Warm and dry before the summer heat sets in — one of the best months to explore." },
      { month: 6, rating: "avoid", note: "Intense early-summer heat makes daytime sightseeing uncomfortable despite lower prices." },
      { month: 7, rating: "avoid", note: "Extreme heat regularly exceeds 38°C, demanding shade and midday rest." },
      { month: 8, rating: "avoid", note: "Peak summer heat is exhausting and draining; the least comfortable month to visit." },
      { month: 9, rating: "ideal", note: "Heat eases into warm, dry autumn weather ideal for sightseeing." },
      { month: 10, rating: "ideal", note: "Warm, pleasant days and comfortable evenings make this a prime visiting window." },
      { month: 11, rating: "ideal", note: "Mild autumn weather and softer light; comfortable with moderate crowds." },
      { month: 12, rating: "good", note: "Cool, sunny days and chilly nights; festive and good value with low-season prices." },
    ],
  },
  {
    destinationId: "patagonia",
    summary:
      "Southern-hemisphere seasons mean the December–February summer is the ideal but busy peak; November and March are pleasant shoulders, and winter brings closures and harsh weather.",
    months: [
      { month: 1, rating: "ideal", note: "Peak austral summer with long days and the best trekking weather; busiest and priciest." },
      { month: 2, rating: "ideal", note: "Warm, long summer days remain excellent for hiking, though crowds and prices stay high." },
      { month: 3, rating: "good", note: "Early-autumn shoulder with cooler air, golden colours and thinning crowds." },
      { month: 4, rating: "fair", note: "Cooler and more changeable as services start winding down toward winter." },
      { month: 5, rating: "fair", note: "Late autumn brings short days and cold; many tours and refugios begin to close." },
      { month: 6, rating: "avoid", note: "Deep winter with harsh cold, fierce winds and widespread closures in the parks." },
      { month: 7, rating: "avoid", note: "Coldest, darkest stretch; many trails, lodges and services are shut." },
      { month: 8, rating: "avoid", note: "Harsh winter conditions and limited access make most park visits impractical." },
      { month: 9, rating: "fair", note: "Early spring is cold and unsettled, with services only beginning to reopen." },
      { month: 10, rating: "good", note: "Spring shoulder with reawakening services and fewer crowds, though weather is variable." },
      { month: 11, rating: "good", note: "Late-spring shoulder with longer days and lower crowds ahead of peak season." },
      { month: 12, rating: "ideal", note: "Summer arrives with long daylight and prime trekking conditions; busy and in high demand." },
    ],
  },
];
