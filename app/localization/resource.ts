import english from "../../resources/locales/en/common.json"
import arabic from "../../resources/locales/ar/common.json";

const languages = ["en", "ar"] as const;
export const supportedLanguages = [...languages];
export type Language = (typeof languages)[number];

export type Resource = {
  common: typeof english;
};

export const resources: Record<Language, Resource> = {
  en: {
    common: english,
  },
  ar: {
    common: arabic,
  },
};

export const returnLanguageIfSupported = (
  lang?: string
): Language | undefined => {
  if (supportedLanguages.includes(lang as Language)) {
    return lang as Language;
  }
  return undefined;
};