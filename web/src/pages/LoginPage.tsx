import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGuest, login } from "../api/users.api";
import { useUser } from "../context/UserContext";
import { AuthLayout } from "../layout/AuthLayout";
import type { User } from "../types/user";

type Mode = "user" | "admin" | null;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [mode, setMode] = useState<Mode>(null);
  const [loginOrEmail, setLoginOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (target: "user" | "admin") => {
    try {
      const apiUser = await login(loginOrEmail, password);

      console.log("API USER:", apiUser);

      const fullUser: User = {
        ...apiUser,
        isAdmin: target === "admin",
      };

      setUser(fullUser);
      localStorage.setItem("user", JSON.stringify(fullUser));

      navigate("/after-login");
    } catch (err) {
      console.error(err);
      alert("Nieprawidłowe dane logowania");
    }
  };

  const toggleMode = (target: Mode) => {
    setMode((m) => (m === target ? null : target));
    setLoginOrEmail("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h1 className="login-title">Guten Tag twoja mać!</h1>

        {/* GUEST */}
        <button
          className="login-button guest"
          onClick={async () => {
            try {
              const apiUser = await createGuest();

              const fullUser: User = {
                ...apiUser,
                isAdmin: false,
              };

              setUser(fullUser);
              localStorage.setItem("user", JSON.stringify(fullUser));
              navigate("/after-login");
            } catch (err) {
              console.error(err);
              alert("Nie udało się zalogować jako gość");
            }
          }}
        >
          Zaloguj jako gość
        </button>

        {/* USER */}
        <button
          className="login-button user"
          onClick={() => toggleMode("user")}
        >
          Zaloguj jako użytkownik
        </button>

        <div className={`login-form animated ${mode === "user" ? "open" : ""}`}>
          <input
            className="login-input"
            placeholder="Login lub email"
            value={loginOrEmail}
            onChange={(e) => setLoginOrEmail(e.target.value)}
          />

          <div className="login-password">
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="eye"
              type="button"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            className="login-button primary"
            onClick={() => handleLogin("user")}
          >
            Zaloguj
          </button>
        </div>

        {/* ADMIN */}
        <button
          className="login-button admin"
          onClick={() => toggleMode("admin")}
        >
          Zaloguj jako admin
        </button>

        <div className={`login-form animated ${mode === "admin" ? "open" : ""}`}>
          <input
            className="login-input"
            placeholder="Login lub email administratora"
            value={loginOrEmail}
            onChange={(e) => setLoginOrEmail(e.target.value)}
          />

          <div className="login-password">
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Hasło administratora"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="eye"
              type="button"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            className="login-button primary"
            onClick={() => handleLogin("admin")}
          >
            Zaloguj
          </button>
        </div>

        <button
          className="login-button register"
          onClick={() => navigate("/register")}
        >
          Zarejestruj się
        </button>
      </div>
    </AuthLayout>
  );
}
