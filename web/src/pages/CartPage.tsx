import { useState } from "react";
import { useNavigate } from "react-router-dom";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  checked: boolean;
};

export default function UserCart() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Cisza lasu",
      price: 180,
      image: "https://picsum.photos/100?2",
      quantity: 4,
      checked: true,
    },
    {
      id: 2,
      name: "Farby akwarelowe 12 kolorów",
      price: 24.9,
      image: "https://picsum.photos/100?1",
      quantity: 2,
      checked: true,
    },
  ]);

  const toggleAll = (checked: boolean) =>
    setItems(items.map(i => ({ ...i, checked })));

  const toggleOne = (id: number) =>
    setItems(items.map(i => (i.id === id ? { ...i, checked: !i.checked } : i)));

  const changeQty = (id: number, delta: number) =>
    setItems(items.map(i =>
      i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    ));

  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));

  const total = items
    .filter(i => i.checked)
    .reduce((s, i) => s + i.price * i.quantity, 0);

  const allChecked = items.length > 0 && items.every(i => i.checked);

  return (
    <div className="admin-root">
      {/* ===== NAGŁÓWEK NAD BLOKAMI ===== */}
      <h1 style={{ textAlign: "center", marginBottom: 36, fontWeight: 700 }}>
        Koszyk
      </h1>

      {/* ===== GRID: BLOKI WIĘKSZE ===== */}
      <div
        className="admin-grid"
        style={{
          gridTemplateColumns: "3.4fr 1.6fr", // lewy wyraźnie większy
          gap: 32,
          maxWidth: 1400,
          margin: "0 auto",
          alignItems: "stretch",
        }}
      >
        {/* ================= LEWY BLOK (WIĘKSZY + WYŻSZY) ================= */}
        <div
          className="admin-block glass"
          style={{
            minHeight: 540, // <— WYŻEJ (blok), a nie przyciski
            padding: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
              flexShrink: 0,
            }}
          >
            <input
              type="checkbox"
              checked={allChecked}
              onChange={e => toggleAll(e.target.checked)}
            />
            <span>Zaznacz wszystko</span>

            <button
              className="admin-action secondary"
              style={{ marginLeft: "auto" }}
              onClick={() => setItems(items.filter(i => !i.checked))}
            >
              Usuń zaznaczone
            </button>
          </div>

          {/* LISTA (SCROLL gdy dużo) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, overflow: "auto" }}>
            {items.map(item => (
              <div
                key={item.id}
                className="glass"
                style={{
                  display: "grid",
                  gridTemplateColumns: "24px 90px 1fr auto auto auto",
                  gap: 18,
                  alignItems: "center",
                  padding: 18,
                }}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleOne(item.id)}
                />

                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    objectFit: "cover",
                  }}
                />

                <div>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 13, opacity: 0.6 }}>
                    {item.price.toFixed(2)} zł / szt.
                  </div>
                </div>

                {/* ===== ILOŚĆ: MNIEJSZE PRZYCISKI, WIĘKSZE ZNAKI, RÓWNE WYŚRODKOWANIE ===== */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    className="admin-action"
                    style={{
                      width: 30,
                      height: 30,
                      padding: 0,
                      fontSize: 20,          // większy znak
                      lineHeight: "30px",
                      borderRadius: 10,
                    }}
                    onClick={() => changeQty(item.id, -1)}
                    aria-label="Zmniejsz ilość"
                  >
                    −
                  </button>

                  <div
                    style={{
                      width: 32,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {item.quantity}
                  </div>

                  <button
                    className="admin-action"
                    style={{
                      width: 30,
                      height: 30,
                      padding: 0,
                      fontSize: 20,          // większy znak
                      lineHeight: "30px",
                      borderRadius: 10,
                    }}
                    onClick={() => changeQty(item.id, 1)}
                    aria-label="Zwiększ ilość"
                  >
                    +
                  </button>
                </div>

                <div style={{ fontWeight: 600, minWidth: 110 }}>
                  {(item.price * item.quantity).toFixed(2)} zł
                </div>

                {/* USUŃ */}
                <button
                  className="admin-action danger"
                  style={{
                    width: 32,
                    height: 32,
                    padding: 0,
                    borderRadius: 10,
                    fontSize: 16,
                    lineHeight: "32px",
                  }}
                  onClick={() => removeItem(item.id)}
                  aria-label="Usuń produkt"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ================= PRAWY BLOK (WIĘKSZY + WIĘKSZY PADDING) ================= */}
        <div
          className="admin-block glass"
          style={{
            minHeight: 540,          // <— WYŻEJ (blok)
            padding: "40px 40px",    // <— WIĘCEJ ODDECHU od krawędzi
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <h3 style={{ margin: 0, textAlign: "center" }}>Podsumowanie</h3>

          <div style={{ textAlign: "center" }}>
            <div style={{ opacity: 0.85 }}>Razem</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>
              {total.toFixed(2)} zł
            </div>
          </div>

          <button
            className="admin-action"
            style={{
              width: "80%",
              margin: "0 auto",
              display: "block",
              background: "linear-gradient(135deg, #2ecc71, #27ae60)",
              color: "#fff",
              fontSize: 16,
              padding: "14px 0",  // normalna wysokość (nie powiększam przesadnie)
              borderRadius: 16,
            }}
          >
            ZAMÓW
          </button>

          <button
            className="admin-action secondary"
            style={{
              width: "80%",
              margin: "0 auto",
              display: "block",
              fontSize: 15,
              padding: "12px 0",
              borderRadius: 16,
            }}
            onClick={() => navigate(-1)}
          >
            ← Wróć
          </button>
        </div>
      </div>
    </div>
  );
}
