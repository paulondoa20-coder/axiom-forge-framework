import { ReactNode, useState, useEffect } from "react";
import { PrefsContext, type Theme, type Lang } from "@/lib/preferences";

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <PrefsContext.Provider value={{ theme, toggleTheme, lang, setLang }}>
      {children}
    </PrefsContext.Provider>
  );
}
