import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  type ProductDto,
} from "../../api/products.api";

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Usunąć produkt?")) return;

    await deleteProduct(id);
    setItems(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <p>Ładowanie produktów…</p>;

  return (
    <div className="admin-root">
      {/* lokalny CSS: pokazuje overlay na hover */}
      <style>{`
        .product-tile .product-actions {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease;
        }
        .product-tile:hover .product-actions {
          opacity: 1;
          pointer-events: auto;
        }
      `}</style>

      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 24,
        }}
      >
        {/* HEADER */}
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
              color: "rgba(255,255,255,0.95)",
            }}
          >
            Produkty
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <button
              className="admin-action secondary"
              onClick={() => navigate(-1)}
            >
              ← Wstecz
            </button>

            <Link to="/admin/products/add" className="admin-action primary">
              ➕ Dodaj produkt
            </Link>
          </div>
        </div>

        {/* GRID */}
        {items.map(item => (
          <div
            key={item.id}
            className="admin-block glass product-tile"
            style={{
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 160,
                overflow: "hidden",
                borderRadius: 16,
                marginBottom: 10,
              }}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    opacity: 0.7,
                  }}
                >
                  Brak obrazu
                </div>
              )}
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700 }}>{item.name}</div>

              {item.description && (
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.7,
                    marginTop: 2,
                  }}
                >
                  {item.description}
                </div>
              )}

              <div style={{ marginTop: 6, fontWeight: 800 }}>
                {item.price} zł
              </div>
            </div>

            {/* HOVER ACTIONS */}
            <div
              className="product-actions"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(0,0,0,0.25)",
                backdropFilter: "blur(2px)",
              }}
            >
              <Link
                to={`/admin/products/edit/${item.id}`}
                style={{
                  width: 140,
                  height: 44,
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  background: "#f59e0b",
                  color: "#111",
                }}
              >
                ✏️ Edytuj
              </Link>

              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  width: 140,
                  height: 44,
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 800,
                  background: "#ef4444",
                  color: "#fff",
                }}
              >
                🗑 Usuń
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
