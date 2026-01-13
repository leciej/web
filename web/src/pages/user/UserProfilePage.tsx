import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { http } from "../../api/http";

/* =========================
   TYPES
   ========================= */

type UserStatsDto = {
  purchasedCount: number;
  totalSpent: number;
  ratedCount: number;
  averageRating: number;
  commentsCount: number;
};

type ActivityDto = {
  type: string;
  createdAt: string;
};

type ActivityResponseDto = {
  items: ActivityDto[];
};

/* =========================
   HELPERS
   ========================= */

const label = (type: string): string =>
  ({
    COMMENT: "💬 Dodano komentarz",
    RATING: "⭐ Dodano ocenę",
    PURCHASE: "🛒 Złożono zamówienie",
    ADD_TO_CART: "➕ Dodano do koszyka",
    REMOVE_FROM_CART: "🗑 Usunięto z koszyka",
  }[type] ?? "—");

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "przed chwilą";
  if (min < 60) return `${min} min temu`;
  const h = Math.floor(min / 60);
  return `${h} h temu`;
}

/* =========================
   SCREEN
   ========================= */

export default function UserProfilePage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [stats, setStats] = useState<UserStatsDto | null>(null);
  const [activities, setActivities] = useState<ActivityDto[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    http
      .get<UserStatsDto>(`/api/users/${user.id}/stats`)
      .then(setStats)
      .catch(() => setStats(null));

    http
      .get<ActivityResponseDto>(`/api/activity?viewerUserId=${user.id}`)
      .then(res => setActivities(res.items ?? []))
      .catch(() => setActivities([]));
  }, [user?.id]);

  const email = user?.email ?? "user@local";
  const displayName =
    user?.login ||
    user?.email?.split("@")[0] ||
    "Użytkownik";

  const letter = displayName[0]?.toUpperCase() ?? "U";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleBack = () => {
    navigate("/user/dashboard");
  };

  return (
    <div className="admin-root">
      <div className="admin-grid-2x2">

        {/* === PROFIL USERA === */}
        <div className="admin-block glass">
          <div className="admin-profile">
            <div className="admin-avatar">{letter}</div>
            <div className="admin-name">{displayName}</div>
            <div className="admin-email">{email}</div>
            <div className="admin-role">👤 Użytkownik</div>
          </div>
        </div>

        {/* === OSTATNIA AKTYWNOŚĆ === */}
        <div className="admin-block glass">
          <h2>Ostatnia aktywność</h2>

          {activities.length === 0 ? (
            <p className="muted">Brak aktywności</p>
          ) : (
            <ul style={{ paddingLeft: 16 }}>
              {activities.slice(0, 5).map((a, i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  {label(a.type)}
                  <div style={{ fontSize: 11, opacity: 0.6 }}>
                    {timeAgo(new Date(a.createdAt).getTime())}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* === TWOJE STATYSTYKI === */}
        <div className="admin-block glass">
          <h2>Twoje statystyki</h2>

          {!stats ? (
            <p className="muted">Ładowanie…</p>
          ) : (
            <div style={{ fontSize: 14, lineHeight: 1.8 }}>
              <div>✅ Kupione produkty: {stats.purchasedCount}</div>
              <div>💸 Wydane pieniądze: {stats.totalSpent.toFixed(2)} zł</div>
              <div>⭐ Ocenione: {stats.ratedCount}</div>
              <div>⭐ Średnia: {stats.averageRating.toFixed(1)}</div>
              <div>💬 Komentarze: {stats.commentsCount}</div>
            </div>
          )}
        </div>

        {/* === NAWIGACJA === */}
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
