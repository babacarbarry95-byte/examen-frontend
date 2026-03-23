import { Link } from "react-router-dom";

export default function APropos() {
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
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-400/5 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-300 font-semibold">
            Découvrez notre histoire
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100">
            À propos de FABY Hotel
          </h1>
          <div className="mt-2 h-1 w-20 rounded-full bg-emerald-500" />
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 pb-20 space-y-12">
        {/* Notre Histoire */}
        <article className="rounded-2xl border border-slate-200/60 bg-white/95 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Notre Histoire
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Fondé en 2010 au cœur de Dakar, FABY Hotel est né de la vision d'offrir une expérience
            hôtelière d'exception alliant le charme de l'hospitalité sénégalaise à un standard
            international cinq étoiles. Ce qui a commencé comme un petit établissement familial
            s'est transformé en l'une des adresses les plus prisées de la capitale.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Au fil des années, nous avons accueilli des milliers de visiteurs venus du monde entier,
            chacun repartant avec des souvenirs inoubliables. Notre engagement envers l'excellence
            nous a permis de remporter plusieurs distinctions, dont le prix du meilleur hôtel
            d'Afrique de l'Ouest en 2023 et 2025.
          </p>
        </article>

        {/* Notre Mission */}
        <article className="rounded-2xl border border-slate-200/60 bg-white/95 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Notre Mission
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Chez FABY Hotel, notre mission est de créer un havre de paix où chaque client se sent
            chez lui tout en bénéficiant d'un service de luxe personnalisé. Nous croyons que
            l'hospitalité va bien au-delà d'un simple hébergement — c'est un art de vivre que
            nous cultivons chaque jour.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Nous nous engageons à offrir des espaces élégants, une cuisine raffinée mettant en
            valeur les saveurs locales et internationales, ainsi qu'un éventail d'activités de
            loisirs pour rendre chaque séjour mémorable. Notre équipe dévouée est formée pour
            anticiper vos besoins et dépasser vos attentes.
          </p>
        </article>

        {/* Nos Valeurs */}
        <article className="rounded-2xl border border-slate-200/60 bg-white/95 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Nos Valeurs
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Excellence",
                desc: "Nous visons la perfection dans chaque détail — de la décoration intérieure au sourire à l'accueil.",
              },
              {
                title: "Hospitalité",
                desc: "La Teranga sénégalaise est au cœur de notre ADN. Chaque invité est traité comme un membre de la famille.",
              },
              {
                title: "Innovation",
                desc: "Nous adoptons les dernières technologies pour simplifier l'expérience client tout en préservant une touche humaine.",
              },
              {
                title: "Durabilité",
                desc: "Engagés dans une démarche éco-responsable, nous réduisons notre empreinte carbone et soutenons les communautés locales.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/5"
              >
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* Notre Équipe */}
        <article className="rounded-2xl border border-slate-200/60 bg-white/95 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Notre Équipe
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            FABY Hotel s'appuie sur une équipe de plus de 200 professionnels passionnés par
            l'hôtellerie. De nos chefs cuisiniers primés à nos concierges multilingues, chaque
            membre de l'équipe est sélectionné pour son expertise et sa passion du service.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Notre directeur général, avec plus de 20 ans d'expérience dans l'hôtellerie de luxe
            internationale, veille personnellement à ce que chaque séjour soit à la hauteur de
            nos promesses. Nous investissons continuellement dans la formation de notre personnel
            pour garantir un service irréprochable.
          </p>
        </article>
      </section>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-white/10 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        © 2026 FABY Hotel. Tous droits réservés.
      </div>
    </div>
  );
}
