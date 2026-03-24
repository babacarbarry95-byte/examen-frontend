import { formatCfa, OFFER_PRICE_CFA } from "../lib/pricing";

const offers = [
  {
    title: "Escapade romantique",
    description: "Suite avec vue, dîner aux chandelles et accueil sur mesure. ",
    image: new URL("../assets/couple.jpg", import.meta.url).href,
    tag: "Week-end",
    priceCfa: OFFER_PRICE_CFA["Escapade romantique"],
  },
  {
    title: "Séjour business",
    description: "Chambre executive, salle de réunion et petit-déjeuner express.",
    image: new URL("../assets/business.jpg", import.meta.url).href,
    tag: "Business",
    priceCfa: OFFER_PRICE_CFA["Séjour business"],
  },
  {
    title: "Pack famille",
    description: "Deux chambres communicantes, activités enfants et espace lounge.",
    image: new URL("../assets/packFamille.jpg", import.meta.url).href,
    tag: "Famille",
    priceCfa: OFFER_PRICE_CFA["Pack famille"],
  },
  {
    title: "Suite prestige",
    description: "Espace salon privé, service dédié et attentions exclusives.",
    image: new URL("../assets/chambre3.jpg", import.meta.url).href,
    tag: "Luxe",
    priceCfa: OFFER_PRICE_CFA["Suite prestige"],
  },
];

type OffresProps = {
  onReserve: (offer: { title: string; priceCfa: number }) => void;
};

export default function Offres({ onReserve }: OffresProps) {
  return (
    <section id="offre" className="section-anchor py-24 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col gap-3 text-center mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-600 font-semibold dark:text-emerald-300">
            Nos offres
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white">
            Des expériences pensées pour chaque séjour
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto dark:text-slate-300">
            Sélectionnez l’offre qui correspond à votre rythme : business, détente
            ou moments en famille, avec un niveau de service premium.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {offers.map((offer) => (
            <article
              key={offer.title}
              
              className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/20 dark:border-white/10 dark:bg-slate-900"
            >
              <div className="relative h-56">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/90 text-slate-900 text-xs font-semibold px-3 py-1 rounded-full dark:bg-slate-900/90 dark:text-slate-100">
                  {offer.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 dark:text-slate-100">
                  {offer.title}
                </h3>
                <p className="text-slate-600 text-sm dark:text-slate-300">{offer.description}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatCfa(offer.priceCfa)}
                    <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">/ nuit</span>
                  </p>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Offre pack
                  </span>
                </div>
                <button
                  onClick={() => onReserve({ title: offer.title, priceCfa: offer.priceCfa })}
                  className="btn btn-primary mt-4 w-full"
                >
                  Réserver
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
