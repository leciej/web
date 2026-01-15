// src/pages/admin/AdminLayout.tsx
import { Navigate, Outlet, NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { type User } from "../../api/users.api"; // Importujemy interfejs User

export default function AdminLayout() {
  // Rzutujemy kontekst na poprawny typ zawierający interfejs User
  const { user } = useUser() as { user: User | null };

  // Sprawdzamy rolę 'Admin' zamiast niebezpiecznego pola 'isAdmin'
  if (user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <header className="admin-topbar glass">
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className="admin-nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/admin/profile" className="admin-nav-link">
            Profil
          </NavLink>
          <NavLink to="/admin/products" className="admin-nav-link">
            Produkty
          </NavLink>
          <NavLink to="/admin/gallery" className="admin-nav-link">
            Galeria
          </NavLink>
          <NavLink to="/admin/stats" className="admin-nav-link">
            Statystyki
          </NavLink>
        </nav>
      </header>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}