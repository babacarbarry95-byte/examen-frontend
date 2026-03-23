import { Link } from "react-router-dom";

const testimonials = [
  {
    name: "Mariama Goundiam",
    role: "Entrepreneuse, Dakar",
    quote:
      "Un séjour exceptionnel ! L'accueil chaleureux, les chambres impeccables et la vue sur l'océan depuis ma suite étaient tout simplement magiques. Je recommande FABY Hotel à tous ceux qui cherchent le luxe et l'authenticité sénégalaise.",
    rating: 5,
  },
  {
    name: "Jean-Pierre Moreau",
    role: "Voyageur d'affaires, Paris",
    quote:
      "J'ai séjourné dans de nombreux hôtels à travers le monde, mais FABY Hotel se distingue par son attention aux détails. Le room service est impeccable, le spa est un véritable havre de paix, et le restaurant propose une cuisine fusion qui ravit les papilles.",
    rating: 5,
  },
  {
    name: "Fatou Sow",
    role: "Blogueuse voyage, Abidjan",
    quote:
      "Chaque recoin de cet hôtel respire l'élégance. Le personnel est d'une gentillesse rare et anticipe toujours vos besoins. Mon moment préféré : le petit-déjeuner en terrasse avec une vue panoramique sur Dakar. Un pur bonheur !",
    rating: 5,
  },
  {
    name: "Moussa Ndiaye",
    role: "Architecte, Dakar",
    quote:
      "En tant qu'architecte, j'apprécie l'harmonie entre le design moderne et les touches traditionnelles sénégalaises de l'hôtel. Les espaces sont pensés pour allier confort et esthétique. FABY Hotel est une réussite sur tous les plans.",
    rating: 4,
  },
  {
    name: "Sarah Chen",
    role: "Touriste, Shanghai",
    quote:
      "Mon premier voyage en Afrique de l'Ouest et FABY Hotel a rendu cette expérience inoubliable. L'équipe de conciergerie m'a organisé des excursions incroyables. Je me suis sentie comme chez moi malgré les 10 000 km de distance !",
    rating: 5,
  },
  {
    name: "Omar Ba",
    role: "Médecin, Saint-Louis",
    quote:
      "Nous avons célébré notre anniversaire de mariage à FABY Hotel et tout était parfait. La suite nuptiale, le dîner aux chandelles organisé par le chef, et les pétales de roses... Un moment gravé dans nos mémoires pour toujours.",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${
            i < count
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
          }`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Temoignages() {
  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 shadow-lg shadow-black/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-300"
          >
            FABY Hotel
          </Link>
          <Link
            to="/"
            className="btn btn-primary text-sm"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-300 font-semibold">
            Ce que disent nos clients
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100">
            Témoignages
          </h1>
          <div className="mt-2 h-1 w-20 rounded-full bg-emerald-500" />
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
            La satisfaction de nos clients est notre plus belle récompense. Découvrez les
            expériences partagées par ceux qui ont choisi FABY Hotel pour leurs séjours.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="group rounded-2xl border border-slate-200/60 bg-white/95 p-6 shadow-sm backdrop-blur transition hover:shadow-md hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900/80"
            >
              <Stars count={t.rating} />
              <blockquote className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{t.quote}"
              </blockquote>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm dark:bg-emerald-500/20 dark:text-emerald-300">
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-14 rounded-2xl bg-slate-900 text-white p-8 text-center dark:bg-slate-900">
          <h2 className="text-2xl font-semibold mb-3">
            Rejoignez nos clients satisfaits
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-6">
            Plus de 15 000 clients nous ont fait confiance depuis notre ouverture. 
            Réservez votre séjour et vivez l'expérience FABY Hotel.
          </p>
          <Link
            to="/"
            className="btn btn-primary"
          >
            Réserver maintenant
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-white/10 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        © 2026 FABY Hotel. Tous droits réservés.
      </div>
    </div>
  );
}
