import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { getUserStats, type UserStatsDto } from "../../api/users.api";

export default function UserProfilePage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStatsDto | null>(null);

  const email = user?.email ?? "user@local";
  const displayName = user?.login || email.split("@")[0];
  const letter = displayName[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    if (!user?.id) return;

    getUserStats(user.id)
      .then(setStats)
      .catch(() => setStats(null));
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="admin-root">
      <div style={{ maxWidth: "500px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        <div className="admin-block glass">
          <div className="admin-profile">
            <div className="admin-avatar">{letter}</div>
            <div className="admin-name">{displayName}</div>
            <div className="admin-email">{email}</div>
            <div className="admin-role">👤 Użytkownik</div>
          </div>
        </div>

        <div className="admin-block glass">
          <h2 style={{ textAlign: "center", marginBottom: "15px", fontSize: "1.2rem" }}>
            Twoje podsumowanie
          </h2>
          {!stats ? (
            <p className="muted" style={{ textAlign: "center" }}>Ładowanie...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", fontSize: "14px" }}>
              <StatCard emoji="📦" label="Kupione" value={stats.purchasedCount} />
              <StatCard emoji="💸" label="Wydano" value={`${stats.totalSpent.toFixed(2)} zł`} />
              <StatCard emoji="⭐" label="Oceny" value={stats.ratedCount} />
              <StatCard emoji="💬" label="Komentarze" value={stats.commentsCount} />
            </div>
          )}
        </div>

        <div className="admin-block glass">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button className="admin-action big secondary full" onClick={() => navigate("/user/dashboard")}>
              ← Wróć do pulpitu
            </button>
            <button className="admin-logout full" onClick={handleLogout}>
              WYLOGUJ SIĘ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ emoji, label, value }: { emoji: string; label: string; value: string | number }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
      <div style={{ fontSize: "20px", marginBottom: "5px" }}>{emoji}</div>
      <div>{label}: <strong>{value}</strong></div>
    </div>
  );
}