import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  return (
    <div className="admin-root">
      <div className="admin-grid">
        <Link to="/admin/stats" className="admin-block">
          <h2>Statystyki</h2>
          <p>Sprzedaż, aktywność, wykresy</p>
        </Link>

        <Link to="/admin/products" className="admin-block">
          <h2>Produkty</h2>
          <p>Dodawanie i zarządzanie produktami</p>
        </Link>

        <Link to="/admin/gallery" className="admin-block">
          <h2>Galeria</h2>
          <p>Zarządzanie arcydziełami</p>
        </Link>

        <Link to="/admin/profile" className="admin-block">
          <h2>Profil</h2>
          <p>Ustawienia administratora</p>
        </Link>
      </div>
    </div>
  );
}