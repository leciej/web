import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGallery, type GalleryItemDto } from "../api/gallery.api";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGallery()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie galerii…</p>;

  return (
    <div className="admin-root">
      <div className="admin-block glass" style={{ padding: "32px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "32px" }}>Arcydzieła</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="admin-block" style={{ padding: "20px", background: "rgba(255,255,255,0.05)" }}>
              <h3 style={{ margin: "0 0 8px 0" }}>{item.title}</h3>
              <p style={{ opacity: 0.7, fontSize: "14px" }}>{item.artist}</p>
              <div style={{ margin: "16px 0", fontSize: "18px", fontWeight: 800, color: "#4ade80" }}>
                {item.price.toFixed(2)} zł
              </div>

              <Link to={`/user/gallery/${item.id}`} className="admin-action secondary full" style={{ textAlign: "center", textDecoration: "none" }}>
                Szczegóły
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}