import { useEffect, useMemo, useState } from "react";
import { ThemeContext, type ThemeMode } from "./ThemeContext";

type ThemeProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

const DEFAULT_STORAGE_KEY = "theme";

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

function getInitialTheme(storageKey: string): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(storageKey);
  if (stored === "dark" || stored === "light") return stored;
  return getSystemTheme();
}

function applyThemeToDom(theme: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children, storageKey = DEFAULT_STORAGE_KEY }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme(storageKey));

  useEffect(() => {
    applyThemeToDom(theme);
    window.localStorage.setItem(storageKey, theme);
  }, [storageKey, theme]);

  const value = useMemo(() => {
    return {
      theme,
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

