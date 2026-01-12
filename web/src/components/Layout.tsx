import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <header style={{ padding: 16, borderBottom: '1px solid #ccc' }}>
        <Link to="/products">Produkty</Link> |{' '}
        <Link to="/cart">Koszyk</Link>
      </header>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </>
  );
}
