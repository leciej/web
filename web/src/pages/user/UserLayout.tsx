// src/pages/admin/AdminLayout.tsx

import { Navigate, Outlet, NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
// Importujemy interfejs User z Twojego pliku api
import { type User } from "../../api/users.api"; 

export default function AdminLayout() {
  const { user } = useUser() as { user: User | null }; // Rzutujemy kontekst na poprawny typ

  // Sprawdzamy rolę bez użycia 'any'
  // Dzięki importowi User, TS podpowiada teraz pola: id, login, email, role
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