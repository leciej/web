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
    setItems(items.map(i =>
      i.id === id ? { ...i, checked: !i.checked } : i
    ));

  const changeQty = (id: number, delta: number) =>
    setItems(items.map(i =>
      i.id === id
        ? { ...i, quantity: Math.max(1, i.quantity + delta) }
        : i
    ));

  const removeItem = (id: number) =>
    setItems(items.filter(i => i.id !== id));

  const total = items
    .filter(i => i.checked)
    .reduce((s, i) => s + i.price * i.quantity, 0);

  const allChecked = items.length > 0 && items.every(i => i.checked);

  const qtyButtonStyle: React.CSSProperties = {
    width: 30,
    height: 30,
    borderRadius: 10,
    border: "none",
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1,
  };

  return (
    <div className="admin-root">
      <h1 style={{ textAlign: "center", marginBottom: 36, fontWeight: 700 }}>
        Koszyk
      </h1>

      <div
        className="admin-grid"
        style={{
          gridTemplateColumns: "3.4fr 1.6fr",
          gap: 32,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div
          className="admin-block glass"
          style={{
            minHeight: 540,
            padding: 28,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0" }}>Produkty w koszyku</h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <input
              type="checkbox"
              checked={allChecked}
              onChange={e => toggleAll(e.target.checked)}
              style={{ transform: "scale(1.1)" }}
            />
            <span>Zaznacz wszystko</span>

            <button
              onClick={() => setItems(items.filter(i => !i.checked))}
              style={{
                marginLeft: "auto",
                padding: "8px 14px",
                borderRadius: 14,
                border: "none",
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Usuń zaznaczone
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              overflow: "auto",
            }}
          >
            {items.map(item => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "28px 88px 1fr 150px 110px 40px",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 20px",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleOne(item.id)}
                  style={{ transform: "scale(1.1)" }}
                />

                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 14,
                    objectFit: "cover",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                  }}
                />

                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      opacity: 0.6,
                      marginTop: 4,
                    }}
                  >
                    {item.price.toFixed(2)} zł / szt.
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 12px",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(6px)",
                    justifyContent: "center",
                  }}
                >
                  <button
                    style={qtyButtonStyle}
                    onClick={() => changeQty(item.id, -1)}
                  >
                    −
                  </button>

                  <span
                    style={{
                      fontWeight: 700,
                      width: 22,
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </span>

                  <button
                    style={qtyButtonStyle}
                    onClick={() => changeQty(item.id, 1)}
                  >
                    +
                  </button>
                </div>

                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                    textAlign: "right",
                  }}
                >
                  {(item.price * item.quantity).toFixed(2)} zł
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: "none",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          className="admin-block glass"
          style={{
            minHeight: 540,
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <h3 style={{ margin: 0, textAlign: "center" }}>Podsumowanie</h3>

          <div style={{ textAlign: "center" }}>
            <div style={{ opacity: 0.85 }}>Razem</div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                marginTop: 8,
              }}
            >
              {total.toFixed(2)} zł
            </div>
          </div>

          <button
            style={{
              width: "80%",
              margin: "0 auto",
              background:
                "linear-gradient(135deg, #2ecc71, #27ae60)",
              color: "#fff",
              fontSize: 16,
              padding: "14px 0",
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
            }}
          >
            ZAMÓW
          </button>

          <button
            onClick={() => navigate(-1)}
            style={{
              width: "80%",
              margin: "0 auto",
              padding: "12px 0",
              borderRadius: 16,
              border: "none",
              background: "rgba(255,255,255,0.85)",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            ← Wróć
          </button>
        </div>
      </div>
    </div>
  );
}
