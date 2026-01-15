import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

// Importujemy tylko to, co potrzebne do statystyk
import { 
  getUserStats, 
  type UserStatsDto 
} from "../../api/users.api";

/* =========================
   COMPONENT
   ========================= */

export default function UserProfilePage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [stats, setStats] = useState<UserStatsDto | null>(null);

  // Wizytówka
  const email = user?.email ?? "user@local";
  const displayName = user?.login || email.split("@")[0];
  const letter = displayName[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    if (!user?.id) return;

    // Pobieramy tylko statystyki
    getUserStats(user.id)
      .then(setStats)
      .catch(() => setStats(null));
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleBack = () => {
    navigate("/user/dashboard");
  };

  return (
    <div className="admin-root">
      {/* Kontener: jedna kolumna, wyśrodkowana, max szerokość 500px */}
      <div style={{ 
        maxWidth: "500px", 
        margin: "0 auto", 
        display: "flex", 
        flexDirection: "column", 
        gap: "20px" 
      }}>
        
        {/* === BLOK 1: PROFIL === */}
        <div className="admin-block glass">
          <div className="admin-profile">
            <div className="admin-avatar">{letter}</div>
            <div className="admin-name">{displayName}</div>
            <div className="admin-email">{email}</div>
            <div className="admin-role">👤 Użytkownik</div>
          </div>
        </div>

        {/* === BLOK 2: STATYSTYKI (SUMOWANIE) === */}
        <div className="admin-block glass">
          <h2 style={{ textAlign: "center", marginBottom: "15px", fontSize: "1.2rem" }}>
            Twoje podsumowanie
          </h2>
          {!stats ? (
            <p className="muted" style={{ textAlign: "center" }}>Ładowanie...</p>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", // Siatka 2x2 dla czytelności
              gap: "15px", 
              fontSize: "14px" 
            }}>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                 <div style={{ fontSize: "20px", marginBottom: "5px" }}>📦</div>
                 <div>Kupione: <strong>{stats.purchasedCount}</strong></div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                 <div style={{ fontSize: "20px", marginBottom: "5px" }}>💸</div>
                 <div>Wydano: <strong>{stats.totalSpent.toFixed(2)} zł</strong></div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                 <div style={{ fontSize: "20px", marginBottom: "5px" }}>⭐</div>
                 <div>Oceny: <strong>{stats.ratedCount}</strong></div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                 <div style={{ fontSize: "20px", marginBottom: "5px" }}>💬</div>
                 <div>Komentarze: <strong>{stats.commentsCount}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* === BLOK 3: PRZYCISKI === */}
        <div className="admin-block glass">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button className="admin-action big secondary full" onClick={handleBack}>
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