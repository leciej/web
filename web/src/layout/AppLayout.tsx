import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { VideoBackground } from "../components/VideoBackground";
import { ThemeToggle } from "../components/ThemeToggle";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function AppLayout() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const location = useLocation();
  const isSplash = location.pathname === "/";

  const toggleTheme = () => {
    setTheme(t => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  return (
    <div className={`login-root ${theme}`}>
      <VideoBackground theme={theme} />

      {!isSplash && <div className="login-overlay" />}

      <ThemeToggle theme={theme} toggle={toggleTheme} />

      <Outlet />
    </div>
  );
}
