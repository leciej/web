import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useUser } from '../context/useUser';
import {
  getCart,
  removeFromCart,
  changeQuantity,
  type CartItemDto,
} from '../api/cart.api';

export default function CartPage() {
  const { user } = useUser();
  const [items, setItems] = useState<CartItemDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    getCart(user.id)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <p>Zaloguj się, aby zobaczyć koszyk</p>;
  if (loading) return <p>Ładowanie koszyka…</p>;
  if (!items.length) return <p>Koszyk pusty</p>;

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <div>
      <h1>Koszyk</h1>

      {items.map(item => (
        <div
          key={item.id}
          style={{ borderBottom: '1px solid #444', padding: 8 }}
        >
          <strong>{item.name}</strong><br />
          {item.price} zł × {item.quantity}

          <div>
            <button
              onClick={() =>
                changeQuantity(item.id, 1)
                  .then(() => getCart(user.id))
                  .then(setItems)
              }
            >
              +
            </button>

            <button
              onClick={() =>
                changeQuantity(item.id, -1)
                  .then(() => getCart(user.id))
                  .then(setItems)
              }
            >
              -
            </button>

            <button
              onClick={() =>
                removeFromCart(item.id)
                  .then(() => getCart(user.id))
                  .then(setItems)
              }
            >
              Usuń
            </button>
          </div>
        </div>
      ))}

      <h2>Suma: {total.toFixed(2)} zł</h2>

      <Link to="/checkout">
        <button>Przejdź do checkout</button>
      </Link>
    </div>
  );
}
