import { useMemo, useState } from "react";

type InscriptionProps = {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Inscription({ onSuccess, onSwitchToLogin }: InscriptionProps) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [sexe, setSexe] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [nationalite, setNationalite] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setNom("");
    setPrenom("");
    setSexe("");
    setAge("");
    setEmail("");
    setTelephone("");
    setNationalite("");
    setPassword("");
    setConfirmPassword("");
    setAcceptTerms(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors([]);
    setTouched({});
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const fieldErrors = useMemo(() => {
    const nextErrors: Record<string, string> = {};

    if (!nom.trim()) nextErrors.nom = "Le nom est requis.";
    if (!prenom.trim()) nextErrors.prenom = "Le prénom est requis.";
    if (!sexe) nextErrors.sexe = "Veuillez sélectionner un sexe.";

    const ageValue = Number(age);
    if (!age.trim()) {
      nextErrors.age = "L'âge est requis.";
    } else if (!Number.isInteger(ageValue) || ageValue <= 0) {
      nextErrors.age = "L'âge doit être un entier positif.";
    }

    if (!email.trim()) {
      nextErrors.email = "L'email est requis.";
    } else if (!emailPattern.test(email)) {
      nextErrors.email = "L'email n'est pas valide.";
    }

    if (telephone && !/^[+\d\s().-]{6,}$/.test(telephone)) {
      nextErrors.telephone = "Le numéro de téléphone n'est pas valide.";
    }

    if (!password) nextErrors.password = "Le mot de passe est requis.";
    if (password && password.length < 8) {
      nextErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Veuillez confirmer le mot de passe.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    if (!acceptTerms) nextErrors.acceptTerms = "Vous devez accepter les conditions.";

    return nextErrors;
  }, [nom, prenom, sexe, age, email, telephone, password, confirmPassword, acceptTerms]);

  const completion = useMemo(() => {
    const requiredFields = [nom, prenom, sexe, age, email, password, confirmPassword];
    const completed = requiredFields.filter((value) => value.trim().length > 0).length;
    const termsBonus = acceptTerms ? 1 : 0;
    const total = requiredFields.length + 1;
    return Math.round(((completed + termsBonus) / total) * 100);
  }, [nom, prenom, sexe, age, email, password, confirmPassword, acceptTerms]);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    const nextErrors = Object.values(fieldErrors);

    setErrors(nextErrors);
    setTouched({
      nom: true,
      prenom: true,
      sexe: true,
      age: true,
      email: true,
      telephone: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true,
    });

    if (nextErrors.length === 0) {
      setIsSubmitting(true);
      resetForm();
      onSuccess();
      setIsSubmitting(false);
    }
  };

  const inputBase = "input-field";
  const labelBase = "text-sm font-semibold text-slate-700 dark:text-slate-200";

  const renderError = (field: string) =>
    touched[field] && fieldErrors[field] ? (
      <p className="mt-1 text-xs text-red-600 dark:text-red-300">{fieldErrors[field]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 animate-reveal dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Progression du profil
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complétez le formulaire pour accélérer vos réservations.
            </p>
          </div>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {completion}%
          </span>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-2 rounded-full bg-emerald-500 transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="alert alert-error">
          {errors.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </div>
      )}

      <section className="space-y-4 animate-reveal" style={{ animationDelay: "60ms" }}>
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Informations personnelles
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ces informations nous aident  personnaliser votre accueil.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="nom" className={labelBase}>
              Nom
            </label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              onBlur={() => markTouched("nom")}
              className={inputBase}
              placeholder="Dupont"
            />
            {renderError("nom")}
          </div>

          <div>
            <label htmlFor="prenom" className={labelBase}>
              Prénom
            </label>
            <input
              id="prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              onBlur={() => markTouched("prenom")}
              className={inputBase}
              placeholder="Marie"
            />
            {renderError("prenom")}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="sexe" className={labelBase}>
              Sexe
            </label>
            <select
              id="sexe"
              value={sexe}
              onChange={(e) => setSexe(e.target.value)}
              onBlur={() => markTouched("sexe")}
              className={inputBase}
            >
              <option value="">Sélectionner...</option>
              <option value="masculin">Masculin</option>
              <option value="feminin">Féminin</option>
              <option value="autres">Autres</option>
            </select>
            {renderError("sexe")}
          </div>

          <div>
            <label htmlFor="age" className={labelBase}>
              Âge
            </label>
            <input
              id="age"
              type="number"
              min={1}
              step={1}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              onBlur={() => markTouched("age")}
              className={inputBase}
              placeholder="30"
            />
            {renderError("age")}
          </div>

          <div>
            <label htmlFor="nationalite" className={labelBase}>
              Nationalité
            </label>
            <input
              id="nationalite"
              type="text"
              value={nationalite}
              onChange={(e) => setNationalite(e.target.value)}
              className={inputBase}
              placeholder="Francaise"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 animate-reveal" style={{ animationDelay: "120ms" }}>
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Coordonnées
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nous les utilisons pour confirmer vos réservations et offres spéciales.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelBase}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => markTouched("email")}
              className={inputBase}
              placeholder="marie.dupont@email.com"
            />
            {renderError("email")}
          </div>

          <div>
            <label htmlFor="telephone" className={labelBase}>
              Téléphone (optionnel)
            </label>
            <input
              id="telephone"
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              onBlur={() => markTouched("telephone")}
              className={inputBase}
              placeholder="+33 6 12 34 56 78"
            />
            {renderError("telephone")}
          </div>
        </div>
      </section>

      <section className="space-y-4 animate-reveal" style={{ animationDelay: "180ms" }}>
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Sécurité du compte
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choisissez un mot de passe solide pour sécuriser votre compte.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="password" className={labelBase}>
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched("password")}
                className={inputBase}
                placeholder="Minimum 8 caractères"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
            {renderError("password")}
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={
                  passwordStrength <= 1
                    ? "h-2 rounded-full bg-red-400"
                    : passwordStrength === 2
                    ? "h-2 rounded-full bg-amber-400"
                    : passwordStrength === 3
                    ? "h-2 rounded-full bg-lime-400"
                    : "h-2 rounded-full bg-emerald-500"
                }
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Ajoutez une majuscule, un chiffre et un symbole pour renforcer votre mot de passe.
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelBase}>
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => markTouched("confirmPassword")}
                className={inputBase}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                {showConfirmPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
            {renderError("confirmPassword")}
            {confirmPassword && password === confirmPassword ? (
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                Les mots de passe correspondent.
              </p>
            ) : null}
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            onBlur={() => markTouched("acceptTerms")}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 dark:border-slate-600"
          />
          <span>
            J'accepte les conditions générales et la politique de confidentialité.
          </span>
        </label>
        {renderError("acceptTerms")}
      </section>

      <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? "Création..." : "Créer mon compte"}
      </button>

      <p onClick={onSwitchToLogin} className="text-center text-sm link-accent cursor-pointer">
        Deja inscrit ? Se connecter
      </p>
    </form>
  );
}

