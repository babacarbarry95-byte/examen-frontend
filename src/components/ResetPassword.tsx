import React, { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Réinitialisation pour :", email);
    // Ici tu envoies un email via Firebase ou ton API
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-slate-900 dark:text-slate-100">
      <form
        onSubmit={handleReset}
        className="form-card w-full max-w-sm space-y-3 sm:space-y-4 p-4 sm:p-6"
      >
        <h2 className="form-title">Réinitialiser le mot de passe</h2>
        <div className="space-y-1">
          <label htmlFor="reset-email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-full">Envoyer le lien</button>
      </form>
    </div>
  );
}


