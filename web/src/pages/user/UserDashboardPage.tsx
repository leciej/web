import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart } from "../../api/cart.api";

interface CartItem {
  id: string | number;
  quantity: number;
}

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

export default function UserDashboardPage() {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      const userId = getUserId();
      if (!userId) return;

      try {
        const items = await getCart(userId) as CartItem[];
        
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
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "12px", 
              marginBottom: "8px" 
            }}
          >
            <h2 style={{ margin: 0 }}>Koszyk</h2>

            {cartCount > 0 && (
              <span style={{
                background: "#2563eb",
                color: "white",
                padding: "2px 10px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "bold",
                lineHeight: "1.5",
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