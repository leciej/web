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

const label = (type: string) =>
  ({
    COMMENT: "💬 Dodano komentarz",
    RATING: "⭐ Dodano ocenę",
    PURCHASE: "🛒 Złożono zamówienie",
    ADD_TO_CART: "➕ Dodano do koszyka",
    REMOVE_FROM_CART: "🗑 Usunięto z koszyka",
  }[type] ?? "—");

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    Promise.all([
      http.get<UserStatsDto>(`/api/users/${user.id}/stats`),
      http.get<ActivityResponseDto>(`/api/activity?viewerUserId=${user.id}`),
    ])
      .then(([statsRes, activityRes]) => {
        setStats(statsRes);
        setActivities(activityRes.items ?? []);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) return null;

  const displayName =
    user.login ||
    user.email?.split("@")[0] ||
    "Użytkownik";

  const avatarLetter = displayName[0]?.toUpperCase() ?? "U";

  if (loading) return <p>Ładowanie profilu…</p>;

  return (
    <div className="admin-root">
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            gridColumn: "1 / -1",
            padding: "24px 8px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#2563eb",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            {avatarLetter}
          </div>

          <div style={{ fontSize: 22, fontWeight: 800 }}>
            {displayName}
          </div>

          {user.email && (
            <div style={{ fontSize: 13, opacity: 0.7 }}>
              {user.email}
            </div>
          )}

          <div
            style={{
              marginTop: 4,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.2)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            👤 Użytkownik
          </div>
        </div>

        {/* AKTYWNOŚĆ */}
        <div className="admin-block glass">
          <div style={{ fontWeight: 800, marginBottom: 8 }}>
            Ostatnia aktywność
          </div>

          {activities.length === 0 ? (
            <div style={{ fontStyle: "italic", opacity: 0.7 }}>
              Brak aktywności
            </div>
          ) : (
            activities.slice(0, 5).map((a, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div>{label(a.type)}</div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>
                  {timeAgo(a.createdAt)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* STATYSTYKI */}
        <div className="admin-block glass">
          <div style={{ fontWeight: 800, marginBottom: 8 }}>
            Twoje statystyki
          </div>

          {stats && (
            <div style={{ fontSize: 14, lineHeight: 1.8 }}>
              <div>✅ Kupione produkty: {stats.purchasedCount}</div>
              <div>💸 Wydane pieniądze: {stats.totalSpent.toFixed(2)} zł</div>
              <div>⭐ Ocenione: {stats.ratedCount}</div>
              <div>⭐ Średnia: {stats.averageRating.toFixed(1)}</div>
              <div>💬 Komentarze: {stats.commentsCount}</div>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="admin-block glass">
          <button
            className="admin-action secondary"
            onClick={() => navigate("/user/dashboard")}
          >
            ← Wstecz
          </button>

          <button
            className="admin-action"
            style={{ marginTop: 12 }}
            onClick={logout}
          >
            WYLOGUJ SIĘ
          </button>
        </div>
      </div>
    </div>
  );
}
