import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearSession, getCurrentUser, normalizeEmail, updateUser, type FabyUser } from "../lib/auth";
import { sanitizeName, sanitizePhoneDigits } from "../lib/input";
import { formatCfa } from "../lib/pricing";
import {
  getAvailableRoomsCount,
  getReservations,
  getReservationStatusLabel,
  isRoomAvailable,
  saveReservations,
  type ReservationRecord,
  type ReservationStatus,
  type RoomType,
} from "../lib/reservations";

type ProfileFormState = {
  nom: string;
  prenom: string;
  telephone: string;
  nationalite: string;
  age: string;
  sexe: string;
  email: string;
};

type EditReservationState = {
  id: number;
  city: string;
  roomType: RoomType;
  guests: number;
  startDate: string;
  endDate: string;
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function createProfileForm(user: FabyUser): ProfileFormState {
  return {
    nom: user.nom ?? "",
    prenom: user.prenom ?? "",
    telephone: user.telephone ?? "",
    nationalite: user.nationalite ?? "",
    age: user.age ? String(user.age) : "",
    sexe: user.sexe ?? "",
    email: user.email,
  };
}

function computeDuration(startDate: string, endDate: string) {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : null;
}

function getStatusClass(status: ReservationStatus) {
  switch (status) {
    case "en_attente":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200";
    case "confirmee":
      return "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200";
    case "payee":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200";
    case "annulee":
      return "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200";
    case "terminee":
      return "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200";
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<FabyUser | null>(() => getCurrentUser());
  const [profileForm, setProfileForm] = useState<ProfileFormState>(() =>
    getCurrentUser()
      ? createProfileForm(getCurrentUser() as FabyUser)
      : createProfileForm({ id: "", createdAt: 0, email: "", password: "" }),
  );
  const [reservations, setReservations] = useState<ReservationRecord[]>(() => getReservations());
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [editReservation, setEditReservation] = useState<EditReservationState | null>(null);
  const [reservationMessage, setReservationMessage] = useState<string | null>(null);
  const [reservationError, setReservationError] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    const storedReservations = getReservations();
    const migratedReservations = storedReservations.map((reservation) => {
      if (reservation.userId || normalizeEmail(reservation.email) !== normalizeEmail(user.email)) {
        return reservation;
      }

      return {
        ...reservation,
        userId: user.id,
      };
    });

    const hasMigration = migratedReservations.some(
      (reservation, index) => reservation.userId !== storedReservations[index]?.userId,
    );

    if (hasMigration) {
      saveReservations(migratedReservations);
    }

    setCurrentUser(user);
    setProfileForm(createProfileForm(user));
    setReservations(migratedReservations);
  }, [navigate]);

  const myReservations = useMemo(() => {
    return reservations
      .filter((reservation) => reservation.userId === currentUser?.id)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [currentUser?.id, reservations]);

  const stats = useMemo(() => {
    const pending = myReservations.filter((reservation) => reservation.status === "en_attente").length;
    const confirmed = myReservations.filter((reservation) => reservation.status === "confirmee").length;
    const paid = myReservations.filter((reservation) => reservation.status === "payee").length;
    const cancelled = myReservations.filter((reservation) => reservation.status === "annulee").length;
    const finished = myReservations.filter((reservation) => reservation.status === "terminee").length;
    const totalNights = myReservations.reduce((sum, reservation) => sum + reservation.duration, 0);
    const totalSpent = myReservations
      .filter((reservation) => reservation.status !== "annulee")
      .reduce((sum, reservation) => sum + (reservation.totalPriceCfa ?? 0), 0);

    return { pending, confirmed, paid, cancelled, finished, totalNights, totalSpent };
  }, [myReservations]);

  const editDuration = editReservation
    ? computeDuration(editReservation.startDate, editReservation.endDate)
    : null;

  const editAvailability = useMemo(() => {
    if (!editReservation) return null;

    const remaining = getAvailableRoomsCount(
      editReservation.roomType,
      editReservation.startDate,
      editReservation.endDate,
      reservations,
      { excludeReservationId: editReservation.id },
    );

    return {
      remaining,
      isAvailable:
        !!editDuration &&
        isRoomAvailable(
          editReservation.roomType,
          editReservation.startDate,
          editReservation.endDate,
          reservations,
          { excludeReservationId: editReservation.id },
        ),
    };
  }, [editDuration, editReservation, reservations]);

  if (!currentUser) {
    return null;
  }

  const handleProfileChange = (field: keyof ProfileFormState, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    setProfileMessage(null);
    setProfileError(null);
  };

  const handleProfileSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;

    if (!profileForm.nom.trim() || !profileForm.prenom.trim()) {
      setProfileError("Le nom et le prenom sont requis.");
      return;
    }

    const result = updateUser(currentUser.id, {
      nom: profileForm.nom.trim(),
      prenom: profileForm.prenom.trim(),
      telephone: profileForm.telephone.trim() || undefined,
      nationalite: profileForm.nationalite.trim() || undefined,
      sexe: profileForm.sexe.trim() || undefined,
      age: profileForm.age ? Number(profileForm.age) : undefined,
      email: profileForm.email,
    });

    if (!result.ok) {
      setProfileError(result.error);
      return;
    }

    setCurrentUser(result.user);
    setProfileForm(createProfileForm(result.user));
    setProfileMessage("Vos informations personnelles ont ete mises a jour.");
  };

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  const handleCancelReservation = (reservationId: number) => {
    const nextReservations = reservations.map((reservation) =>
      reservation.id === reservationId &&
      (reservation.status === "en_attente" ||
        reservation.status === "confirmee" ||
        reservation.status === "payee")
        ? { ...reservation, status: "annulee" as const }
        : reservation,
    );

    saveReservations(nextReservations);
    setReservations(nextReservations);
    setReservationMessage("La reservation a ete annulee.");
    setReservationError(null);
  };

  const handleOpenEdit = (reservation: ReservationRecord) => {
    setEditReservation({
      id: reservation.id,
      city: reservation.city,
      roomType: reservation.roomType,
      guests: reservation.guests,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
    });
    setReservationMessage(null);
    setReservationError(null);
  };

  const handleSaveReservation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editReservation || !editDuration) {
      setReservationError("Veuillez choisir des dates valides.");
      return;
    }

    if (
      !isRoomAvailable(
        editReservation.roomType,
        editReservation.startDate,
        editReservation.endDate,
        reservations,
        { excludeReservationId: editReservation.id },
      )
    ) {
      setReservationError("Aucune chambre disponible pour ces nouvelles dates.");
      return;
    }

    const nextReservations = reservations.map((reservation) => {
      if (reservation.id !== editReservation.id) return reservation;

      const unitPriceCfa = reservation.unitPriceCfa ?? 0;
      return {
        ...reservation,
        city: editReservation.city.trim() || reservation.city,
        roomType: editReservation.roomType,
        guests: editReservation.guests,
        startDate: editReservation.startDate,
        endDate: editReservation.endDate,
        duration: editDuration,
        totalPriceCfa: unitPriceCfa * editDuration,
      };
    });

    saveReservations(nextReservations);
    setReservations(nextReservations);
    setEditReservation(null);
    setReservationMessage("La reservation a ete modifiee.");
    setReservationError(null);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 shadow-lg shadow-black/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-300">
            FABY Hotel
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="btn border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-100 dark:hover:bg-white/10"
            >
              Retour a l'accueil
            </Link>
            <button type="button" onClick={handleLogout} className="btn btn-primary">
              Deconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">
              Espace client
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
              Bonjour {currentUser.prenom || currentUser.nom || "client"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Retrouvez ici vos reservations, vos informations personnelles et les actions utiles pour gerer votre sejour.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <StatCard label="Mes reservations" value={String(myReservations.length)} />
            <StatCard label="En attente" value={String(stats.pending)} />
            <StatCard label="Confirmees" value={String(stats.confirmed)} accent />
            <StatCard label="Payees" value={String(stats.paid)} accent />
            <StatCard label="Terminees" value={String(stats.finished)} />
            <StatCard label="Budget total" value={formatCfa(stats.totalSpent)} accent />
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Mes reservations
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  Suivi de sejour
                </h2>
              </div>
            </div>

            {reservationMessage ? <div className="alert alert-success">{reservationMessage}</div> : null}
            {reservationError ? <div className="alert alert-error">{reservationError}</div> : null}

            {myReservations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Vous n'avez pas encore de reservation. Rendez-vous sur la page d'accueil pour reserver votre premiere chambre.
                </p>
                <Link to="/" className="btn btn-primary mt-4 inline-flex">
                  Reserver maintenant
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {myReservations.map((reservation) => (
                  <ReservationClientCard
                    key={reservation.id}
                    reservation={reservation}
                    onEdit={handleOpenEdit}
                    onCancel={handleCancelReservation}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Mes informations personnelles
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Profil client
              </h2>
            </div>

            {profileMessage ? <div className="alert alert-success">{profileMessage}</div> : null}
            {profileError ? <div className="alert alert-error">{profileError}</div> : null}

            <form onSubmit={handleProfileSave} className="form-card space-y-4 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nom" id="profile-nom">
                  <input
                    id="profile-nom"
                    value={profileForm.nom}
                    onChange={(event) => handleProfileChange("nom", sanitizeName(event.target.value))}
                    className="input-field"
                  />
                </Field>
                <Field label="Prenom" id="profile-prenom">
                  <input
                    id="profile-prenom"
                    value={profileForm.prenom}
                    onChange={(event) => handleProfileChange("prenom", sanitizeName(event.target.value))}
                    className="input-field"
                  />
                </Field>
              </div>

              <Field label="Email" id="profile-email">
                <input
                  id="profile-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(event) => handleProfileChange("email", event.target.value)}
                  className="input-field"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Telephone" id="profile-telephone">
                  <input
                    id="profile-telephone"
                    value={profileForm.telephone}
                    onChange={(event) => handleProfileChange("telephone", sanitizePhoneDigits(event.target.value))}
                    className="input-field"
                  />
                </Field>
                <Field label="Nationalite" id="profile-nationalite">
                  <input
                    id="profile-nationalite"
                    value={profileForm.nationalite}
                    onChange={(event) => handleProfileChange("nationalite", event.target.value)}
                    className="input-field"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Age" id="profile-age">
                  <input
                    id="profile-age"
                    type="number"
                    min={1}
                    value={profileForm.age}
                    onChange={(event) => handleProfileChange("age", event.target.value)}
                    className="input-field"
                  />
                </Field>
                <Field label="Sexe" id="profile-sexe">
                  <select
                    id="profile-sexe"
                    value={profileForm.sexe}
                    onChange={(event) => handleProfileChange("sexe", event.target.value)}
                    className="input-field"
                  >
                    <option value="">Selectionner...</option>
                    <option value="masculin">Masculin</option>
                    <option value="feminin">Feminin</option>
                    <option value="autres">Autres</option>
                  </select>
                </Field>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Enregistrer mes informations
              </button>
            </form>
          </div>
        </section>
      </div>

      {editReservation ? (
        <div className="modal-overlay" onClick={() => setEditReservation(null)}>
          <div className="modal-panel max-w-2xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setEditReservation(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Fermer"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
              </svg>
            </button>

            <div className="space-y-2 mb-6">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">
                Modifier ma reservation
              </p>
              <h2 className="form-title">Ajustez votre sejour</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Mettez a jour vos dates ou votre type de chambre. La disponibilite est reverifiee avant enregistrement.
              </p>
            </div>

            <form onSubmit={handleSaveReservation} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Ville" id="edit-city">
                  <input
                    id="edit-city"
                    value={editReservation.city}
                    onChange={(event) =>
                      setEditReservation((prev) => (prev ? { ...prev, city: event.target.value } : prev))
                    }
                    className="input-field"
                  />
                </Field>

                <Field label="Type de chambre" id="edit-room-type">
                  <select
                    id="edit-room-type"
                    value={editReservation.roomType}
                    onChange={(event) =>
                      setEditReservation((prev) =>
                        prev ? { ...prev, roomType: event.target.value as RoomType } : prev,
                      )
                    }
                    className="input-field"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Personnes" id="edit-guests">
                  <input
                    id="edit-guests"
                    type="number"
                    min={1}
                    value={editReservation.guests}
                    onChange={(event) =>
                      setEditReservation((prev) =>
                        prev ? { ...prev, guests: Math.max(1, Number(event.target.value) || 1) } : prev,
                      )
                    }
                    className="input-field"
                  />
                </Field>

                <Field label="Arrivee" id="edit-start-date">
                  <input
                    id="edit-start-date"
                    type="date"
                    value={editReservation.startDate}
                    onChange={(event) =>
                      setEditReservation((prev) => (prev ? { ...prev, startDate: event.target.value } : prev))
                    }
                    className="input-field"
                  />
                </Field>

                <Field label="Depart" id="edit-end-date">
                  <input
                    id="edit-end-date"
                    type="date"
                    value={editReservation.endDate}
                    onChange={(event) =>
                      setEditReservation((prev) => (prev ? { ...prev, endDate: event.target.value } : prev))
                    }
                    className="input-field"
                  />
                </Field>
              </div>

              <div className="space-y-2">
                {editDuration ? (
                  <div className="alert alert-success">Duree mise a jour : {editDuration} nuit(s).</div>
                ) : (
                  <div className="alert alert-warning">Choisissez des dates valides pour recalculer la duree.</div>
                )}

                {editAvailability ? (
                  editAvailability.isAvailable ? (
                    <div className="alert alert-success">
                      Disponibilite : {editAvailability.remaining} chambre(s) restante(s) pour cette periode.
                    </div>
                  ) : (
                    <div className="alert alert-error">
                      Cette modification n'est pas possible : plus de chambre disponible pour ces dates.
                    </div>
                  )
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setEditReservation(null)}
                  className="btn w-full border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-100 dark:hover:bg-white/10"
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  Enregistrer les changements
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        accent
          ? "border-emerald-100 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-500/5"
          : "border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/80"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>
      {children}
    </div>
  );
}

function ReservationClientCard({
  reservation,
  onEdit,
  onCancel,
}: {
  reservation: ReservationRecord;
  onEdit: (reservation: ReservationRecord) => void;
  onCancel: (reservationId: number) => void;
}) {
  const isEditable =
    reservation.status === "en_attente" ||
    reservation.status === "confirmee" ||
    reservation.status === "payee";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {reservation.roomType} - {reservation.city}
            </h3>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(reservation.status)}`}>
              {getReservationStatusLabel(reservation.status)}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {formatDate(reservation.startDate)} au {formatDate(reservation.endDate)} - {reservation.duration} nuit(s)
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {formatCfa(reservation.totalPriceCfa ?? 0)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Personnes</p>
          <p className="font-medium text-slate-800 dark:text-slate-200">{reservation.guests}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Prix unitaire</p>
          <p className="font-medium text-slate-800 dark:text-slate-200">{formatCfa(reservation.unitPriceCfa ?? 0)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Offre</p>
          <p className="font-medium text-slate-800 dark:text-slate-200">{reservation.offer ?? "Aucune"}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {isEditable ? (
          <>
            <button type="button" onClick={() => onEdit(reservation)} className="btn btn-primary">
              Modifier
            </button>
            <button
              type="button"
              onClick={() => onCancel(reservation.id)}
              className="btn border border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/10"
            >
              Annuler
            </button>
          </>
        ) : null}

        {!isEditable ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300">
            Cette reservation n'est plus modifiable depuis l'espace client. Pour toute mise a jour de statut, veuillez contacter l'hotel.
          </div>
        ) : null}
      </div>
    </article>
  );
}
