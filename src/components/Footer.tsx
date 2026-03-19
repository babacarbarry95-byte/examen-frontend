export default function Footer() {
  return (
    <footer className="bg-white text-slate-700 transition-colors dark:bg-slate-900 dark:text-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3 dark:text-white">
            Paradise View
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Un hôtel d'exception pensé pour le confort, la détente et les moments
            inoubliables.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="#"
              aria-label="Facebook"
              className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-slate-700 dark:fill-white"
                aria-hidden="true"
              >
                <path d="M13 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h2v5h3v-5h3l1-3h-4v-2c0-.6.4-1 1-1z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-slate-700 dark:fill-white"
                aria-hidden="true"
              >
                <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.5A4.5 4.5 0 1 1 7.5 13 4.5 4.5 0 0 1 12 8.5zm0 2A2.5 2.5 0 1 0 14.5 13 2.5 2.5 0 0 0 12 10.5zm6.2-3.7a1 1 0 1 1-1.4 1.4 1 1 0 0 1 1.4-1.4z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-slate-700 dark:fill-white"
                aria-hidden="true"
              >
                <path d="M6.94 8.5H4.3V19h2.64V8.5zM5.62 4a1.54 1.54 0 1 0 0 3.08A1.54 1.54 0 0 0 5.62 4zM20 13.1c0-2.6-1.38-3.8-3.22-3.8-1.49 0-2.16.82-2.53 1.4V8.5h-2.64c.03.6 0 10.5 0 10.5h2.64v-5.86c0-.31.02-.62.11-.84.24-.62.78-1.26 1.7-1.26 1.2 0 1.68.95 1.68 2.33V19H20z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-slate-400 mb-3 dark:text-slate-400">
            Contact
          </h4>
          <p className="text-sm">Email : contact@paradiseview.com</p>
          <p className="text-sm">Téléphone : +221 33 123 45 67</p>
          <p className="text-sm">Adresse : Avenue des Almadies, Dakar</p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-slate-400 mb-3 dark:text-slate-400">
            Liens rapides
          </h4>
          <ul className="text-sm space-y-2">
            <li>
              <a className="hover:text-slate-900 dark:hover:text-white" href="#home">
                Accueil
              </a>
            </li>
            <li>
              <a className="hover:text-slate-900 dark:hover:text-white" href="#rooms">
                Chambres
              </a>
            </li>
            <li>
              <a className="hover:text-slate-900 dark:hover:text-white" href="#offre">
                Nos offres
              </a>
            </li>
            <li>
              <a className="hover:text-slate-900 dark:hover:text-white" href="#loisirs">
                Loisirs
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                Newsletter
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Recevez nos offres exclusives et nouveautés directement par email.
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="input-field-dark flex-1 md:w-64"
              />
              <button type="submit" className="btn btn-primary">
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-slate-500 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
          <span>2026 Paradise View. Tous droits réservés.</span>
          <span>Politique de confidentialité · Conditions d'utilisation</span>
        </div>
      </div>
    </footer>
  );
}