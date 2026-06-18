import { createContext, useContext } from "react";

export type Theme = "dark" | "light";
export type Lang = "fr" | "en" | "es";

export const LANG_META: Record<Lang, { label: string; flag: string }> = {
  fr: { label: "Français", flag: "FR" },
  en: { label: "English", flag: "EN" },
  es: { label: "Espanol", flag: "ES" },
};

export const LANGS: Lang[] = ["fr", "en", "es"];

interface PrefsCtx {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const PrefsContext = createContext<PrefsCtx>({
  theme: "dark",
  toggleTheme: () => {},
  lang: "fr",
  setLang: () => {},
});

export const usePrefs = () => useContext(PrefsContext);
