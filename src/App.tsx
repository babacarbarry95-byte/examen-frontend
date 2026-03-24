import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import APropos from "./components/APropos";
import Temoignages from "./components/Temoignages";
import ThemeToggle from "./components/ThemeToggle";
import ThemeExample from "./components/ThemeExample";
import { ThemeProvider } from "./theme/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/temoignages" element={<Temoignages />} />
            <Route path="/theme-example" element={<ThemeExample />} />
          </Routes>

          <ThemeToggle />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
