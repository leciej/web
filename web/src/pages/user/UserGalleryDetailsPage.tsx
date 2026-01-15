import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGallery } from "../../api/gallery.api";
import type { GalleryItemDto } from "../../api/gallery.api";
import { http } from "../../api/http";
import { addToCart } from "../../api/cart.api"; 

/* =========================
   TYPES
========================= */

type RatingResponse = {
  average: number;
  votes: number;
  myRating: number | null;
};

/* =========================
   HELPERS
========================= */

const getCurrentUserId = (): number | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    const user = JSON.parse(raw);
    return typeof user.id === "number" ? user.id : null;
  } catch {
    return null;
  }
};

const fetchRatingsData = async (galleryId: string) => {
  const userId = getCurrentUserId();
  const url = userId
    ? `/api/gallery/${galleryId}/ratings?userId=${userId}`
    : `/api/gallery/${galleryId}/ratings`;

  return http.get<RatingResponse>(url);
};

/* =========================
   COMPONENT
========================= */

export default function UserGalleryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<GalleryItemDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(false);

  // Stan ocen
  const [rating, setRating] = useState<RatingResponse>({
    average: 0,
    votes: 0,
    myRating: null,
  });

  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  
  // justRated trzymamy tylko dla efektu wizualnego "Twoja ocena" w tekście
  const [justRated, setJustRated] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const currentUserId = getCurrentUserId();

  /* =========================
       LOAD ITEM
  ========================= */

  useEffect(() => {
    if (!id) return;

    getGallery()
      .then((items) => {
        const found = items.find((i) => i.id === id);
        if (!found) {
          navigate("/user/gallery");
          return;
        }
        setItem(found);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  /* =========================
       LOAD RATINGS
  ========================= */

  useEffect(() => {
    if (!id) return;
    fetchRatingsData(id).then((data) => {
      setRating(data);
      setJustRated(null);
    });
  }, [id]);

  /* =========================
       TOAST
  ========================= */

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  /* =========================
       CART
  ========================= */

  const handleAddToCart = async () => {
    if (!item) return;

    const userId = getCurrentUserId();
    if (!userId) {
      showToast("Musisz być zalogowany, aby dodać do koszyka");
      return;
    }

    try {
      await addToCart(item.id, userId);
      showToast(`Dodano "${item.title}" do koszyka 🛒`);
    } catch (error) {
      console.error(error);
      showToast("Nie udało się dodać do koszyka");
    }
  };

  /* =========================
       RATE (POPRAWIONE)
  ========================= */

  const rate = async (value: number) => {
    if (!id || rating.myRating !== null) return;

    const userId = getCurrentUserId();
    if (!userId) {
      showToast("Musisz być zalogowany, aby ocenić");
      return;
    }

    // 1. Ustawiamy stan "justRated" dla UX
    setJustRated(value);

    try {
      // 2. Wysyłamy request
      await http.post(`/api/gallery/${id}/ratings`, {
        userId,
        value,
      });

      showToast(`Dziękujemy za ocenę ⭐ ${value}/5`);

      // 🔥 KLUCZOWA POPRAWKA: Ręczna aktualizacja stanu lokalnego (Optimistic Update)
      // Dzięki temu gwiazdki zablokują się natychmiast, a licznik głosów wzrośnie o 1.
      setRating((prev) => ({
        ...prev,
        myRating: value,        // Ustawiamy, że użytkownik już ocenił
        votes: prev.votes + 1,  // Dodajemy głos do licznika
        // Średniej 'average' nie ruszamy ręcznie, bo to skomplikowana matematyka.
        // Zaktualizuje się ona chwilę później po fetchu.
      }));

      // 3. Pobieramy świeże dane z backendu (dla pewności, żeby wyrównać średnią)
      // Dodajemy małe opóźnienie (300ms), żeby baza danych zdążyła przeliczyć średnią
      setTimeout(() => {
        fetchRatingsData(id).then(newData => {
           setRating(newData);
        });
      }, 300);

    } catch (error) {
      console.error(error);
      showToast("Błąd podczas oceniania");
      setJustRated(null); // Cofamy w razie błędu
    }
  };

  /* =========================
       STARS
  ========================= */

  const renderStars = (active: number, clickable = false) =>
    [1, 2, 3, 4, 5].map((v) => {
      const isActive =
        clickable && hoveredStar !== null
          ? v <= hoveredStar
          : v <= active;

      return (
        <span
          key={v}
          onMouseEnter={clickable ? () => setHoveredStar(v) : undefined}
          onMouseLeave={clickable ? () => setHoveredStar(null) : undefined}
          onClick={clickable ? () => rate(v) : undefined}
          style={{
            fontSize: 30,
            cursor: clickable ? "pointer" : "default",
            color: isActive ? "#facc15" : "#444",
            marginRight: 6,
            transition: "color .15s ease",
          }}
        >
          ★
        </span>
      );
    });

  if (loading || !item) return null;

  return (
    <div className="admin-root">
      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            background: "#2563eb",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 12,
            fontWeight: 600,
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        {/* HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <button
            className="admin-action secondary"
            onClick={() => navigate("/user/gallery")}
          >
            ← Wróć
          </button>

          <div
            style={{
              textAlign: "center",
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: 0.5,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            Szczegóły arcydzieła
          </div>

          <div />
        </div>

        {/* IMAGE */}
        <div
          className="admin-block glass"
          style={{
            padding: 0,
            marginBottom: 44,
            overflow: "hidden",
            cursor: "zoom-in",
          }}
          onClick={() => setZoom(true)}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{
              width: "100%",
              height: 760,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* INFO + RATINGS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 32,
          }}
        >
          {/* INFO */}
          <div className="admin-block glass" style={{ padding: 32 }}>
            <div style={{ fontSize: 32, fontWeight: 800 }}>
              {item.title}
            </div>

            <div style={{ opacity: 0.7, marginBottom: 16 }}>
              {item.artist}
            </div>

            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#60a5fa",
                marginBottom: 26,
              }}
            >
              {item.price.toFixed(2)} zł
            </div>

            <button
              className="admin-action primary"
              style={{ 
                width: "100%", 
                padding: "16px 0",
                opacity: currentUserId ? 1 : 0.7 
              }}
              onClick={handleAddToCart}
            >
              {currentUserId ? "DODAJ DO KOSZYKA" : "ZALOGUJ SIĘ ABY KUPIĆ"}
            </button>
          </div>

          {/* RATINGS */}
          <div className="admin-block glass" style={{ padding: 32 }}>
            {/* ŚREDNIA */}
            <div style={{ marginBottom: 12 }}>
              {renderStars(Math.round(rating.average))}
            </div>

            <div style={{ opacity: 0.75 }}>
              {rating.average.toFixed(1)} / 5 ({rating.votes} ocen)
            </div>

            {/* TWOJA OCENA */}
            <div style={{ marginTop: 28, fontWeight: 700 }}>
              Twoja ocena
            </div>

            <div style={{ marginTop: 14 }}>
              {/* Jeśli rating.myRating jest ustawione (przez fetch lub ręcznie w rate()), gwiazdki nie są klikalne */}
              {renderStars(
                rating.myRating ?? justRated ?? 0,
                rating.myRating === null
              )}
            </div>

            {(rating.myRating !== null || justRated !== null) && (
              <div
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  color: "#2563eb",
                }}
              >
                Dziękujemy za ocenę ⭐ ({rating.myRating ?? justRated}/5)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ZOOM */}
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{
              maxWidth: "1920px",
              maxHeight: "1080px",
              width: "90%",
              height: "auto",
              objectFit: "contain",
              boxShadow: "0 30px 120px rgba(0,0,0,.8)",
            }}
          />
        </div>
      )}
    </div>
  );
}