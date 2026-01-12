import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const preloadLogin = () => import("./LoginPage");

export default function SplashPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    preloadLogin();
  }, []);

  const goToLogin = () => {
    setFadeOut(true);
    setTimeout(() => navigate("/login"), 450);
  };

  return (
    <div className="splash-root">
      <div className="splash-overlay" />

      <div
        className="splash-fade"
        style={{ opacity: fadeOut ? 1 : 0 }}
      />

      <div
        className={`splash-content ${
          visible && !fadeOut ? "visible" : "hidden"
        }`}
      >
        <img
          src={logo}
          alt="Logo"
          width={96}
          height={96}
          style={{ marginBottom: 24 }}
        />

        <h1 className="splash-title">
          Świat akwareli
        </h1>

        <p className="splash-subtitle">
          delikatność zamknięta w panzerfauście
        </p>

        <button
          className="splash-button"
          onClick={goToLogin}
        >
          Wejdź do sklepu
        </button>
      </div>
    </div>
  );
}
