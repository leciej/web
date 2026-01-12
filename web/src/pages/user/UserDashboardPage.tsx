import { Link } from "react-router-dom";

export default function UserDashboardPage() {
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
          <h2>Koszyk</h2>
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
