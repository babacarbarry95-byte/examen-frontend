import { useTheme } from "../theme/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-lg backdrop-blur transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-900"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
          <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.49 10.49l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM12 4V1h-2v3h2zm0 19v-3h-2v3h2zm8-11h3v-2h-3v2zM4 12H1v-2h3v2zm13.66-7.66l-1.42-1.42-1.79 1.8 1.41 1.41 1.8-1.79zM6.76 19.16l-1.42 1.42-1.79-1.8 1.41-1.41 1.8 1.79zM11 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
          <path d="M21 14.5A7.5 7.5 0 0 1 9.5 3a.75.75 0 0 0-.86.86A9 9 0 1 0 20.14 15.36a.75.75 0 0 0 .86-.86z" />
        </svg>
      )}
    </button>
  );
}
