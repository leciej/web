import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useSyncExternalStore } from "react";

import {
  subscribe,
  getActivities,
  type Activity,
} from "../../features/activityStore";

/* =========================
   HELPERS
   ========================= */

const isAdminType = (type: string): boolean =>
  [
    "ADD_PRODUCT",
    "EDIT_PRODUCT",
    "REMOVE_PRODUCT",
    "ADD_GALLERY",
    "EDIT_GALLERY",
    "REMOVE_GALLERY",
  ].includes(type);

const label = (type: string): string =>
  ({
    ADD_PRODUCT: "➕ Dodano produkt",
    EDIT_PRODUCT: "✏️ Edytowano produkt",
    REMOVE_PRODUCT: "🗑 Usunięto produkt",
    ADD_GALLERY: "🖼➕ Dodano arcydzieło",
    EDIT_GALLERY: "🖼✏️ Edytowano arcydzieło",
    REMOVE_GALLERY: "🖼🗑 Usunięto arcydzieło",
  }[type] ?? "—");

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);

  if (min < 1) return "przed chwilą";
  if (min < 60) return `${min} min temu`;

  const h = Math.floor(min / 60);
  return `${h} h temu`;
}

export default function AdminProfilePage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const email = user?.email ?? "admin@local";
  const letter = email[0]?.toUpperCase() ?? "A";

  const activities = useSyncExternalStore(
    subscribe,
    getActivities
  )
    .filter((a: Activity) => isAdminType(a.type))
    .slice(0, 5);

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

          {activities.length === 0 ? (
            <p className="muted">Brak aktywności</p>
          ) : (
            <ul style={{ paddingLeft: 16 }}>
              {activities.map((a: Activity, i: number) => (
                <li key={i} style={{ fontSize: 13 }}>
                  {label(a.type)}
                  <div style={{ fontSize: 11, opacity: 0.6 }}>
                    {timeAgo(a.createdAt)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* SZYBKIE AKCJE */}
        <div className="admin-block glass">
          <h2>Szybkie akcje</h2>

          <div className="admin-actions-row half">
            <Link
              to="/admin/products/add"
              className="admin-action big primary"
            >
              ➕ Dodaj produkt
            </Link>

            <Link
              to="/admin/gallery/add"
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
              gap: "18px",
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
