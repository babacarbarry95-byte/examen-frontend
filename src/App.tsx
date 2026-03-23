import './App.css'
import { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard.tsx'
import LandingPage from './components/LandingPage.tsx'
import Register from './components/Register.tsx'
import ResetPassword from './components/ResetPassword.tsx'
import APropos from './components/APropos.tsx'
import Temoignages from './components/Temoignages.tsx'
import { BrowserRouter,Routes,Route } from 'react-router-dom'


function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <Footer/>
       
    </>
  )
}

export default App
