import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getCart,
  addToCart,
  changeQuantity,
  removeFromCart,
  clearCart,
} from '../api/cart.api';
import type { CartItemDto } from '../api/cart.api';
import { checkout } from '../api/checkout.api';

const FALLBACK_IMAGE = 'https://picsum.photos/200/200?blur=1';

const formatPrice = (value: number): string =>
  value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const getUserId = (): number | undefined => undefined;

export default function CartPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItemDto[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const loadCart = useCallback(async (): Promise<void> => {
    const userId = getUserId();
    const data: CartItemDto[] = await getCart(userId);

    setItems(data);

    setChecked(prev => {
      const next: Record<string, boolean> = {};
      data.forEach((item: CartItemDto) => {
        next[item.id] = prev[item.id] ?? true;
      });
      return next;
    });
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const allChecked: boolean =
    items.length > 0 &&
    items.every((item: CartItemDto) => checked[item.id]);

  const toggleAll = (): void => {
    const next: Record<string, boolean> = {};
    items.forEach((item: CartItemDto) => {
      next[item.id] = !allChecked;
    });
    setChecked(next);
  };

  const toggleOne = (id: string): void => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const total: number = items.reduce(
    (sum: number, item: CartItemDto) =>
      checked[item.id]
        ? sum + item.price * item.quantity
        : sum,
    0
  );

  const onAdd = async (productId: string): Promise<void> => {
    await addToCart(productId, getUserId());
    await loadCart();
  };

  const onDecrease = async (id: string): Promise<void> => {
    await changeQuantity(id, -1);
    await loadCart();
  };

  const onRemove = async (id: string): Promise<void> => {
    await removeFromCart(id);
    await loadCart();
  };

  const removeSelected = async (): Promise<void> => {
    const toRemove: CartItemDto[] = items.filter(
      (item: CartItemDto) => checked[item.id]
    );

    await Promise.all(
      toRemove.map((item: CartItemDto) =>
        removeFromCart(item.id)
      )
    );

    setChecked({});
    await loadCart();
  };

  const order = async (): Promise<void> => {
    if (total === 0) {
      alert('Nie zaznaczono produktów');
      return;
    }

    try {
      setLoading(true);
      await checkout(getUserId());
      await clearCart(getUserId());
      setChecked({});
      await loadCart();
      alert('Zamówienie złożone');
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Błąd zamówienia';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const qtyButtonStyle: React.CSSProperties = {
    width: 30,
    height: 30,
    borderRadius: 10,
    border: 'none',
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1,
  };

  return (
    <div className="admin-root">
      <h1 style={{ textAlign: 'center', marginBottom: 36, fontWeight: 700 }}>
        Koszyk
      </h1>

      <div
        className="admin-grid"
        style={{
          gridTemplateColumns: '3.4fr 1.6fr',
          gap: 32,
          maxWidth: 1400,
          margin: '0 auto',
        }}
      >
        <div className="admin-block glass" style={{ padding: 28 }}>
          <h3>Produkty w koszyku</h3>

          {items.length > 0 && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
              <label style={{ display: 'flex', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                />
                Zaznacz wszystko
              </label>

              <button
                onClick={removeSelected}
                style={{
                  marginLeft: 'auto',
                  padding: '8px 14px',
                  borderRadius: 14,
                  border: 'none',
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Usuń zaznaczone
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map((item: CartItemDto) => (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '28px 88px 1fr 150px 110px 40px',
                  alignItems: 'center',
                  gap: 16,
                  padding: '18px 20px',
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <input
                  type="checkbox"
                  checked={checked[item.id]}
                  onChange={() => toggleOne(item.id)}
                />

                <img
                  src={item.imageUrl || FALLBACK_IMAGE}
                  alt={item.name}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 14,
                    objectFit: 'cover',
                  }}
                />

                <div>
                  <div style={{ fontWeight: 700 }}>{item.name}</div>
                  <div style={{ opacity: 0.6 }}>
                    {formatPrice(item.price)} zł / szt.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    style={qtyButtonStyle}
                    disabled={item.quantity === 1}
                    onClick={() => onDecrease(item.id)}
                  >
                    −
                  </button>

                  <span style={{ fontWeight: 700 }}>{item.quantity}</span>

                  <button
                    style={qtyButtonStyle}
                    onClick={() => onAdd(item.id)}
                  >
                    +
                  </button>
                </div>

                <div style={{ fontWeight: 800, textAlign: 'right' }}>
                  {formatPrice(item.price * item.quantity)} zł
                </div>

                <button
                  onClick={() => onRemove(item.id)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: 'none',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-block glass" style={{ padding: 40 }}>
          <h3 style={{ textAlign: 'center' }}>Podsumowanie</h3>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div>Razem</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>
              {formatPrice(total)} zł
            </div>
          </div>

          <button
            disabled={total === 0 || loading}
            onClick={order}
            style={{
              width: '80%',
              margin: '0 auto',
              display: 'block',
              background:
                'linear-gradient(135deg, #2ecc71, #27ae60)',
              color: '#fff',
              padding: 14,
              borderRadius: 16,
              border: 'none',
              cursor: 'pointer',
              opacity: total === 0 || loading ? 0.5 : 1,
            }}
          >
            ZAMÓW
          </button>

          <button
            onClick={() => navigate(-1)}
            style={{
              width: '80%',
              margin: '16px auto 0',
              display: 'block',
              padding: 12,
              borderRadius: 16,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ← Wróć
          </button>
        </div>
      </div>
    </div>
  );
}