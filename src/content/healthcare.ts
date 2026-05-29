/**
 * Healthcare & medical facilities (editorial seed data, per destination).
 *
 * Orientation on where to seek care: notable hospitals/clinics (with the area
 * they're in and whether English is commonly spoken), plus a short pharmacy
 * note. This complements the emergency numbers already in `essentials.ts` — it
 * is **editorial seed data**, not medical advice, not an endorsement, and not a
 * live directory; facilities, services and hours change. `HEALTHCARE_DATA_NOTE`
 * is surfaced with every consumer, and in an emergency travellers should call
 * the local emergency number. Mirrors the `hazards.ts` content pattern.
 */

export type FacilityKind = "hospital" | "clinic" | "pharmacy" | "dental";

export interface MedicalFacility {
  readonly name: string;
  readonly kind: FacilityKind;
  /** Neighbourhood / town the facility is in. */
  readonly area: string;
  /** One neutral, factual orientation sentence. */
  readonly note: string;
  /** Whether English is commonly spoken (helps non-local-speakers triage). */
  readonly englishSpoken?: boolean;
}

export interface HealthcareProfile {
  readonly destinationId: string;
  readonly summary: string;
  readonly facilities: readonly MedicalFacility[];
  /** Pharmacy availability / after-hours note. */
  readonly pharmacyNote: string;
}

/** Shown with any healthcare data so it is never mistaken for medical advice. */
export const HEALTHCARE_DATA_NOTE =
  "Editorial orientation for planning, not medical advice, not an endorsement, " +
  "and not a live directory — facilities, services and hours change, so verify " +
  "details and your insurance coverage before relying on them. In an emergency, " +
  "call the local emergency number (see Essentials).";

export const healthcareProfiles: readonly HealthcareProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "Kyoto has excellent, modern healthcare; large university and city hospitals handle emergencies, and pharmacies are plentiful, though English support is stronger at the larger hospitals.",
    facilities: [
      { name: "Kyoto University Hospital", kind: "hospital", area: "Sakyo-ku", note: "Major teaching hospital with broad specialist and emergency care.", englishSpoken: true },
      { name: "Kyoto City Hospital", kind: "hospital", area: "Nakagyo-ku", note: "Large public general hospital serving central Kyoto.", englishSpoken: false },
      { name: "Japan Baptist Hospital", kind: "hospital", area: "Sakyo-ku", note: "General hospital known for more English-friendly service for visitors.", englishSpoken: true },
    ],
    pharmacyNote: "Pharmacies (yakkyoku) and drugstores are widespread; some larger ones keep long hours, but 24-hour pharmacies are uncommon — convenience stores stock basics.",
  },
  {
    destinationId: "santorini",
    summary:
      "Santorini has one public general hospital plus private clinics oriented to visitors; serious cases may be transferred to Crete or Athens, so travel insurance with evacuation cover is wise.",
    facilities: [
      { name: "Santorini General Hospital", kind: "hospital", area: "Karterados (near Fira)", note: "The island's main public hospital, handling emergencies and admissions.", englishSpoken: true },
      { name: "Private day clinics", kind: "clinic", area: "Fira / Oia", note: "Several private clinics cater to tourists for minor injuries and illness, paid up front.", englishSpoken: true },
    ],
    pharmacyNote: "Pharmacies (farmakeio) cluster in Fira and larger villages and rotate after-hours duty; a green cross marks them.",
  },
  {
    destinationId: "marrakech",
    summary:
      "Marrakech has a major public university hospital and several private clinics; many travellers use the private clinics for faster, English/French-speaking care, paid up front and reclaimed via insurance.",
    facilities: [
      { name: "CHU Mohammed VI", kind: "hospital", area: "Amerchich", note: "The main public university hospital, with full emergency and specialist departments.", englishSpoken: false },
      { name: "Polyclinique du Sud", kind: "clinic", area: "Gueliz", note: "Well-known private clinic popular with visitors for prompt care.", englishSpoken: true },
      { name: "Private dental clinics", kind: "dental", area: "Gueliz", note: "Modern private dental practices are available in the new town.", englishSpoken: true },
    ],
    pharmacyNote: "Pharmacies are common and a rotating pharmacie de garde covers nights/holidays; staff typically speak French and Arabic.",
  },
  {
    destinationId: "patagonia",
    summary:
      "Healthcare in Patagonia is concentrated in gateway towns and is basic for serious cases; remote trekking areas have little to no medical access, so evacuation insurance and self-sufficiency matter.",
    facilities: [
      { name: "Hospital SAMIC El Calafate", kind: "hospital", area: "El Calafate (Argentina)", note: "Public hospital serving the Los Glaciares gateway town.", englishSpoken: false },
      { name: "Hospital Dr. Augusto Essmann", kind: "hospital", area: "Puerto Natales (Chile)", note: "Regional hospital nearest the Torres del Paine gateway.", englishSpoken: false },
      { name: "Town clinics / posta", kind: "clinic", area: "El Chaltén & smaller towns", note: "Small clinics handle first aid; serious cases are transferred to larger cities.", englishSpoken: false },
    ],
    pharmacyNote: "Pharmacies (farmacia) are found in the main towns only; stock up on personal medication before heading into the parks, where there is none.",
  },
];
