/**
 * Know-before-you-go local essentials (editorial seed data).
 *
 * Per-destination practical must-knows: emergency phone numbers, a short
 * healthcare orientation, and cultural etiquette (do's and don'ts) so travellers
 * don't unknowingly offend locals. **Editorial seed data**, not official or
 * live — emergency numbers and rules vary by region/network and change, so
 * `ESSENTIALS_DATA_NOTE` is surfaced with every consumer and travellers are told
 * to verify on arrival. Mirrors the `culinary.ts` content pattern.
 */

export interface EmergencyNumbers {
  /** Pan-network number where one applies (e.g. 112 across the EU / many GSM nets). */
  readonly universal?: string;
  readonly police?: string;
  readonly ambulance?: string;
  readonly fire?: string;
}

/** A handful of courtesy phrases in the local language. */
export interface KeyPhrase {
  /** English meaning, e.g. "Thank you". */
  readonly en: string;
  /** Local-language rendering (native script where applicable). */
  readonly local: string;
  /** Romanized pronunciation hint, when the script isn't Latin. */
  readonly pronunciation?: string;
}

export interface LocalEssentials {
  readonly destinationId: string;
  /** Primary local language these phrases are in. */
  readonly language: string;
  readonly emergency: EmergencyNumbers;
  /** Short healthcare orientation (pharmacies, insurance, pay-upfront, water). */
  readonly healthcareNote: string;
  /** Courtesy phrases (hello / thank you / please / yes / no …). */
  readonly keyPhrases: readonly KeyPhrase[];
  /** Customs that help a traveller fit in. */
  readonly etiquetteDos: readonly string[];
  /** Things to avoid so as not to offend locals. */
  readonly etiquetteDonts: readonly string[];
}

/** Shown with any essentials data so it is never mistaken for official guidance. */
export const ESSENTIALS_DATA_NOTE =
  "Editorial guidance for planning, not official advice. Emergency numbers and " +
  "local rules vary by region/network and can change — verify on arrival.";

export const localEssentials: readonly LocalEssentials[] = [
  {
    destinationId: "kyoto",
    language: "Japanese",
    emergency: { police: "110", ambulance: "119", fire: "119" },
    healthcareNote:
      "Care is excellent but hospitals may require upfront payment — carry your passport and travel insurance. Pharmacies (yakkyoku) are widespread.",
    keyPhrases: [
      { en: "Hello", local: "こんにちは", pronunciation: "Konnichiwa" },
      { en: "Thank you", local: "ありがとう", pronunciation: "Arigatō" },
      { en: "Please", local: "お願いします", pronunciation: "Onegaishimasu" },
      { en: "Excuse me / Sorry", local: "すみません", pronunciation: "Sumimasen" },
      { en: "Yes / No", local: "はい / いいえ", pronunciation: "Hai / Iie" },
    ],
    etiquetteDos: [
      "Remove your shoes where indicated (homes, ryokan, some restaurants).",
      "Keep your voice down on trains and set your phone to silent.",
      "Queue neatly and wait to be seated.",
      "A slight bow is a warm, standard greeting.",
    ],
    etiquetteDonts: [
      "Don't tip — it can cause confusion rather than please.",
      "Don't stick chopsticks upright in rice or pass food chopstick-to-chopstick.",
      "Don't talk on the phone or eat while walking in many areas.",
    ],
  },
  {
    destinationId: "santorini",
    language: "Greek",
    emergency: { universal: "112", police: "100", ambulance: "166", fire: "199" },
    healthcareNote:
      "EU visitors: carry your EHIC/GHIC; others need travel insurance. Pharmacies (farmakeio) handle minor issues; island clinics cover emergencies.",
    keyPhrases: [
      { en: "Hello", local: "Γεια σας", pronunciation: "Yia sas" },
      { en: "Thank you", local: "Ευχαριστώ", pronunciation: "Efcharistó" },
      { en: "Please / You're welcome", local: "Παρακαλώ", pronunciation: "Parakaló" },
      { en: "Yes / No", local: "Ναι / Όχι", pronunciation: "Ne / Óchi" },
    ],
    etiquetteDos: [
      "Dress modestly in churches and monasteries (cover shoulders and knees).",
      "Expect a relaxed pace — many shops close in the early afternoon.",
      "Greet with 'Yia sas' and a smile; tipping ~5–10% is appreciated.",
    ],
    etiquetteDonts: [
      "Don't flush toilet paper — use the bin (island plumbing).",
      "Don't be loud or impatient in tavernas; meals are unhurried.",
      "Don't photograph church interiors where signs forbid it.",
    ],
  },
  {
    destinationId: "marrakech",
    language: "Arabic (Darija); French widely spoken",
    emergency: { universal: "112", police: "19", ambulance: "15", fire: "15" },
    healthcareNote:
      "Private clinics are good but pay-upfront — travel insurance is essential. Drink bottled water.",
    keyPhrases: [
      { en: "Hello (peace)", local: "السلام عليكم", pronunciation: "Salam ʿalaykum" },
      { en: "Thank you", local: "شكراً", pronunciation: "Shukran" },
      { en: "Please", local: "من فضلك", pronunciation: "Min faḍlik" },
      { en: "Yes / No", local: "نعم / لا", pronunciation: "Naʿam / La" },
      { en: "Hello / Thanks (French)", local: "Bonjour / Merci", pronunciation: "bon-zhoor / mair-see" },
    ],
    etiquetteDos: [
      "Dress modestly, especially women (cover shoulders and knees).",
      "Ask permission before photographing people.",
      "Use your right hand to eat and to greet; remove shoes entering a home.",
      "Haggle politely in the souks — it's expected and part of the fun.",
    ],
    etiquetteDonts: [
      "Don't enter mosques unless you're Muslim — most are closed to non-Muslims.",
      "Don't drink alcohol or show public affection openly.",
      "Be discreet about eating or drinking in daylight during Ramadan.",
    ],
  },
  {
    destinationId: "patagonia",
    language: "Spanish",
    emergency: {
      universal: "911 (Argentina)",
      police: "911 (Arg.) / 133 (Chile)",
      ambulance: "107 (Arg.) / 131 (Chile)",
      fire: "100 (Arg.) / 132 (Chile)",
    },
    healthcareNote:
      "Towns have clinics but remote areas are far from care — carry insurance with evacuation cover and basic supplies.",
    keyPhrases: [
      { en: "Hello", local: "Hola" },
      { en: "Thank you", local: "Gracias" },
      { en: "Please", local: "Por favor" },
      { en: "You're welcome", local: "De nada" },
      { en: "Yes / No", local: "Sí / No" },
    ],
    etiquetteDos: [
      "Greet friends with a single kiss on the cheek.",
      "Eat dinner late (after 9pm), as locals do.",
      "Accept and share mate when offered — it's a bonding ritual.",
      "Carry cash in remote towns.",
    ],
    etiquetteDonts: [
      "Don't rush interactions; rapport comes before business.",
      "Don't stir the mate or refuse it rudely when it's shared with you.",
      "Don't underestimate fast-changing mountain weather.",
    ],
  },
];
