import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Reservation = {
  id: number;
  name: string;
  email: string;
  city: string;
  roomType: string;
  guests: number;
  startDate: string;
  endDate: string;
  duration: number;
  status: "confirmée" | "terminée" | "annulée";
  offer?: string;
};

function getReservations(): Reservation[] {
  try {
    return JSON.parse(localStorage.getItem("faby_reservations") || "[]");
  } catch {
    return [];
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    setReservations(getReservations());
  }, []);

  const handleDelete = (id: number) => {
    const updated = reservations.filter((r) => r.id !== id);
    setReservations(updated);
    localStorage.setItem("faby_reservations", JSON.stringify(updated));
  };

  const handleCancelToggle = (id: number) => {
    const updated = reservations.map((r) => {
      if (r.id !== id) return r;
      return {
        ...r,
        status: (r.status === "annulée" ? "confirmée" : "annulée") as Reservation["status"],
      };
    });
    setReservations(updated);
    localStorage.setItem("faby_reservations", JSON.stringify(updated));
  };

  const confirmed = reservations.filter((r) => r.status === "confirmée");
  const cancelled = reservations.filter((r) => r.status === "annulée");
  const totalNights = reservations.reduce((sum, r) => sum + r.duration, 0);

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

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300 font-semibold">
              Tableau de bord
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Vos réservations
            </h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total réservations</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{reservations.length}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-300">Confirmées</p>
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{confirmed.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total nuitées</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalNights}</p>
          </div>
        </div>

        {/* Empty state */}
        {reservations.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <svg viewBox="0 0 24 24" className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
              Aucune réservation
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Vous n'avez pas encore de réservation. Rendez-vous sur la page d'accueil pour réserver.
            </p>
            <Link to="/" className="btn btn-primary mt-6 inline-flex">
              Réserver maintenant
            </Link>
          </div>
        )}

        {/* Reservations list */}
        {reservations.length > 0 && (
          <div className="space-y-6">
            {/* Confirmed */}
            {confirmed.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Réservations confirmées
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold dark:bg-emerald-500/20 dark:text-emerald-200">
                    {confirmed.length}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {confirmed.map((r) => (
                    <ReservationCard key={r.id} reservation={r} onDelete={handleDelete} onCancelToggle={handleCancelToggle} />
                  ))}
                </div>
              </section>
            )}

            {/* Cancelled */}
            {cancelled.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Réservations annulées
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700 font-semibold dark:bg-rose-500/20 dark:text-rose-200">
                    {cancelled.length}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {cancelled.map((r) => (
                    <ReservationCard key={r.id} reservation={r} onDelete={handleDelete} onCancelToggle={handleCancelToggle} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ReservationCard({
  reservation: r,
  onDelete,
  onCancelToggle,
}: {
  reservation: Reservation;
  onDelete: (id: number) => void;
  onCancelToggle: (id: number) => void;
}) {
  const borderColor =
    r.status === "confirmée"
      ? "border-emerald-100 dark:border-emerald-500/20"
      : "border-rose-100 dark:border-rose-500/20";

  const statusBadge =
    r.status === "confirmée"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200"
      : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200";

  return (
    <div className={`bg-white border ${borderColor} shadow-sm p-5 rounded-2xl transition-shadow hover:shadow-md dark:bg-slate-900`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {r.city} — {r.roomType}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge}`}>
          {r.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Client</p>
          <p className="font-medium text-slate-800 dark:text-slate-200">{r.name}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
          <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{r.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Dates</p>
          <p className="font-medium text-slate-800 dark:text-slate-200">
            {formatDate(r.startDate)} → {formatDate(r.endDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Durée</p>
          <p className="font-medium text-slate-800 dark:text-slate-200">{r.duration} nuit(s)</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Personnes</p>
          <p className="font-medium text-slate-800 dark:text-slate-200">{r.guests}</p>
        </div>
        {r.offer && (
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Offre</p>
            <p className="font-medium text-emerald-700 dark:text-emerald-300">{r.offer}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => onCancelToggle(r.id)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
            r.status === "confirmée"
              ? "border border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/10"
              : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
          }`}
        >
          {r.status === "confirmée" ? "Annuler" : "Réactiver"}
        </button>
        <button
          type="button"
          onClick={() => onDelete(r.id)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-rose-200 text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
