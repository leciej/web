import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, type ProductDto } from "../../api/products.api";
// 1. Import API
import { addToCart } from "../../api/cart.api";

// 2. Helper do pobierania ID użytkownika
const getUserId = (): number | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    return typeof user.id === "number" ? user.id : null;
  } catch {
    return null;
  }
};

export default function UserProductsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);

  // Opcjonalnie: blokada przycisku, żeby nie klikać 10 razy
  const [addingId, setAddingId] = useState<string | null>(null);

  // === 3. STAN TOASTA ===
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    getProducts()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

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

  // 4. LOGIKA DODAWANIA DO KOSZYKA (z Toastem)
  const handleAddToCart = async (item: ProductDto) => {
    const userId = getUserId();
    if (!userId) {
      showToast("Musisz być zalogowany, aby dodać do koszyka");
      return;
    }

    try {
      setAddingId(item.id);
      await addToCart(item.id, userId);
      showToast(`Dodano "${item.name}" do koszyka ✅`);
    } catch (error) {
      console.error(error);
      showToast("Błąd podczas dodawania do koszyka");
    } finally {
      setAddingId(null);
    }
  };

  if (loading) return <p>Ładowanie produktów…</p>;

  return (
    <div className="admin-root">
      {/* TOAST UI */}
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

      <style>{`
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

        /* ===== GRID ===== */
        .products-grid {
          max-width: 1920px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 32px;
          align-items: stretch;
        }

        @media (min-width: 1800px) {
          .products-grid {
            grid-template-columns: repeat(7, 1fr);
          }
        }

        @media (max-width: 1400px) {
          .products-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        @media (max-width: 1100px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ===== CARD ===== */
        .product-card {
          display: flex;
          flex-direction: column;
          padding: 18px;
          height: 100%;
        }

        .product-image {
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 12px;
          flex-shrink: 0;
        }

        .product-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: center;
        }

        .product-name {
          font-weight: 700;
          font-size: 15px;
          line-height: 1.25;
        }

        .product-description {
          font-size: 12px;
          opacity: 0.7;
          margin-top: 4px;
          line-height: 1.3;
        }

        .product-price {
          margin-top: 8px;
          font-weight: 800;
          font-size: 15px;
        }

        .add-to-cart {
          margin-top: auto;
          margin-top: 14px;
          width: 100%;
          background: #2e7d32;
          color: #fff;
          border: none;
          padding: 10px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .add-to-cart:disabled {
          opacity: 0.6;
          cursor: default;
        }
      `}</style>

      <div className="products-grid">
        {/* HEADER */}
        <div
          style={{
            gridColumn: "1 / -1",
            padding: "32px 8px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: 0.3,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            Produkty
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <button
              className="admin-action secondary"
              style={{ minWidth: 140 }}
              onClick={() => navigate("/user/dashboard")}
            >
              ← Wstecz
            </button>

            <div style={{ position: "relative" }}>
              <button
                className="admin-action secondary"
                style={{
                  height: 42,
                  width: 42,
                  padding: 0,
                  fontSize: 18,
                  fontWeight: 900,
                  lineHeight: 1,
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
                    zIndex: 20,
                  }}
                >
                  <button className="sort-item" onClick={() => sortItems("name-asc")}>
                    Nazwa A–Z
                  </button>
                  <button className="sort-item" onClick={() => sortItems("name-desc")}>
                    Nazwa Z–A
                  </button>
                  <button className="sort-item" onClick={() => sortItems("price-asc")}>
                    Cena ↑
                  </button>
                  <button className="sort-item" onClick={() => sortItems("price-desc")}>
                    Cena ↓
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        {items.map(item => (
          <div
            key={item.id}
            className="admin-block glass product-card"
          >
            <Link
              to={`/user/products/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="product-image">
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

              <div className="product-content">
                <div className="product-name">
                  {item.name}
                </div>

                {!!item.description && (
                  <div className="product-description">
                    {item.description}
                  </div>
                )}

                <div className="product-price">
                  {item.price} zł
                </div>
              </div>
            </Link>

            <button
              className="add-to-cart"
              disabled={addingId === item.id}
              onClick={() => handleAddToCart(item)}
            >
              {addingId === item.id ? "Dodawanie..." : "Dodaj do koszyka"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}