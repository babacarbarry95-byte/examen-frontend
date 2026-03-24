import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Chambres from "./Chambres";
import Loisirs from "./Loisirs";
import Offres from "./Offres";
import Reservations from "./Reservations";
import Footer from "./Footer";
import { ROOM_PRICE_CFA } from "../lib/pricing";
import { authenticate, setSession } from "../lib/auth";

type ToastType = "success" | "error" | "info";
const heroImage = new URL("../assets/Hotel.jpg", import.meta.url).href;

function App() {
  const [isLogged, setIsLogged] = useState(() => {
    return localStorage.getItem("faby_logged") === "true";
  });
  const [reservationName, setReservationName] = useState("");
  const [reservationEmail, setReservationEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [selectedOfferPriceCfa, setSelectedOfferPriceCfa] = useState<number | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [selectedRoomPriceCfa, setSelectedRoomPriceCfa] = useState<number | null>(null);
  const [reservationCity, setReservationCity] = useState("Dakar");
  const [reservationRoomType, setReservationRoomType] = useState("Standard");
  const [reservationGuests, setReservationGuests] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const toastTimeout = useRef<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  /* --- Login Modal State --- */
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && "scrollToReservation" in location.state) {
      requestAnimationFrame(() => {
        document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" });
      });
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileNavOpen]);

  const notify = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
    if (toastTimeout.current) {
      window.clearTimeout(toastTimeout.current);
    }
    toastTimeout.current = window.setTimeout(() => setToast(null), 3000);
  };

  const requireRegistration = () => {
    if (!isLogged) {
      notify("Veuillez vous connecter avant de réserver", "info");
      setLoginError(null);
      setShowLoginModal(true);
      return false;
    }

    return true;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginSubmitting) return;
    if (!loginEmail.trim() || !loginPassword.trim()) return;
    setLoginSubmitting(true);

    const result = authenticate(loginEmail, loginPassword);
    if (!result.ok) {
      setLoginSubmitting(false);
      setLoginError(result.error);
      notify(result.error, "error");
      return;
    }

    setSession(result.user);
    setIsLogged(true);
    setLoginEmail("");
    setLoginPassword("");
    setLoginError(null);
    setShowLoginModal(false);
    setLoginSubmitting(false);
    notify("Connexion réussie !", "success");
  };

  const handleOfferReserve = (offer: { title: string; priceCfa: number }) => {
    setSelectedOffer(offer.title);
    setSelectedOfferPriceCfa(offer.priceCfa);
    // Avoid ambiguity: when an offer is selected, clear the room badge selection.
    setSelectedRoomType(null);
    setSelectedRoomPriceCfa(null);
    if (requireRegistration()) {
      document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRoomReserve = (selection: { roomType: string; priceCfa: number }) => {
    setSelectedRoomType(selection.roomType);
    setSelectedRoomPriceCfa(selection.priceCfa);
    setReservationRoomType(selection.roomType);
    // Avoid ambiguity: when a room is selected, clear any offer selection.
    setSelectedOffer(null);
    setSelectedOfferPriceCfa(null);
    if (requireRegistration()) {
      document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRoomTypeChange = (value: string) => {
    setReservationRoomType(value);
    // If the user came from a "Réserver" click, keep the badge in sync with the form.
    if (selectedRoomType !== null) {
      setSelectedRoomType(value);
      setSelectedRoomPriceCfa(ROOM_PRICE_CFA[value] ?? null);
    }
  };

  const reservationDuration = useMemo(() => {
    if (!startDate || !endDate) {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return null;
    }

    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
      return null;
    }

    return diffDays;
  }, [startDate, endDate]);

  const handleReservationConfirm = () => {
    if (!reservationDuration) {
      return;
    }

    const unitPriceCfa =
      selectedOfferPriceCfa ?? selectedRoomPriceCfa ?? ROOM_PRICE_CFA[reservationRoomType] ?? 0;
    const totalPriceCfa = unitPriceCfa * reservationDuration;
    const priceSource = selectedOfferPriceCfa ? ("offre" as const) : ("chambre" as const);

    const newReservation = {
      id: Date.now(),
      name: reservationName.trim(),
      email: reservationEmail.trim(),
      city: reservationCity,
      roomType: reservationRoomType,
      guests: reservationGuests,
      startDate,
      endDate,
      duration: reservationDuration,
      status: "confirmée" as const,
      offer: selectedOffer || undefined,
      unitPriceCfa,
      totalPriceCfa,
      priceSource,
    };
    const existing = JSON.parse(localStorage.getItem("faby_reservations") || "[]");
    existing.push(newReservation);
    localStorage.setItem("faby_reservations", JSON.stringify(existing));
    navigate("/dashboard");
  };

  const toastClass =
    toast?.type === "success"
      ? "bg-emerald-600 text-white"
      : toast?.type === "error"
      ? "bg-rose-600 text-white"
      : "bg-slate-900 text-white";

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      {/* Navigation */}
      <header className="fixed top-0 z-10 w-full border-b border-slate-200 bg-white/90 shadow-lg shadow-black/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <a
            href="#home"
            className="text-2xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-300"
          >
            FABY Hotel
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-200/80">
            <a className="transition hover:text-emerald-700 dark:hover:text-emerald-300" href="#home">
              Accueil
            </a>
            <a className="transition hover:text-emerald-700 dark:hover:text-emerald-300" href="#rooms">
              Chambres
            </a>
            <a className="transition hover:text-emerald-700 dark:hover:text-emerald-300" href="#reservation">
              Réservation
            </a>
            <a className="transition hover:text-emerald-700 dark:hover:text-emerald-300" href="#offre">
              Nos offres
            </a>
            <a className="transition hover:text-emerald-700 dark:hover:text-emerald-300" href="#loisirs">
              Loisirs
            </a>
            <Link className="transition hover:text-emerald-700 dark:hover:text-emerald-300" to="/dashboard">
              Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                setShowLoginModal(true);
                setLoginError(null);
              }}
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:-translate-y-0.5 hover:bg-emerald-500 normal-case tracking-normal"
            >
              Connexion
            </button>
          </nav>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <span className="sr-only">Menu</span>
            {mobileNavOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile nav panel */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-20 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            id="mobile-nav"
            className="absolute right-4 top-20 w-[min(22rem,calc(100%-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950"
          >
            <div className="px-5 py-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-600 font-semibold dark:text-emerald-300">
                Navigation
              </p>
              <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                {[
                  { label: "Accueil", href: "#home" },
                  { label: "Chambres", href: "#rooms" },
                  { label: "Réservation", href: "#reservation" },
                  { label: "Nos offres", href: "#offre" },
                  { label: "Loisirs", href: "#loisirs" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="rounded-xl px-3 py-2 transition hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    {item.label}
                  </a>
                ))}

                <Link
                  to="/dashboard"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-xl px-3 py-2 transition hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  Dashboard
                </Link>
              </div>

              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileNavOpen(false);
                    setShowLoginModal(true);
                    setLoginError(null);
                  }}
                  className="btn btn-primary w-full"
                >
                  Connexion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-24 right-6 z-50">
          <div className={`rounded-full px-4 py-2 text-sm font-semibold shadow-lg ${toastClass}`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* Hero */}
      <section
        id="home"
        className="section-anchor relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950/95" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">
            Expérience cinq étoiles
          </p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold text-white">
            Bienvenue à FABY Hotel
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-200">
            Un hôtel pensé pour chaque moment riche en émotion, avec un service sur-mesure
            et des espaces élégants.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#rooms" className="btn btn-primary">
              Découvrir les chambres
            </a>
            <a
              href="#reservation"
              className="btn border border-white/30 text-white hover:border-emerald-300 hover:text-emerald-200"
            >
              Réserver maintenant
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: "24/7", label: "Conciergerie premium" },
              { value: "5★", label: "Service hôtelier" },
              { value: "120+", label: "Suites et chambres" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm backdrop-blur"
              >
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Chambres onReserve={handleRoomReserve} />

      <Offres onReserve={handleOfferReserve} />

      <Reservations
        reservationName={reservationName}
        reservationEmail={reservationEmail}
        reservationCity={reservationCity}
        reservationRoomType={reservationRoomType}
        selectedRoomType={selectedRoomType}
        reservationGuests={reservationGuests}
        startDate={startDate}
        endDate={endDate}
        reservationDuration={reservationDuration}
        selectedOffer={selectedOffer}
        title="Réservation rapide"
        onRequireRegistration={requireRegistration}
        onValidSubmit={handleReservationConfirm}
        onNotify={notify}
        onNameChange={setReservationName}
        onEmailChange={setReservationEmail}
        onCityChange={setReservationCity}
        onRoomTypeChange={handleRoomTypeChange}
        onGuestsChange={setReservationGuests}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <Loisirs />

      <Footer />

      {/* ── Login Modal ── */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Fermer"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
              </svg>
            </button>

            <div className="space-y-2 mb-6">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">
                Espace client
              </p>
              <h2 className="form-title">Connexion</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Entrez vos identifiants pour accéder à votre espace.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError ? <div className="alert alert-error">{loginError}</div> : null}
              <div className="space-y-1">
                <label htmlFor="modal-login-email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <input
                  id="modal-login-email"
                  type="email"
                  placeholder="vous@email.com"
                  className="input-field"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setLoginError(null);
                  }}
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="modal-login-password" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Mot de passe
                </label>
                <input
                  id="modal-login-password"
                  type="password"
                  placeholder="Votre mot de passe"
                  className="input-field"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError(null);
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link to="/reset-password" className="link-accent" onClick={() => setShowLoginModal(false)}>
                  Mot de passe oublié ?
                </Link>
                <Link to="/register" className="link-accent" onClick={() => setShowLoginModal(false)}>
                  Créer un compte
                </Link>
              </div>

              <button className="btn btn-primary w-full" disabled={loginSubmitting}>
                {loginSubmitting ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
              En continuant, vous acceptez nos conditions et notre politique de confidentialité.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;




