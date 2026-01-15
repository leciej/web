import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

// Importujemy z naszego kompletnego pliku users.api.ts
import { 
  getUserStats, 
  getUserActivity, 
  type UserStatsDto, 
  type ActivityDto 
} from "../../api/users.api";

/* =========================
   HELPERS
   ========================= */

// Mapowanie technicznych nazw zdarzeń na język polski
const label = (type: string): string =>
  ({
    "CartItemAdded":     "➕ Dodano do koszyka",
    "CartItemRemoved":   "🗑 Usunięto z koszyka",
    "OrderCreated":      "🛒 Złożono zamówienie",
    "RatingCreated":     "⭐ Oceniono produkt",
    "CommentAdded":      "💬 Skomentowano",
    
    // Fallbacki dla innych typów
    "ADD_TO_CART":       "➕ Dodano do koszyka",
    "PURCHASE":          "🛒 Złożono zamówienie",
    "RATING":            "⭐ Oceniono produkt",
    "COMMENT":           "💬 Skomentowano",
  }[type] ?? "Aktywność");

// Formatowanie daty ("5 min temu" lub data)
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

// Funkcja wyciągająca szczegóły (np. nazwę produktu) z pola dataJson
function getDetails(item: ActivityDto): string {
  if (!item.dataJson) return item.message || "";

  try {
    const data = JSON.parse(item.dataJson);

    // Jeśli to produkt w koszyku
    if (data.name) return data.name; 
    if (data.Name) return data.Name;

    // Jeśli to zamówienie (pokazujemy kwotę)
    if (data.total) return `Kwota: ${Number(data.total).toFixed(2)} zł`;

    // Jeśli to ocena
    if (data.value) return `Ocena: ${data.value}/5`;

    return item.message || "";
  } catch {
    // W razie błędu parsowania JSON, zwróć po prostu message
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

  // Dane do wizytówki (awatar, email)
  const email = user?.email ?? "user@local";
  const displayName = user?.login || email.split("@")[0];
  const letter = displayName[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    if (!user?.id) return;

    // 1. Pobieranie statystyk
    getUserStats(user.id)
      .then(setStats)
      .catch(() => setStats(null));

    // 2. Pobieranie aktywności
    getUserActivity(user.id)
      .then(res => {
        // Backend czasem zwraca obiekt { items: [] }, a czasem samą tablicę
        // Zabezpieczamy się na oba przypadki:
        const items = Array.isArray(res) ? res : ((res as any).items || []);
        
        // Sortujemy: najnowsze na górze
        const sorted = items.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Bierzemy tylko 5 ostatnich (zgodnie ze stylem Admina)
        setActivities(sorted.slice(0, 5));
      })
      .catch(err => {
         console.error("Błąd pobierania aktywności:", err);
      });
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
                    {/* Typ aktywności (np. Dodano do koszyka) */}
                    <span>{label(a.type)}</span>
                    {/* Czas (np. 5 min temu) */}
                    <span style={{ fontSize: 11, opacity: 0.5, fontWeight: 400 }}>
                      {timeAgo(a.createdAt)}
                    </span>
                  </div>
                  
                  {/* Szczegóły (np. nazwa produktu wyciągnięta z JSON) */}
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