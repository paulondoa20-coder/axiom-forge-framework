import { createContext, useContext } from "react";
import type { Theme, Lang } from "../entities/Preferences";

export interface PrefsCtx {
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
