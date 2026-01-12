import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGallery } from "../../api/gallery.api";
import type { GalleryItemDto } from "../../api/gallery.api";

export default function AdminGalleryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryItemDto[]>([]);

  useEffect(() => {
    getGallery().then(setItems);
  }, []);

  const handleDelete = (item: GalleryItemDto) => {
    if (confirm(`Usunąć „${item.title}”?`)) {
      console.log("DELETE ITEM:", item.id);
      // TODO: wywołanie API delete
      // po sukcesie: setItems(items => items.filter(i => i.id !== item.id))
    }
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
        {/* ───────────── HEADER (VARIANT A) ───────────── */}
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
            </div>
          </div>
        ))}
      </div>

      {/* ───────────── STYLES (HOVER) ───────────── */}
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
      `}</style>
    </div>
  );
}
