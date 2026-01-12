import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { http } from "../../api/http";

type Activity = {
  type: string;
  createdAt: number;
};

type UserStats = {
  purchasedCount: number;
  totalSpent: number;
  ratedCount: number;
  averageRating: number;
  commentsCount: number;
};

const isAdminType = (type: string) =>
  [
    "ADD_PRODUCT",
    "EDIT_PRODUCT",
    "REMOVE_PRODUCT",
    "ADD_GALLERY",
    "EDIT_GALLERY",
    "REMOVE_GALLERY",
  ].includes(type);

const label = (type: string) =>
  ({
    COMMENT: "💬 Dodano komentarz",
    RATING: "⭐ Dodano ocenę",
    PURCHASE: "🛒 Złożono zamówienie",
    ADD_TO_CART: "➕ Dodano do koszyka",
    REMOVE_FROM_CART: "🗑 Usunięto z koszyka",
  }[type] ?? "—");

function timeAgo(ts: number) {
  const min = Math.floor((Date.now() - ts) / 60000);
  if (min < 1) return "przed chwilą";
  if (min < 60) return `${min} min temu`;
  return `${Math.floor(min / 60)} h temu`;
}

export default function UserProfilePage() {
  const { user, logout } = useUser();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<UserStats>({
    purchasedCount: 0,
    totalSpent: 0,
    ratedCount: 0,
    averageRating: 0,
    commentsCount: 0,
  });

  useEffect(() => {
    if (!user) return;

    http
      .get<Activity[]>("/activity")
      .then(activities => {
        setActivities(
          activities.filter(a => !isAdminType(a.type))
        );
      })
      .catch(() => {
        setActivities([]);
      });

    http
      .get<UserStats>(`/users/${user.id}/stats`)
      .then(stats => {
        setStats(stats);
      })
      .catch(() => {
        setStats({
          purchasedCount: 0,
          totalSpent: 0,
          ratedCount: 0,
          averageRating: 0,
          commentsCount: 0,
        });
      });
  }, [user]);

  if (!user) return <p>Brak dostępu</p>;

  return (
    <div className="page-root">
      <h1>Profil</h1>

      <div className="grid-2">
        <div className="card">
          <h2>Ostatnia aktywność</h2>

          {activities.length === 0 ? (
            <p>Brak aktywności</p>
          ) : (
            activities.map((a, i) => (
              <div key={i}>
                {label(a.type)} – {timeAgo(a.createdAt)}
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2>Twoje statystyki</h2>
          <p>✅ Kupione: {stats.purchasedCount}</p>
          <p>
            💸 Wydane: {stats.totalSpent.toFixed(2)} zł
          </p>
          <p>⭐ Ocenione: {stats.ratedCount}</p>
          <p>
            ⭐ Średnia: {stats.averageRating.toFixed(1)}
          </p>
          <p>💬 Komentarze: {stats.commentsCount}</p>
        </div>
      </div>

      <button onClick={logout}>WYLOGUJ SIĘ</button>
    </div>
  );
}
