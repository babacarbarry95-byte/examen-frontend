import { Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";

export default function ThemeExample() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300 font-semibold">
              Exemple
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              Page Thémée
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Thème actuel: <span className="font-semibold">{theme}</span>
            </p>
          </div>
          <Link to="/" className="btn btn-primary text-sm">
            ← Accueil
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Carte</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Les classes <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/10">dark:</code>{" "}
              s’activent automatiquement quand <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/10">.dark</code>{" "}
              est présent sur <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/10">&lt;html&gt;</code>.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Actions</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary" onClick={() => setTheme("light")}>
                Forcer clair
              </button>
              <button
                type="button"
                className="btn border border-slate-200 bg-white/90 text-slate-700 hover:bg-white dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
                onClick={() => setTheme("dark")}
              >
                Forcer sombre
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Le choix est sauvegardé dans <code>localStorage</code> et persiste après rechargement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

