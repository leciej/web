import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function AdminProfilePage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const email = user?.email ?? "admin@local";
  const letter = email[0]?.toUpperCase() ?? "A";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="admin-root">
      <div className="admin-grid-2x2">
        {/* PROFIL */}
        <div className="admin-block glass">
          <div className="admin-profile">
            <div className="admin-avatar">{letter}</div>
            <div className="admin-name">Administrator</div>
            <div className="admin-email">{email}</div>
            <div className="admin-role">🛠 Administrator</div>
          </div>
        </div>

        {/* OSTATNIA AKTYWNOŚĆ */}
        <div className="admin-block glass">
          <h2>Ostatnia aktywność</h2>
          <p className="muted">Brak aktywności</p>
        </div>

        {/* SZYBKIE AKCJE */}
        <div className="admin-block glass">
          <h2>Szybkie akcje</h2>

          <div className="admin-actions-row half">
            <Link
              to="/admin/products"
              className="admin-action big primary"
            >
              ➕ Dodaj produkt
            </Link>

            <Link
              to="/admin/gallery"
              className="admin-action big primary"
            >
              ➕ Dodaj arcydzieło
            </Link>
          </div>

          <Link
            to="/admin/stats"
            className="admin-action big secondary full"
          >
            📊 Przejdź do statystyk
          </Link>
        </div>

        {/* NAWIGACJA */}
        <div className="admin-block glass center">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px", // <-- TYLKO WIĘKSZY ODSTĘP
              width: "100%",
            }}
          >
            <button
              className="admin-action big secondary full"
              onClick={handleBack}
            >
              ← Wróć
            </button>

            <button
              className="admin-logout"
              onClick={handleLogout}
            >
              WYLOGUJ SIĘ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
