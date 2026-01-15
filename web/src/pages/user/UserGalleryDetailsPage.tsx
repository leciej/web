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

// === FIX: Funkcja pomocnicza ===
// Tylko pobiera dane i zwraca Promise. NIE używa hooków ani setState.
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

  const [rating, setRating] = useState<RatingResponse>({
    average: 0,
    votes: 0,
    myRating: null,
  });

  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
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
      LOAD RATINGS (NAPRAWIONE)
  ========================= */

  useEffect(() => {
    if (!id) return;

    // Pobieramy dane funkcją pomocniczą, a setState robimy dopiero w .then()
    // To jest bezpieczne dla Reacta i nie powoduje błędów lintera.
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
      RATE
  ========================= */

  const rate = async (value: number) => {
    if (!id || rating.myRating !== null) return;

    const userId = getCurrentUserId();
    if (!userId) {
      showToast("Musisz być zalogowany, aby ocenić");
      return;
    }

    // 1. Wysyłamy ocenę
    await http.post(`/api/gallery/${id}/ratings`, {
      userId,
      value,
    });

    // 2. Ustawiamy lokalnie gwiazdkę (UX)
    setJustRated(value);
    showToast(`Dziękujemy za ocenę ⭐ ${value}/5`);

    // 3. Pobieramy świeże średnie z backendu używając funkcji pomocniczej
    const newData = await fetchRatingsData(id);
    setRating(newData); 
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
                Dziękujemy za ocenę ⭐ ({justRated ?? rating.myRating}/5)
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