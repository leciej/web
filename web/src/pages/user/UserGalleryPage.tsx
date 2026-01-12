import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGallery } from "../../api/gallery.api";
import type { GalleryItemDto } from "../../api/gallery.api";

export default function UserGalleryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryItemDto[]>([]);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    getGallery().then(setItems);
  }, []);

  const sortItems = (type: string) => {
    setItems(items => {
      const sorted = [...items];

      switch (type) {
        case "title-asc":
          sorted.sort((a, b) =>
            (a.title ?? "").localeCompare(b.title ?? "", "pl")
          );
          break;

        case "title-desc":
          sorted.sort((a, b) =>
            (b.title ?? "").localeCompare(a.title ?? "", "pl")
          );
          break;

        case "price-asc":
          sorted.sort((a, b) => a.price - b.price);
          break;

        case "price-desc":
          sorted.sort((a, b) => b.price - a.price);
          break;
      }

      return sorted;
    });

    setSortOpen(false);
  };

  return (
    <div className="admin-root">
      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 24,
        }}
      >
        {/* ───────────── HEADER ───────────── */}
        <div
          style={{
            gridColumn: "1 / -1",
            padding: "28px 8px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          {/* TITLE */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 0.4,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            Arcydzieła
          </div>

          {/* BUTTONS – WYŚRODKOWANE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            {/* BACK */}
            <button
              className="admin-action secondary"
              style={{ height: 44, minWidth: 160 }}
              onClick={() => navigate("/user/dashboard")}
            >
              ← Wstecz
            </button>

            {/* SORT */}
            <div style={{ position: "relative" }}>
              <button
                className="admin-action secondary"
                style={{
                  height: 44,
                  width: 44,
                  fontSize: 22,
                  padding: 0,
                }}
                onClick={() => setSortOpen(o => !o)}
              >
                ☰
              </button>

              {sortOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: 52,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(20,20,20,0.95)",
                    borderRadius: 12,
                    padding: 8,
                    minWidth: 200,
                    boxShadow: "0 10px 30px rgba(0,0,0,.4)",
                    zIndex: 20,
                  }}
                >
                  <button
                    className="sort-item"
                    onClick={() => sortItems("title-asc")}
                  >
                    Tytuł A–Z
                  </button>
                  <button
                    className="sort-item"
                    onClick={() => sortItems("title-desc")}
                  >
                    Tytuł Z–A
                  </button>
                  <button
                    className="sort-item"
                    onClick={() => sortItems("price-asc")}
                  >
                    Cena ↑
                  </button>
                  <button
                    className="sort-item"
                    onClick={() => sortItems("price-desc")}
                  >
                    Cena ↓
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ───────────── GALLERY ───────────── */}
        {items.map(item => (
          <div
            key={item.id}
            className="admin-block glass user-gallery-tile"
            style={{
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() =>
              navigate(`/user/gallery/${item.id}`)
            }
          >
            {/* IMAGE */}
            <div
              className="user-gallery-image"
              style={{
                width: "100%",
                height: 180,
                overflow: "hidden",
                borderRadius: 16,
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="user-gallery-img"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* TEXT */}
            <div style={{ padding: "14px 8px 0", textAlign: "center" }}>
              <div style={{ fontWeight: 700 }}>
                {item.title}
              </div>

              <div
                style={{
                  fontSize: 13,
                  opacity: 0.7,
                  marginTop: 2,
                }}
              >
                {item.artist}
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                {item.price.toFixed(2)} zł
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ───────────── STYLES ───────────── */}
      <style>{`
        .user-gallery-tile {
          transition: transform .18s ease, box-shadow .18s ease;
        }

        .user-gallery-tile:hover {
          transform: translateY(-2px);
          box-shadow:
            0 12px 30px rgba(0,0,0,.35),
            0 0 0 1px rgba(255,255,255,.06);
        }

        .user-gallery-img {
          transition: transform .35s ease;
        }

        .user-gallery-tile:hover .user-gallery-img {
          transform: scale(1.06);
        }

        .user-gallery-image::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(
            180deg,
            transparent 60%,
            rgba(0,0,0,.25)
          );
          opacity: 0;
          transition: opacity .2s ease;
          pointer-events: none;
        }

        .user-gallery-tile:hover .user-gallery-image::after {
          opacity: 1;
        }

        .sort-item {
          width: 100%;
          padding: 10px 14px;
          border: none;
          background: transparent;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
          border-radius: 8px;
          cursor: pointer;
        }

        .sort-item:hover {
          background: rgba(255,255,255,0.08);
        }
      `}</style>
    </div>
  );
}
