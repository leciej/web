import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart } from "../../api/cart.api";

// Helper do ID
const getUserId = (): number | undefined => {
  const raw = localStorage.getItem("user");
  if (!raw) return undefined;
  try {
    const user = JSON.parse(raw);
    return typeof user.id === "number" ? user.id : undefined;
  } catch {
    return undefined;
  }
};

export default function UserDashboardPage() {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      const userId = getUserId();
      if (!userId) return;

      try {
        const items = await getCart(userId) as any[];
        
        if (Array.isArray(items)) {
          const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
          setCartCount(totalCount);
        }
      } catch (error) {
        console.error("Błąd pobierania licznika koszyka", error);
      }
    };

    fetchCartCount();
  }, []);

  return (
    <div className="admin-root">
      <div className="admin-grid">
        <Link to="/user/products" className="admin-block">
          <h2>Produkty</h2>
          <p>Przeglądaj dostępne produkty</p>
        </Link>

        <Link to="/user/gallery" className="admin-block">
          <h2>Arcydzieła</h2>
          <p>Galeria i dzieła artystów</p>
        </Link>

        <Link to="/user/cart" className="admin-block">
          {/* Kontener Flexbox dla Nagłówka i Badge'a */}
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center",       // Wyrównanie w pionie (środek)
              justifyContent: "center",   // Wyrównanie w poziomie (środek)
              gap: "12px",                // Odstęp między napisem a kółkiem
              marginBottom: "8px"         // Odstęp od dolnego opisu
            }}
          >
            {/* margin: 0 jest ważne, żeby domyślny styl h2 nie przesuwał tekstu */}
            <h2 style={{ margin: 0 }}>Koszyk</h2>

            {cartCount > 0 && (
              <span style={{
                background: "#2563eb",
                color: "white",
                padding: "2px 10px",      // Trochę zgrabniejszy padding
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "bold",
                lineHeight: "1.5",        // Poprawia centrowanie tekstu w kółku
                display: "inline-block"
              }}>
                {cartCount}
              </span>
            )}
          </div>
          <p>Twoje wybrane produkty</p>
        </Link>

        <Link to="/user/profile" className="admin-block">
          <h2>Profil</h2>
          <p>Twoje dane i aktywność</p>
        </Link>
      </div>
    </div>
  );
}