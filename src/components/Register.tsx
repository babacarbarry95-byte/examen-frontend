import { useNavigate } from "react-router-dom";
import Inscription from "./Inscription";

const coverImage = new URL("../assets/Hotel.jpg", import.meta.url).href;

export default function Register() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    localStorage.setItem("faby_logged", "true");
    navigate("/", { state: { scrollToReservation: true } });
  };

  const handleSwitchToLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-stretch gap-10 px-6 py-10 md:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${coverImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/70 to-emerald-900/60" />
          <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col justify-between p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">
                Nouveau client
              </p>
              <h1 className="mt-4 text-3xl sm:text-4xl font-semibold">
                Rejoignez FABY Hotel
              </h1>
              <p className="mt-3 text-sm text-slate-200">
                Créez votre compte pour profiter de réservations rapides,
                d'offres exclusives et d'un suivi personnalisé.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-slate-200">
              {["Réservation simplifiée", "Offres membres exclusives", "Historique & préférences"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="form-card w-full max-w-md self-center space-y-4 p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">
              Inscription
            </p>
            <h2 className="form-title">Créer un compte</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Remplissez le formulaire pour créer votre espace client.
            </p>
          </div>

          <Inscription
            onSuccess={handleSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        </div>
      </div>
    </div>
  );
}
