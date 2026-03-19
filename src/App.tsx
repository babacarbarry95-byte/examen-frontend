import './App.css';
import Connexion from './components/Connexion.tsx';
import Reservations from './components/Reservations.tsx';
import { useMemo, useState } from "react";



function App() {
  const [reservationName, setReservationName] = useState("");
  const [reservationEmail, setReservationEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notice, setNotice] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Connexion state
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(prev => !prev);
  const handleSuccess = () => setNotice({ message: "Connexion réussie!", type: "success" });
  const switchToRegister = () => setNotice({ message: "Inscription non implémentée.", type: "info" });

  const reservationDuration = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return null;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen bg-black">
      
      {notice && (
        <div
          className={`mx-auto max-w-4xl px-4 sm:px-6 mt-6 text-sm font-semibold ${
            notice.type === "success"
              ? "text-green-400"
              : notice.type === "error"
              ? "text-red-400"
              : "text-slate-300"
          }`}
        >
          {notice.message}
        </div>
      )}
      <Reservations
        reservationName={reservationName}
        reservationEmail={reservationEmail}
        startDate={startDate}
        endDate={endDate}
        reservationDuration={reservationDuration}
        onRequireRegistration={() => true}
        onValidSubmit={() => {}}
        onNotify={(message, type = "info") => setNotice({ message, type })}
        onNameChange={setReservationName}
        onEmailChange={setReservationEmail}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <Connexion 
        showPassword={showPassword}
        onTogglePassword={togglePassword}
        onSuccess={handleSuccess}
        onSwitchToRegister={switchToRegister}
      />
    </div>
  )
}

export default App