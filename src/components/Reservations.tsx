import React from "react";
import { sanitizeName } from "../lib/input";

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

type NoticeType = "success" | "error" | "info";

type Availability = {
  roomType: string;
  total: number;
  remaining: number;
  isAvailable: boolean;
  hasSearchWindow: boolean;
};

type ReservationsProps = {
  reservationName: string;
  reservationEmail: string;
  reservationCity: string;
  reservationRoomType: string;
  selectedRoomType?: string | null;
  reservationGuests: number;
  startDate: string;
  endDate: string;
  reservationDuration: number | null;
  selectedOffer?: string | null;
  availability: Availability;
  title?: string;
  onRequireRegistration: () => boolean;
  onValidSubmit: () => void;
  onNotify: (message: string, type?: NoticeType) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onRoomTypeChange: (value: string) => void;
  onGuestsChange: (value: number) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
};

export default function Reservations({
  reservationName,
  reservationEmail,
  reservationCity,
  reservationRoomType,
  selectedRoomType,
  reservationGuests,
  startDate,
  endDate,
  reservationDuration,
  selectedOffer,
  availability,
  onRequireRegistration,
  onValidSubmit,
  onNotify,
  onNameChange,
  onEmailChange,
  onCityChange,
  onRoomTypeChange,
  onGuestsChange,
  onStartDateChange,
  onEndDateChange,
}: ReservationsProps) {
  const today = getTodayDateString();
  const hasIdentity = Boolean(reservationName.trim() && reservationEmail.trim());
  const hasDates = Boolean(reservationDuration);
  const hasValidationError = !hasIdentity || !hasDates || !availability.isAvailable;
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (onRequireRegistration()) {
      if (!hasIdentity) {
        onNotify("Veuillez saisir le nom et l'email.", "error");
        return;
      }

      if (!hasDates) {
        onNotify("Veuillez choisir des dates valides.", "error");
        return;
      }

      if (!availability.isAvailable) {
        onNotify(
          `Aucune chambre ${availability.roomType} n'est disponible pour les dates choisies.`,
          "error",
        );
        return;
      }

      setIsSubmitting(true);
      onNotify("Verifiez le recapitulatif avant de confirmer.", "info");
      onValidSubmit();
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservation" className="section-anchor py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h3 className="text-3xl sm:text-4xl font-semibold text-center mb-8 text-slate-900 dark:text-white">
          Reservation rapide
        </h3>

        {(selectedOffer || selectedRoomType) && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-center">
            {selectedOffer && (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
                Offre choisie : {selectedOffer}
              </span>
            )}
            {selectedRoomType && (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 dark:bg-white/10 dark:text-slate-100">
                Type de chambre : {selectedRoomType}
              </span>
            )}
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 form-card p-4 sm:p-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="reservation-city" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Ville
            </label>
            <input
              id="reservation-city"
              type="text"
              placeholder="Ville"
              value={reservationCity}
              onChange={(event) => onCityChange(event.target.value)}
              aria-label="Ville"
              className="input-field"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">Saisir la ville.</p>
          </div>

          <div className="space-y-1">
            <label htmlFor="reservation-name" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Nom
            </label>
            <input
              id="reservation-name"
              type="text"
              placeholder="Nom"
              value={reservationName}
              onChange={(event) => onNameChange(sanitizeName(event.target.value))}
              aria-label="Nom"
              className="input-field"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">Saisir votre nom.</p>
          </div>

          <div className="space-y-1">
            <label htmlFor="reservation-email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              id="reservation-email"
              type="email"
              placeholder="Email"
              value={reservationEmail}
              onChange={(event) => onEmailChange(event.target.value)}
              aria-label="Email"
              className="input-field"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">Saisir votre email.</p>
          </div>

          <div className="space-y-1">
            <label htmlFor="reservation-room-type" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Type de chambre
            </label>
            <select
              id="reservation-room-type"
              className="input-field"
              aria-label="Type de chambre"
              value={reservationRoomType}
              onChange={(event) => onRoomTypeChange(event.target.value)}
            >
              <option>Standard</option>
              <option>Deluxe</option>
              <option>Suite</option>
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400">Choisir le type de chambre.</p>
          </div>

          <div className="space-y-1">
            <label htmlFor="reservation-guests" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Nombre de personnes
            </label>
            <input
              id="reservation-guests"
              type="number"
              value={reservationGuests}
              onChange={(event) => onGuestsChange(Number(event.target.value))}
              aria-label="Nombre de personnes"
              className="input-field"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">Saisir le nombre de personnes.</p>
          </div>

          <div className="space-y-1">
            <label htmlFor="reservation-start-date" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Date d'arrivee
            </label>
            <input
              id="reservation-start-date"
              type="date"
              min={today}
              value={startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
              aria-label="Date d'arrivee"
              className="input-field"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">Date d'arrivee.</p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label htmlFor="reservation-end-date" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Date de depart
            </label>
            <input
              id="reservation-end-date"
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(event) => onEndDateChange(event.target.value)}
              aria-label="Date de depart"
              className="input-field"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">Date de depart.</p>
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            {hasDates ? (
              <div className="alert alert-success">Duree : {reservationDuration} nuit(s)</div>
            ) : (
              <div className="alert alert-warning">Ajoutez des dates valides pour calculer la duree.</div>
            )}

            {!hasIdentity && (
              <div className="alert alert-warning">Le nom et l'email sont requis pour confirmer.</div>
            )}

            {availability.hasSearchWindow ? (
              availability.isAvailable ? (
                <div className="alert alert-success">
                  Disponibilite : {availability.remaining} chambre(s) {availability.roomType} encore disponible(s) sur {availability.total}.
                </div>
              ) : (
                <div className="alert alert-error">
                  Complet : aucune chambre {availability.roomType} n'est disponible pour ces dates.
                </div>
              )
            ) : (
              <div className="alert alert-warning">
                Selectionnez vos dates pour verifier la disponibilite en temps reel.
              </div>
            )}
          </div>

          <button className="btn btn-primary md:col-span-2" disabled={hasValidationError || isSubmitting}>
            {isSubmitting ? "Confirmation..." : "Confirmer la reservation"}
          </button>
        </form>
      </div>
    </section>
  );
}
