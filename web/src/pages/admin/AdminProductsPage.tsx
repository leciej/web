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
  const [sortOpen, setSortOpen] = useState(false);

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

  const sortItems = (type: string) => {
    setItems(items => {
      const sorted = [...items];

      switch (type) {
        case "name-asc":
          sorted.sort((a, b) =>
            (a.name ?? "").localeCompare(b.name ?? "", "pl")
          );
          break;

        case "name-desc":
          sorted.sort((a, b) =>
            (b.name ?? "").localeCompare(a.name ?? "", "pl")
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

  if (loading) return <p>Ładowanie produktów…</p>;

  return (
    <div className="admin-root">
      {/* lokalny CSS */}
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
              onClick={() => navigate("/admin/dashboard")}
            >
              ← Wstecz
            </button>

            <Link to="/admin/products/add" className="admin-action primary">
              ➕ Dodaj produkt
            </Link>

            {/* SORT HAMBURGER */}
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
                    onClick={() => sortItems("name-asc")}
                  >
                    Nazwa A–Z
                  </button>
                  <button
                    className="sort-item"
                    onClick={() => sortItems("name-desc")}
                  >
                    Nazwa Z–A
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
