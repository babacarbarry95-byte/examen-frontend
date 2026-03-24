import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatCfa, getOfferPriceCfa, getRoomPriceCfa } from "../lib/pricing";

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
  unitPriceCfa?: number;
  totalPriceCfa?: number;
  priceSource?: "offre" | "chambre";
};

function getReservations(): Reservation[] {
  try {
    const parsed = JSON.parse(localStorage.getItem("faby_reservations") || "[]") as Reservation[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }

    // Demo seed: 3 finished reservations (only when there is no data yet).
    const seeded: Reservation[] = [
      {
        id: Date.now() - 1000 * 60 * 60 * 24 * 12,
        name: "Awa Ndiaye",
        email: "awa.ndiaye@example.com",
        city: "Dakar",
        roomType: "Deluxe",
        guests: 2,
        startDate: "2026-03-10",
        endDate: "2026-03-13",
        duration: 3,
        status: "terminée",
        unitPriceCfa: getRoomPriceCfa("Deluxe"),
        totalPriceCfa: getRoomPriceCfa("Deluxe") * 3,
        priceSource: "chambre",
      },
      {
        id: Date.now() - 1000 * 60 * 60 * 24 * 9,
        name: "Mamadou Diop",
        email: "mamadou.diop@example.com",
        city: "Saly",
        roomType: "Suite",
        guests: 3,
        startDate: "2026-03-14",
        endDate: "2026-03-16",
        duration: 2,
        status: "terminée",
        offer: "Escapade romantique",
        unitPriceCfa: getOfferPriceCfa("Escapade romantique"),
        totalPriceCfa: getOfferPriceCfa("Escapade romantique") * 2,
        priceSource: "offre",
      },
      {
        id: Date.now() - 1000 * 60 * 60 * 24 * 6,
        name: "Fatou Sow",
        email: "fatou.sow@example.com",
        city: "Saint-Louis",
        roomType: "Standard",
        guests: 1,
        startDate: "2026-03-18",
        endDate: "2026-03-21",
        duration: 3,
        status: "terminée",
        offer: "Séjour business",
        unitPriceCfa: getOfferPriceCfa("Séjour business"),
        totalPriceCfa: getOfferPriceCfa("Séjour business") * 3,
        priceSource: "offre",
      },
    ];

    localStorage.setItem("faby_reservations", JSON.stringify(seeded));
    return seeded;
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

function getReservationPricing(reservation: Reservation) {
  const offerUnit = reservation.offer ? getOfferPriceCfa(reservation.offer) : 0;
  const roomUnit = getRoomPriceCfa(reservation.roomType);
  const inferredUnit = reservation.unitPriceCfa ?? (offerUnit || roomUnit);

  const inferredTotal = reservation.totalPriceCfa ?? inferredUnit * reservation.duration;
  const inferredSource =
    reservation.priceSource ?? (reservation.offer ? ("offre" as const) : ("chambre" as const));

  return {
    unitPriceCfa: inferredUnit,
    totalPriceCfa: inferredTotal,
    priceSource: inferredSource,
  };
}

function buildCounts(values: Array<string | undefined | null>) {
  const map: Record<string, number> = {};
  for (const value of values) {
    const key = (value ?? "").trim();
    if (!key) continue;
    map[key] = (map[key] ?? 0) + 1;
  }
  return map;
}

function toSortedItems(map: Record<string, number>, maxItems?: number) {
  const items = Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "fr-FR"));
  return typeof maxItems === "number" ? items.slice(0, maxItems) : items;
}

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function DonutChart({
  items,
  total,
  centerLabel,
}: {
  items: Array<{ label: string; value: number; color: string }>;
  total: number;
  centerLabel: string;
}) {
  const radius = 16;
  const stroke = 6;
  const cx = 20;
  const cy = 20;
  const circumference = 2 * Math.PI * radius;
  const visibleItems = items.filter((item) => item.value > 0);
  const dashList = visibleItems.map((item) => (item.value / Math.max(1, total)) * circumference);

  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 40 40" className="h-full w-full" role="img" aria-label={centerLabel}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-200 dark:text-slate-800"
        />

        {visibleItems.map((item, index) => {
          const dash = dashList[index] ?? 0;
          const offset = dashList.slice(0, index).reduce((sum, value) => sum + value, 0);
          return (
            <circle
              key={item.label}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{total}</p>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{centerLabel}</p>
        </div>
      </div>
    </div>
  );
}

function BarList({
  items,
  total,
  colors,
  valueSuffix,
}: {
  items: Array<{ label: string; value: number; hint?: string }>;
  total: number;
  colors: string[];
  valueSuffix?: string;
}) {
  if (total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Aucune donnée pour afficher une répartition.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const percentage = pct(item.value, total);
        const color = colors[index % colors.length];
        return (
          <div key={item.label}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{item.label}</p>
                {item.hint ? (
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{item.hint}</p>
                ) : null}
              </div>
              <p className="shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {item.value}
                {valueSuffix ?? ""} · {percentage}%
              </p>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-2 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const [reservations, setReservations] = useState<Reservation[]>(() => getReservations());

  const handleDelete = (id: number) => {
    const updated = reservations.filter((r) => r.id !== id);
    setReservations(updated);
    localStorage.setItem("faby_reservations", JSON.stringify(updated));
  };

  const handleCancelToggle = (id: number) => {
    const updated = reservations.map((r) => {
      if (r.id !== id) return r;
      if (r.status === "terminée") return r;
      return {
        ...r,
        status: (r.status === "annulée" ? "confirmée" : "annulée") as Reservation["status"],
      };
    });
    setReservations(updated);
    localStorage.setItem("faby_reservations", JSON.stringify(updated));
  };

  const handleMarkFinished = (id: number) => {
    const updated = reservations.map((r) => {
      if (r.id !== id) return r;
      if (r.status !== "confirmée") return r;
      return {
        ...r,
        status: "terminée" as const,
      };
    });
    setReservations(updated);
    localStorage.setItem("faby_reservations", JSON.stringify(updated));
  };

  const handleReopen = (id: number) => {
    const updated = reservations.map((r) => {
      if (r.id !== id) return r;
      if (r.status !== "terminée") return r;
      return {
        ...r,
        status: "confirmée" as const,
      };
    });
    setReservations(updated);
    localStorage.setItem("faby_reservations", JSON.stringify(updated));
  };

  const confirmed = reservations.filter((r) => r.status === "confirmée");
  const cancelled = reservations.filter((r) => r.status === "annulée");
  const finished = reservations.filter((r) => r.status === "terminée");
  const totalNights = reservations.reduce((sum, r) => sum + r.duration, 0);
  const totalGuests = reservations.reduce((sum, r) => sum + r.guests, 0);
  const revenueReservations = reservations.filter((r) => r.status !== "annulée");
  const hotelRevenueCfa = revenueReservations.reduce(
    (sum, r) => sum + getReservationPricing(r).totalPriceCfa,
    0,
  );

  const statusItems = useMemo(() => {
    const counts = buildCounts(reservations.map((r) => r.status));
    return [
      { label: "Confirmées", value: counts["confirmée"] ?? 0, color: "#10b981" },
      { label: "Annulées", value: counts["annulée"] ?? 0, color: "#fb7185" },
      { label: "Terminées", value: counts["terminée"] ?? 0, color: "#94a3b8" },
    ];
  }, [reservations]);

  const roomTypeItems = useMemo(() => {
    const counts = buildCounts(reservations.map((r) => r.roomType));
    const nightsByType: Record<string, number> = {};
    const revenueByType: Record<string, number> = {};
    for (const r of reservations) {
      nightsByType[r.roomType] = (nightsByType[r.roomType] ?? 0) + r.duration;
      if (r.status !== "annulée") {
        revenueByType[r.roomType] = (revenueByType[r.roomType] ?? 0) + getReservationPricing(r).totalPriceCfa;
      }
    }
    return toSortedItems(counts).map((it) => ({
      ...it,
      hint: `${nightsByType[it.label] ?? 0} nuit(s) · ${formatCfa(revenueByType[it.label] ?? 0)}`,
    }));
  }, [reservations]);

  const cityItems = useMemo(() => {
    const counts = buildCounts(reservations.map((r) => r.city));
    return toSortedItems(counts, 6);
  }, [reservations]);

  const offerStats = useMemo(() => {
    const counts = buildCounts(reservations.map((r) => r.offer));
    const items = toSortedItems(counts, 6);
    const total = items.reduce((sum, item) => sum + item.value, 0);
    return { items, total };
  }, [reservations]);

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
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
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-300">Revenu hôtel</p>
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{formatCfa(hotelRevenueCfa)}</p>
            <p className="mt-2 text-xs text-emerald-700/80 dark:text-emerald-200/80">
              Hors réservations annulées
            </p>
          </div>
        </div>

        {/* Analytics */}
        <section className="mb-10">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 font-semibold">
                Statistiques
              </p>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Répartitions & tendances rapides
              </h2>
            </div>
            {reservations.length > 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Moyenne: {Math.round(totalNights / reservations.length)} nuit(s) · {Math.round(totalGuests / reservations.length)} pers. ·{" "}
                {formatCfa(Math.round(hotelRevenueCfa / Math.max(1, revenueReservations.length)))}
              </p>
            ) : null}
          </div>

          {reservations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ajoutez une première réservation pour afficher les diagrammes de répartition.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Statut des réservations</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Diagramme en anneau</p>
                  </div>
                  <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                    <p>Annulées: {cancelled.length}</p>
                    <p>Terminées: {finished.length}</p>
                  </div>
                </div>

                <DonutChart items={statusItems} total={reservations.length} centerLabel="Réservations" />

                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  {statusItems.map((item) => (
                    <div key={item.label} className="rounded-xl border border-slate-200/60 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
                      <div className="mx-auto mb-2 h-2 w-10 rounded-full" style={{ backgroundColor: item.color }} />
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{item.label}</p>
                      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Répartition par type de chambre</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Barres de progression</p>
                <div className="mt-5">
                  <BarList
                    items={roomTypeItems}
                    total={reservations.length}
                    colors={["#10b981", "#34d399", "#60a5fa", "#a78bfa"]}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Répartition par ville</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Top 6</p>
                  <div className="mt-5">
                    <BarList items={cityItems} total={reservations.length} colors={["#0ea5e9", "#22c55e", "#f59e0b", "#fb7185", "#a78bfa", "#94a3b8"]} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Répartition par offre</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Uniquement si une offre a été choisie</p>
                  <div className="mt-5">
                    {offerStats.items.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                        Aucune offre enregistrée pour le moment.
                      </div>
                    ) : (
                      <BarList
                        items={offerStats.items}
                        total={offerStats.total}
                        colors={["#10b981", "#60a5fa", "#f59e0b", "#fb7185", "#a78bfa", "#94a3b8"]}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

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
                    <ReservationCard
                      key={r.id}
                      reservation={r}
                      onDelete={handleDelete}
                      onCancelToggle={handleCancelToggle}
                      onMarkFinished={handleMarkFinished}
                      onReopen={handleReopen}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Finished */}
            {finished.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Réservations terminées
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold dark:bg-white/10 dark:text-slate-200">
                    {finished.length}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {finished.map((r) => (
                    <ReservationCard
                      key={r.id}
                      reservation={r}
                      onDelete={handleDelete}
                      onCancelToggle={handleCancelToggle}
                      onMarkFinished={handleMarkFinished}
                      onReopen={handleReopen}
                    />
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
                    <ReservationCard
                      key={r.id}
                      reservation={r}
                      onDelete={handleDelete}
                      onCancelToggle={handleCancelToggle}
                      onMarkFinished={handleMarkFinished}
                      onReopen={handleReopen}
                    />
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
  onMarkFinished,
  onReopen,
}: {
  reservation: Reservation;
  onDelete: (id: number) => void;
  onCancelToggle: (id: number) => void;
  onMarkFinished: (id: number) => void;
  onReopen: (id: number) => void;
}) {
  const borderColor =
    r.status === "confirmée"
      ? "border-emerald-100 dark:border-emerald-500/20"
      : r.status === "terminée"
      ? "border-slate-200 dark:border-slate-700"
      : "border-rose-100 dark:border-rose-500/20";

  const statusBadge =
    r.status === "confirmée"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200"
      : r.status === "terminée"
      ? "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"
      : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200";

  const pricing = getReservationPricing(r);

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
          <p className="text-xs text-slate-500 dark:text-slate-400">Tarif</p>
          <p className="font-medium text-slate-800 dark:text-slate-200">
            {formatCfa(pricing.unitPriceCfa)} <span className="text-xs text-slate-500 dark:text-slate-400">/ nuit</span>
          </p>
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Total: {formatCfa(pricing.totalPriceCfa)}
          </p>
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

      <div className="flex flex-wrap gap-2 mt-4">
        {r.status === "confirmée" ? (
          <>
            <button
              type="button"
              onClick={() => onCancelToggle(r.id)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition border border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/10"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => onMarkFinished(r.id)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5"
            >
              Marquer terminée
            </button>
          </>
        ) : null}

        {r.status === "annulée" ? (
          <button
            type="button"
            onClick={() => onCancelToggle(r.id)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full transition border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
          >
            Réactiver
          </button>
        ) : null}

        {r.status === "terminée" ? (
          <button
            type="button"
            onClick={() => onReopen(r.id)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full transition border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
          >
            Réouvrir
          </button>
        ) : null}

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
