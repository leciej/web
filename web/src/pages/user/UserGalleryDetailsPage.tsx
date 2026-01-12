import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGallery } from "../../api/gallery.api";
import type { GalleryItemDto } from "../../api/gallery.api";
import { http } from "../../api/http";

/* =========================
   TYPES
========================= */

type RatingResponse = {
  average: number;
  votes: number;
  myRating: number | null;
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

  /* =========================
     LOAD ITEM
  ========================= */

  useEffect(() => {
    if (!id) return;

    getGallery()
      .then(items => {
        const found = items.find(i => i.id === id);
        if (!found) {
          alert("Nie znaleziono arcydzieła");
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

    http
      .get<RatingResponse>(`/gallery/${id}/ratings`)
      .then(res => setRating(res))
      .catch(() =>
        setRating({ average: 0, votes: 0, myRating: null })
      );
  }, [id]);

  /* =========================
     RATE
  ========================= */

  const rate = async (value: number) => {
    if (!id || rating.myRating !== null) return;

    try {
      await http.post(`/gallery/${id}/ratings`, { value });
      const refreshed = await http.get<RatingResponse>(
        `/gallery/${id}/ratings`
      );
      setRating(refreshed);
    } catch {
      alert("Nie udało się dodać oceny");
    }
  };

  /* =========================
     STARS
  ========================= */

  const renderStars = (active: number, clickable = false) =>
    [1, 2, 3, 4, 5].map(v => (
      <span
        key={v}
        onClick={clickable ? () => rate(v) : undefined}
        style={{
          fontSize: 30,
          cursor: clickable ? "pointer" : "default",
          color: v <= active ? "#facc15" : "#444",
          marginRight: 6,
        }}
      >
        ★
      </span>
    ));

  if (loading || !item) return null;

  return (
    <div className="admin-root">
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
          {/* BACK */}
          <button
            className="admin-action secondary"
            onClick={() => navigate("/user/gallery")}
          >
            ← Wróć
          </button>

          {/* TITLE – PRAWDZIWY ŚRODEK */}
          <div
            style={{
              textAlign: "center",
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: 0.5,
              color: "rgba(255,255,255,0.92)", // ⬅ jak na poprzedniej stronie
              userSelect: "none",
            }}
          >
            Szczegóły arcydzieła
          </div>

          {/* PUSTA KOLUMNA – BALANS */}
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
          onMouseEnter={() => setZoom(true)}
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
              style={{ width: "100%", padding: "16px 0" }}
            >
              DODAJ DO KOSZYKA
            </button>
          </div>

          {/* RATINGS */}
          <div className="admin-block glass" style={{ padding: 32 }}>
            <div style={{ marginBottom: 12 }}>
              {renderStars(Math.round(rating.average))}
            </div>

            <div style={{ opacity: 0.75 }}>
              {rating.average.toFixed(1)} / 5 ({rating.votes} ocen)
            </div>

            <div style={{ marginTop: 28, fontWeight: 700 }}>
              {rating.myRating
                ? `Twoja ocena: ${rating.myRating}/5`
                : "Oceń arcydzieło"}
            </div>

            <div style={{ marginTop: 14 }}>
              {renderStars(
                rating.myRating ?? 0,
                rating.myRating === null
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ZOOM OVERLAY */}
      {zoom && (
        <div
          onMouseLeave={() => setZoom(false)}
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
