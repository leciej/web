import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, type ProductDto } from '../api/products.api';

export default function ProductsPage() {
  const [items, setItems] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie produktów…</p>;

  return (
    <div className="admin-root">
      <div className="admin-block glass" style={{ padding: 32 }}>
        <h1 style={{ marginBottom: 24 }}>Produkty</h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {items.map(item => (
            <div
              key={item.id}
              className="admin-block"
              style={{
                padding: 16,
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>{item.name}</h3>
                {item.description && (
                  <p style={{ opacity: 0.7, fontSize: 14, lineHeight: 1.4 }}>
                    {item.description}
                  </p>
                )}
                <p style={{ fontWeight: 800, margin: '12px 0' }}>
                  {item.price.toFixed(2)} zł
                </p>
              </div>

              <Link 
                to={`/admin/products/${item.id}`} 
                className="admin-action secondary full"
                style={{ textAlign: 'center', textDecoration: 'none' }}
              >
                Szczegóły
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}