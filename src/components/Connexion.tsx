import { useState } from "react";
import { Link } from "react-router-dom";

type ConnexionProps = {
  showPassword: boolean;
  onTogglePassword: () => void;
  onSuccess: () => void;
  onSwitchToRegister: () => void;
};

export default function Connexion({
  showPassword,
  onTogglePassword,
  onSuccess,
  onSwitchToRegister,
}: ConnexionProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setErrors([]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const nextErrors: string[] = [];

    if (!email.trim()) nextErrors.push("L'email est requis.");
    if (!password.trim()) nextErrors.push("Le mot de passe est requis.");

    setErrors(nextErrors);
    if (nextErrors.length === 0) {
      setIsSubmitting(true);
      resetForm();
      onSuccess();
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      {errors.length > 0 && (
        <div className="alert alert-error">
          {errors.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="login-email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="vous@email.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input-field"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="login-password" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Votre mot de passe"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-field pr-20"
            required
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
            aria-pressed={showPassword}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? "Masquer" : "Afficher"}
          </button>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? "Connexion..." : "Se connecter"}
      </button>

      <button
        type="button"
        onClick={onSwitchToRegister}
        className="w-full text-center text-sm link-accent"
      >
        Créer un compte
      </button>
    
      <div className="text-center text-sm">
        <Link to="/reset-password" className="link-accent">
          Mot de passe oublié ?
        </Link>
      </div>
    </form>
  );
}





