const leisureItems = [
  {
    title: "Salle de sport premium",
    description:
      "Équipements haut de gamme, coaching sur demande et espace musculation complet.",
    image: new URL("../assets/imagesport.jpg", import.meta.url).href,
    tag: "Fitness",
  },
  {
    title: "Restaurant gastronomique",
    description:
      "Cuisine locale et internationale, menus signature et service en salle élégant.",
    image: new URL("../assets/resto.jpg", import.meta.url).href,
    tag: "Gastronomie",
  },
  {
    title: "Spa & bien-être",
    description:
      "Massages, soins relaxants et espaces de détente pour un séjour apaisant.",
    image: new URL("../assets/massage.jpg", import.meta.url).href,
    tag: "Bien-être",
  },
  {
    title: "Piscine & lounge",
    description:
      "Piscine extérieure, transats confortables et bar lounge en soirée.",
    image: new URL("../assets/piscine.jpg", import.meta.url).href,
    tag: "Détente",
  },
];

export default function Loisirs() {
  return (
    <section
      id="loisirs"
      className="section-anchor py-20 bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col gap-3 text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-emerald-600 font-semibold dark:text-emerald-400">
            Loisirs
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Des loisirs dignes d'un hôtel professionnel
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto dark:text-slate-300">
            Profitez d'espaces pensés pour votre bien-être, votre forme et votre plaisir,
            avec un service haut de gamme à chaque instant.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {leisureItems.map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="relative h-52">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/90 text-slate-900 text-xs font-semibold px-3 py-1 rounded-full dark:bg-slate-900/90 dark:text-slate-100">
                  {item.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
