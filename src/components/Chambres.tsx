type Room = {
  id: number;
  dispo: number;
  type: "Standard" | "Deluxe" | "Suite";
  priceCfa: number;
  description: string;
  image: string;
};

const roomImages = {
  chambre1: new URL("../assets/chambre1.jpg", import.meta.url).href,
  chambre2: new URL("../assets/chambre2.jpg", import.meta.url).href,
  chambre6: new URL("../assets/chambre6.jpg", import.meta.url).href,
  chambre5: new URL("../assets/chambre5.jpg", import.meta.url).href,
  chambre7: new URL("../assets/chambre7.jpg", import.meta.url).href,
  chambre8: new URL("../assets/chambre8.jpg", import.meta.url).href,
};

const rooms: Room[] = [
  {
    id: 1,
    dispo: 2,
    type: "Standard",
    priceCfa: 25000,
    description: "Télévision, climatiseur, wifi, salle de bain",
    image: roomImages.chambre1,
  },
  {
    id: 2,
    dispo: 4,
    type: "Standard",
    priceCfa: 25000,
    description: "Télévision, climatiseur, wifi, salle de bain",
    image: roomImages.chambre2,
  },
  {
    id: 3,
    dispo: 4,
    type: "Deluxe",
    priceCfa: 40000,
    description: "Télévision, climatiseur, wifi, salle de bain",
    image: roomImages.chambre6,
  },
  {
    id: 4,
    dispo: 5,
    type: "Deluxe",
    priceCfa: 40000,
    description: "Télévision, climatiseur, wifi, salle de bain",
    image: roomImages.chambre8,
  },
  {
    id: 5,
    dispo: 6,
    type: "Suite",
    priceCfa: 65000,
    description: "Télévision, climatiseur, wifi, salle de bain",
    image: roomImages.chambre7,
  },
  {
    id: 6,
    dispo: 6,
    type: "Suite",
    priceCfa: 65000,
    description: "Télévision, climatiseur, wifi, salle de bain",
    image: roomImages.chambre5,
  },
];

type ChambresProps = {
  onReserve: (selection: { roomType: Room["type"]; priceCfa: number }) => void;
};

export default function Chambres({ onReserve }: ChambresProps) {
  const formatCfa = (amount: number) => `${amount.toLocaleString("fr-FR")} CFA`;

  return (
    <section
      id="rooms"
      className="section-anchor py-24 text-slate-900 dark:text-slate-100"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl sm:text-4xl font-semibold text-center mb-10 text-slate-900 dark:text-white">
          Nos Chambres
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/20 dark:bg-slate-900 dark:border-white/10"
            >
              <img src={room.image} alt="Chambre" className="w-full h-48 object-cover" />

              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded">
                    {room.dispo} chambres dispo
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
                    {room.type}
                  </span>
                </div>

                <p className="mt-2 text-slate-600 text-sm dark:text-slate-300">
                  {room.description}
                </p>

                <p className="mt-3 flex items-baseline justify-between gap-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <span>{formatCfa(room.priceCfa)}</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/ nuit</span>
                </p>

                <button
                  onClick={() => onReserve({ roomType: room.type, priceCfa: room.priceCfa })}
                  className="btn btn-primary w-full mt-4"
                >
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



