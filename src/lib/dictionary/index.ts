// src/lib/dictionary/index.ts
// Central export for bilingual dictionaries (Arabic & English)

import { AR_DICTIONARY } from "./ar";
import { EN_DICTIONARY } from "./en";

// Relax string literal types to general string type so both Arabic and English dictionaries match
type DeepString<T> = {
  [K in keyof T]: T[K] extends string ? string : T[K] extends Record<string, unknown> ? DeepString<T[K]> : T[K];
};

export type Dictionary = DeepString<typeof AR_DICTIONARY>;
export type Locale = "ar" | "en";

export const dictionaries: Record<Locale, Dictionary> = {
  ar: AR_DICTIONARY as unknown as Dictionary,
  en: EN_DICTIONARY as unknown as Dictionary,
};

export { AR_DICTIONARY, EN_DICTIONARY };
