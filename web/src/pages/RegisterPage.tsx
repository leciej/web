import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/users.api";
import { AuthLayout } from "../layout/AuthLayout";

type RegisterForm = {
  name: string;
  surname: string;
  login: string;
  email: string;
  password: string;
  repeat: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    surname: "",
    login: "",
    email: "",
    password: "",
    repeat: "",
  });

  const handleChange =
    (field: keyof RegisterForm) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleRegister = async () => {
    const { name, surname, login, email, password, repeat } = form;

    if (!name || !surname || !login || !email || !password || !repeat) {
      alert("Uzupełnij wszystkie pola");
      return;
    }

    if (password !== repeat) {
      alert("Hasła nie są takie same");
      return;
    }

    try {
      await register(form);
      navigate("/login");
    } catch {
      alert("Błąd rejestracji");
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h1 className="login-title">Rejestracja</h1>

        <input
          className="login-input"
          placeholder="Imię"
          value={form.name}
          onChange={handleChange("name")}
        />

        <input
          className="login-input"
          placeholder="Nazwisko"
          value={form.surname}
          onChange={handleChange("surname")}
        />

        <input
          className="login-input"
          placeholder="Login"
          value={form.login}
          onChange={handleChange("login")}
        />

        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange("email")}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Hasło"
          value={form.password}
          onChange={handleChange("password")}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Powtórz hasło"
          value={form.repeat}
          onChange={handleChange("repeat")}
        />

        <button
          className="login-button primary"
          onClick={handleRegister}
        >
          Zarejestruj
        </button>

        <button
          className="login-button admin"
          onClick={() => navigate("/login")}
        >
          Wróć
        </button>
      </div>
    </AuthLayout>
  );
}
