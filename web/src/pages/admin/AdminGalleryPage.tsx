import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getGallery,
  deleteGalleryItem,
} from "../../api/gallery.api";
import type { GalleryItemDto } from "../../api/gallery.api";

import { emitActivity } from "../../features/activityStore";

export default function AdminGalleryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryItemDto[]>([]);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    getGallery().then(setItems);
  }, []);

  const handleDelete = async (item: GalleryItemDto) => {
    if (!confirm(`Usunąć „${item.title}”?`)) return;

    try {
      await deleteGalleryItem(item.id);
      emitActivity("REMOVE_GALLERY");

      setItems(items =>
        items.filter(i => i.id !== item.id)
      );
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć arcydzieła");
    }
  };

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
            padding: "24px 8px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 0.3,
              color: "rgba(255, 255, 255, 0.92)",
            }}
          >
            Arcydzieła
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <button
              className="admin-action secondary"
              style={{ height: 44, minWidth: 160 }}
              onClick={() => navigate("/admin/dashboard")}
            >
              ← Wstecz
            </button>

            <Link
              to="/admin/gallery/add"
              className="admin-action primary"
              style={{
                height: 44,
                minWidth: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ➕ Dodaj arcydzieło
            </Link>

            {/* ───────────── SORT HAMBURGER ───────────── */}
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
                    right: 0,
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
            className="admin-block glass"
            style={{
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* IMAGE */}
            <div
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
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* HOVER ACTIONS */}
            <div className="gallery-hover">
              <button
                className="hover-action edit"
                onClick={() =>
                  navigate(`/admin/gallery/edit/${item.id}`)
                }
              >
                ✏️ Edytuj
              </button>

              <button
                className="hover-action delete"
                onClick={() => handleDelete(item)}
              >
                🗑 Usuń
              </button>
            </div>

            {/* TEXT */}
            <div style={{ padding: "14px 8px 0" }}>
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
        .gallery-hover {
          position: absolute;
          inset: 0;
          border-radius: 16px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;

          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.55),
            rgba(0, 0, 0, 0.75)
          );

          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }

        .admin-block:hover .gallery-hover {
          opacity: 1;
          pointer-events: auto;
        }

        .hover-action {
          width: 140px;
          height: 40px;

          border-radius: 999px;
          border: none;

          font-size: 14px;
          font-weight: 700;
          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hover-action.edit {
          background: #f59e0b;
          color: #111;
        }

        .hover-action.delete {
          background: #ef4444;
          color: #fff;
        }

        .hover-action:hover {
          filter: brightness(1.05);
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
