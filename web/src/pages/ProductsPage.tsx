import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getProducts,
  type ProductDto,
} from '../api/products.api';

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
    <div>
      <h1>Produkty</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {items.map(item => (
          <div
            key={item.id}
            style={{
              border: '1px solid #444',
              padding: 12,
            }}
          >
            <h3>{item.name}</h3>

            {item.description && (
              <p>{item.description}</p>
            )}

            <p>{item.price} zł</p>

            <Link to={`/products/${item.id}`}>
              Szczegóły
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
