type Room = {
    id: number;
    dispo: number;
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
        description: "Télévision,climatiseur,wifi,sale de bain",
        image: roomImages.chambre1,
    },
    {
        id: 2,
        dispo: 4,
        description: "Télévision,climatiseur,wifi,sale de bain",
        image: roomImages.chambre2,
    },
    {
        id: 3,
        dispo: 4,
        description: "Télévision, climatisateur, wifi, sale de bain",
        image: roomImages.chambre6,
    },
    {
        id: 4,
        dispo: 5,
        description: "Télévision, climatisateur, wifi, sale de bain",
        image: roomImages.chambre8,
    },
    {
        id: 5,
        dispo: 6,
        description: "Télévision, climatisateur, wifi, sale de bain",
        image: roomImages.chambre7,
    },
    {
        id: 6,
        dispo: 6,
        description: "Télévision, climatisateur, wifi, sale de bain",
        image: roomImages.chambre5,
    },
];

type ChambresProps = {
    onReserve?: () => void;
};

export default function Chambres({ onReserve = () => {} }: ChambresProps) {
    return (
        <section
            id="rooms"
            className="section-anchor py-20 text-slate-100 transition-colors"
        >
            <div className="max-w-6xl mx-auto px-6">
                <h3 className="text-2xl font-bold text-center mb-10">Nos Chambres</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white rounded-lg border border-slate-200 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 dark:border-slate-800"
                        >
                            <img src={room.image} alt="Chambre" className="w-full h-48 object-cover" />

                            <div className="p-4">
                <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded">
                  {room.dispo} chambres dispo
                </span>

                                <p className="mt-2 text-slate-600 text-sm dark:text-slate-300">
                                    {room.description}
                                </p>

                                <button onClick={onReserve} className="btn btn-primary w-full mt-4">
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

