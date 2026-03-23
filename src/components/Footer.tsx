import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80 py-10 text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
      <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-5">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-600 font-semibold dark:text-emerald-300">
            FABY Hotel
          </p>
          <p className="text-sm">
            Un service premium, des espaces élégants et une expérience pensée pour vous.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-slate-900 dark:text-white">Contact</p>
          <p>contact@bafyhotel.com</p>
          <p>+221 78 114 92 51</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-slate-900 dark:text-white">Adresse</p>
          <p>Almadies, Dakar</p>
          <p>Ouvert 24/7</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-slate-900 dark:text-white">Liens utiles</p>
          <Link
            to="/a-propos"
            className="block transition hover:text-emerald-600 dark:hover:text-emerald-300"
          >
            À propos
          </Link>
          <Link
            to="/temoignages"
            className="block transition hover:text-emerald-600 dark:hover:text-emerald-300"
          >
            Témoignages
          </Link>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-slate-900 dark:text-white">Réseaux sociaux</p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-white/10 dark:text-slate-200 dark:hover:text-emerald-300"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                <path d="M13.5 9H16l-.5 3H13.5v8h-3v-8H8V9h2.5V7.7c0-2.4 1.4-3.7 3.5-3.7H16v3h-1.2c-.9 0-1.3.4-1.3 1.2V9z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-white/10 dark:text-slate-200 dark:hover:text-emerald-300"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.5A4.5 4.5 0 1 1 7.5 13 4.5 4.5 0 0 1 12 8.5zm0 2A2.5 2.5 0 1 0 14.5 13 2.5 2.5 0 0 0 12 10.5zm5-3.1a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-white/10 dark:text-slate-200 dark:hover:text-emerald-300"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.1a4.2 4.2 0 0 1 3.8-2c4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        © 2026 FABY Hotel. Tous droits réservés.
      </div>
    </footer>
  );
}
