import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

// Importujemy z naszego API użytkownika
import { 
  getUserStats, 
  getUserActivity, 
  type UserStatsDto, 
  type ActivityDto 
} from "../../api/users.api";

/* =========================
   HELPERS
   ========================= */

// Mapowanie nazw zdarzeń (łączymy nazwy z Backend i Mobile App)
const label = (type: string): string =>
  ({
    // Backend types
    "CartItemAdded":     "➕ Dodano do koszyka",
    "CartItemRemoved":   "🗑 Usunięto z koszyka",
    "OrderCreated":      "🛒 Złożono zamówienie",
    "RatingCreated":     "⭐ Dodano ocenę",
    "CommentAdded":      "💬 Dodano komentarz",
    
    // Mobile App / Legacy types
    "ADD_TO_CART":       "➕ Dodano do koszyka",
    "REMOVE_FROM_CART":  "🗑 Usunięto z koszyka",
    "PURCHASE":          "🛒 Złożono zamówienie",
    "RATING":            "⭐ Dodano ocenę",
    "COMMENT":           "💬 Dodano komentarz",
  }[type] ?? "Aktywność");

function timeAgo(dateInput: string | number): string {
  if (!dateInput) return "-";
  const timestamp = new Date(dateInput).getTime();
  const diff = Date.now() - timestamp;
  
  const min = Math.floor(diff / 60000);
  if (min < 1) return "przed chwilą";
  if (min < 60) return `${min} min temu`;
  
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h temu`;
  
  return new Date(timestamp).toLocaleDateString();
}

// Wyciąganie szczegółów (nazwa produktu, kwota) z JSON-a
function getDetails(item: ActivityDto): string {
  if (!item.dataJson) return item.message || "";

  try {
    const data = JSON.parse(item.dataJson);

    // Produkt (koszyk/ocena)
    if (data.name) return data.name; 
    if (data.Name) return data.Name;

    // Zamówienie
    if (data.total) return `Kwota: ${Number(data.total).toFixed(2)} zł`;

    // Ocena
    if (data.value) return `Ocena: ${data.value}/5`;

    return item.message || "";
  } catch {
    return item.message || "";
  }
}

/* =========================
   COMPONENT
   ========================= */

export default function UserProfilePage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [stats, setStats] = useState<UserStatsDto | null>(null);
  const [activities, setActivities] = useState<ActivityDto[]>([]);

  // Dane do wizytówki
  const email = user?.email ?? "user@local";
  const displayName = user?.login || email.split("@")[0];
  const letter = displayName[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    if (!user?.id) return;

    // 1. Statystyki
    getUserStats(user.id)
      .then(setStats)
      .catch(() => setStats(null));

    // 2. Aktywność
    getUserActivity(user.id)
      .then(res => {
        const items = Array.isArray(res) ? res : ((res as any).items || []);
        
        // === FILTR ===
        // Pokazujemy tylko akcje użytkownika (jak w apce mobilnej)
        const userActionTypes = [
            "CartItemAdded", "ADD_TO_CART",
            "CartItemRemoved", "REMOVE_FROM_CART",
            "OrderCreated", "PURCHASE",
            "RatingCreated", "RATING",
            "CommentAdded", "COMMENT"
        ];

        const filtered = items.filter(item => userActionTypes.includes(item.type));

        // Sortowanie od najnowszych
        const sorted = filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Limit: 5 ostatnich
        setActivities(sorted.slice(0, 5));
      })
      .catch(err => console.error("Błąd aktywności:", err));
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
      <div className="admin-grid-2x2">
        
        {/* KAFEL 1: PROFIL */}
        <div className="admin-block glass">
          <div className="admin-profile">
            <div className="admin-avatar">{letter}</div>
            <div className="admin-name">{displayName}</div>
            <div className="admin-email">{email}</div>
            <div className="admin-role">👤 Użytkownik</div>
          </div>
        </div>

        {/* KAFEL 2: OSTATNIA AKTYWNOŚĆ */}
        <div className="admin-block glass">
          <h2>Ostatnia aktywność</h2>

          {activities.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", opacity: 0.6 }}>
              <p>Brak ostatniej aktywności</p>
              <small style={{ fontSize: 11 }}>Twoje działania pojawią się tutaj.</small>
            </div>
          ) : (
            <ul style={{ paddingLeft: 16 }}>
              {activities.map((a, i) => (
                <li key={i} style={{ fontSize: 13, marginBottom: 12 }}>
                  <div style={{fontWeight: 600, marginBottom: 2, display: 'flex', justifyContent: 'space-between'}}>
                    {/* Typ aktywności */}
                    <span>{label(a.type)}</span>
                    {/* Czas */}
                    <span style={{ fontSize: 11, opacity: 0.5, fontWeight: 400 }}>
                      {timeAgo(a.createdAt)}
                    </span>
                  </div>
                  
                  {/* Szczegóły (np. nazwa produktu) */}
                  <div style={{ fontSize: 12, opacity: 0.8, color: '#a5f3fc' }}>
                    {getDetails(a)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* KAFEL 3: STATYSTYKI */}
        <div className="admin-block glass">
          <h2>Twoje statystyki</h2>

          {!stats ? (
            <p className="muted">Ładowanie...</p>
          ) : (
            <div style={{ fontSize: 14, lineHeight: 1.8 }}>
              <div>✅ Kupione produkty: <strong>{stats.purchasedCount}</strong></div>
              <div>💸 Wydane pieniądze: <strong>{stats.totalSpent.toFixed(2)} zł</strong></div>
              <div>⭐ Ocenione: <strong>{stats.ratedCount}</strong></div>
              <div>💬 Komentarze: <strong>{stats.commentsCount}</strong></div>
            </div>
          )}
        </div>

        {/* KAFEL 4: NAWIGACJA */}
        <div className="admin-block glass center">
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%" }}>
            <button className="admin-action big secondary full" onClick={handleBack}>
              ← Wróć do pulpitu
            </button>
            <button className="admin-logout" onClick={handleLogout}>
              WYLOGUJ SIĘ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}