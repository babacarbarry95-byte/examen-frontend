import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Chambres from "./Chambres";
import Loisirs from "./Loisirs";
import Offres from "./Offres";
import Reservations from "./Reservations";
import Footer from "./Footer";

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
  const [reservationCity, setReservationCity] = useState("Dakar");
  const [reservationRoomType, setReservationRoomType] = useState("Standard");
  const [reservationGuests, setReservationGuests] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const toastTimeout = useRef<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  /* --- Login Modal State --- */
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  useEffect(() => {
    if (location.state && "scrollToReservation" in location.state) {
      requestAnimationFrame(() => {
        document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" });
      });
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

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
    localStorage.setItem("faby_logged", "true");
    setIsLogged(true);
    setLoginEmail("");
    setLoginPassword("");
    setShowLoginModal(false);
    setLoginSubmitting(false);
    notify("Connexion réussie !", "success");
  };
  const handleReserve = (offerTitle?: string) => {
    if (offerTitle) {
      setSelectedOffer(offerTitle);
    }
    if (requireRegistration()) {
      document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" });
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-300">
            FABY Hotel
          </h1>

          <nav className="ml-auto flex flex-wrap items-center gap-5 text-sm font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-200/80">
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
              onClick={() => setShowLoginModal(true)}
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:-translate-y-0.5 hover:bg-emerald-500 normal-case tracking-normal"
            >
              Connexion
            </button>
            
          </nav>


        </div>
      </header>

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

      <Chambres onReserve={handleReserve} />

      <Offres onReserve={handleReserve} />

      <Reservations
        reservationName={reservationName}
        reservationEmail={reservationEmail}
        reservationCity={reservationCity}
        reservationRoomType={reservationRoomType}
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
        onRoomTypeChange={setReservationRoomType}
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
                  onChange={(e) => setLoginEmail(e.target.value)}
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
                  onChange={(e) => setLoginPassword(e.target.value)}
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




