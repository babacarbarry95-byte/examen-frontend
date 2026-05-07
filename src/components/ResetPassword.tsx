import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetUserPassword } from "../lib/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Veuillez saisir votre email.");
      return;
    }
    if (!newPassword.trim()) {
      setError("Veuillez saisir un nouveau mot de passe.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    const result = resetUserPassword(email, newPassword);

    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setSuccess("Mot de passe reinitialise. Vous pouvez maintenant vous reconnecter.");
    setNewPassword("");
    setConfirmPassword("");
    setIsSubmitting(false);

    window.setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-6 py-10">
        <form onSubmit={handleReset} className="form-card w-full space-y-4 p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">
              Recuperation
            </p>
            <h2 className="form-title">Reinitialiser le mot de passe</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Dans cette version locale, vous pouvez redefinir directement votre mot de passe apres verification de votre email.
            </p>
          </div>

          {error ? <div className="alert alert-error">{error}</div> : null}
          {success ? <div className="alert alert-success">{success}</div> : null}

          <div className="space-y-1">
            <label htmlFor="reset-email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              placeholder="vous@email.com"
              className="input-field"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reset-password" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Nouveau mot de passe
            </label>
            <input
              id="reset-password"
              type="password"
              placeholder="Minimum 8 caracteres"
              className="input-field"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reset-password-confirm" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Confirmer le mot de passe
            </label>
            <input
              id="reset-password-confirm"
              type="password"
              placeholder="Retapez le mot de passe"
              className="input-field"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          <button className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Reinitialisation..." : "Reinitialiser le mot de passe"}
          </button>

          <div className="text-center text-sm">
            <Link to="/" className="link-accent">
              Retour a la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
