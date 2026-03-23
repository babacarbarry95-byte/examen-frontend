import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverImage = new URL("../assets/Hotel.jpg", import.meta.url).href;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!email.trim() || !password.trim()) return;
    setIsSubmitting(true);
    localStorage.setItem("faby_logged", "true");
    setEmail("");
    setPassword("");
    navigate("/", { state: { scrollToReservation: true } });
    setIsSubmitting(false);
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
                Accès client
              </p>
              <h1 className="mt-4 text-3xl sm:text-4xl font-semibold">
                Bienvenue à FABY Hotel
              </h1>
              <p className="mt-3 text-sm text-slate-200">
                Connectez-vous pour gérer vos réservations, vos préférences et vos
                services premium.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-slate-200">
              {["Check-in rapide", "Avantages fidélité", "Support 24/7"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <form
          onSubmit={handleLogin}
          className="form-card w-full max-w-md self-center space-y-4 p-6 sm:p-8"
        >
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">
              Espace client
            </p>
            <h2 className="form-title">Connexion</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Entrez vos identifiants pour accéder à votre tableau de bord.
            </p>
          </div>

          <div className="space-y-1">
            <label htmlFor="login-email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="vous@email.com"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="login-password" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Mot de passe
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="Votre mot de passe"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link to="/reset-password" className="link-accent">
              Mot de passe oublié ?
            </Link>
            <Link to="/register" className="link-accent">
              Créer un compte
            </Link>
          </div>

          <button className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              Réinitialiser le mot de passe
            </p>
            <p className="mt-1">
              Vous avez oublié votre mot de passe ? Recevez un lien sécurisé par email.
            </p>
            <Link to="/reset-password" className="mt-2 inline-flex text-emerald-700 font-semibold dark:text-emerald-300">
              Réinitialiser maintenant
            </Link>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            En continuant, vous acceptez nos conditions et notre politique de confidentialité.
          </div>
        </form>
      </div>
    </div>
  );
}


