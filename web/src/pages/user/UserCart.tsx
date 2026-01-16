import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getCart,
  addToCart,
  changeQuantity,
  removeFromCart,
} from '../../api/cart.api';
import { checkout } from '../../api/checkout.api';

interface RawCartItem {
  cartItemId?: string;
  CartItemId?: string;
  id?: string;
  Id?: string;
  targetId?: string;
  TargetId?: string;
  name?: string;
  Name?: string;
  price?: number;
  Price?: number;
  quantity?: number;
  Quantity?: number;
  imageUrl?: string | null;
  ImageUrl?: string | null;
}

interface CartItemFull {
  cartItemId: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

const FALLBACK_IMAGE = 'https://picsum.photos/200/200?blur=1';

const formatPrice = (value: number): string =>
  value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const getUserId = (): number | undefined => {
  const raw = localStorage.getItem("user");
  if (!raw) return undefined;
  try {
    const user = JSON.parse(raw);
    return typeof user.id === "number" ? user.id : undefined;
  } catch {
    return undefined;
  }
};

export default function UserCart() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItemFull[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const loadCart = useCallback(async (): Promise<void> => {
    const userId = getUserId();
    if (!userId) return;
    
    try {
      const rawData = (await getCart(userId)) as RawCartItem[];
      
      if (!Array.isArray(rawData)) {
         setItems([]);
         return;
      }

      const mappedData: CartItemFull[] = rawData.map(item => ({
        cartItemId: String(item.cartItemId || item.CartItemId || item.id || item.Id), 
        id: String(item.id || item.Id || item.targetId || item.TargetId), 
        name: item.name || item.Name || "Produkt bez nazwy",
        price: item.price || item.Price || 0,
        quantity: item.quantity || item.Quantity || 1,
        imageUrl: item.imageUrl || item.ImageUrl || null
      }));

      setItems(mappedData);

      setChecked(prev => {
        const next: Record<string, boolean> = {};
        mappedData.forEach((item) => {
          if (item.id) next[item.id] = prev[item.id] ?? true;
        });
        return next;
      });
    } catch (error) {
      console.error("Błąd ładowania koszyka:", error);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const allChecked = items.length > 0 && items.every((item) => checked[item.id]);

  const toggleAll = () => {
    const next: Record<string, boolean> = {};
    items.forEach(item => next[item.id] = !allChecked);
    setChecked(next);
  };

  const toggleOne = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const total = items.reduce((sum, item) => 
    checked[item.id] ? sum + item.price * item.quantity : sum, 0
  );

  const onAdd = async (productId: string) => {
    await addToCart(productId, getUserId());
    await loadCart();
  };

  const onDecrease = async (cartItemId: string) => {
    await changeQuantity(cartItemId, -1);
    await loadCart();
  };

  const onRemove = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
    await loadCart();
  };

  const removeSelected = async () => {
    const toRemove = items.filter(item => checked[item.id]);
    await Promise.all(toRemove.map(item => removeFromCart(item.cartItemId)));
    setChecked({});
    await loadCart();
  };

  const order = async () => {
    if (total === 0) return alert('Nie zaznaczono produktów');
    try {
      setLoading(true);
      await checkout(getUserId());
      setChecked({});
      await loadCart();
      alert('Zamówienie złożone pomyślnie!');
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Nie udało się złożyć zamówienia";
      alert(`Błąd: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const btnStyle: React.CSSProperties = {
      width: 32, height: 32, borderRadius: 8, border: 'none', 
      background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
      transition: 'background 0.2s'
  };

  return (
    <div className="admin-root" style={{ paddingTop: 40, paddingBottom: 80, minHeight: '100vh' }}>
      
      <div 
        className="admin-grid" 
        style={{ 
          display: 'grid',
          gridTemplateColumns: '3fr 1.2fr', 
          gap: 32, 
          maxWidth: 1400, 
          margin: '0 auto',
          alignItems: 'start'
        }}
      >
        
        <div 
          className="admin-block glass" 
          style={{ 
            padding: 32, 
            minHeight: 300, 
            height: 'auto', 
            overflow: 'visible' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 24 }}>Twój koszyk <span style={{opacity: 0.5, fontSize: 18}}>({items.length})</span></h3>
            
            {items.length > 0 && (
              <button 
                onClick={removeSelected} 
                style={{ 
                  background: 'transparent', border: 'none', color: '#f87171', 
                  cursor: 'pointer', fontSize: 14, fontWeight: 600, opacity: 0.9
                }}
              >
                Usuń zaznaczone
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', opacity: 0.6, padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
              Twój koszyk jest pusty.
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16, paddingLeft: 8 }}>
                <label style={{ display: 'flex', gap: 10, cursor: 'pointer', fontSize: 14, opacity: 0.8 }}>
                  <input 
                    type="checkbox" 
                    checked={allChecked} 
                    onChange={toggleAll} 
                    style={{cursor: 'pointer', width: 16, height: 16 }} 
                  /> 
                  Zaznacz wszystkie produkty
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {items.map((item) => (
                  <div 
                    key={item.cartItemId} 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '30px 80px 1fr 120px 120px 40px', 
                      alignItems: 'center', 
                      gap: 20, 
                      padding: '16px', 
                      borderRadius: 16, 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'background 0.2s'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={checked[item.id] || false} 
                      onChange={() => toggleOne(item.id)} 
                      style={{cursor: 'pointer', width: 18, height: 18 }} 
                    />
                    
                    <img 
                      src={item.imageUrl || FALLBACK_IMAGE} 
                      alt={item.name} 
                      style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} 
                    />
                    
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.name}</div>
                      <div style={{ opacity: 0.6, fontSize: 13 }}>Cena jedn.: {formatPrice(item.price)} zł</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: 10, width: 'fit-content' }}>
                      <button 
                        style={{...btnStyle, width: 24, height: 24, fontSize: 16, background: 'transparent'}} 
                        disabled={item.quantity === 1} 
                        onClick={() => onDecrease(item.cartItemId)}
                      >
                        −
                      </button>
                      <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button 
                        style={{...btnStyle, width: 24, height: 24, fontSize: 16, background: 'transparent'}} 
                        onClick={() => onAdd(item.id)}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ fontWeight: 800, textAlign: 'right', fontSize: 18, color: '#fff' }}>
                      {formatPrice(item.price * item.quantity)} <span style={{fontSize: 12, fontWeight: 400}}>zł</span>
                    </div>
                    
                    <button 
                      onClick={() => onRemove(item.cartItemId)} 
                      style={{ 
                        ...btnStyle, 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        color: '#f87171' 
                      }}
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div 
          className="admin-block glass" 
          style={{ 
            padding: 32,
            position: 'sticky', 
            top: 24,
            height: 'fit-content',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <h3 style={{ textAlign: 'center', marginBottom: 24, fontSize: 22 }}>Podsumowanie</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, opacity: 0.7 }}>
            <span>Wartość produktów:</span>
            <span>{formatPrice(total)} zł</span>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 20 }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>Do zapłaty:</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#4ade80', lineHeight: 1 }}>{formatPrice(total)} <small style={{fontSize: 16}}>zł</small></span>
          </div>
          
          <button 
            disabled={total === 0 || loading} 
            onClick={order} 
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #22c55e, #16a34a)', 
              color: '#fff', 
              padding: '16px', 
              borderRadius: 12, 
              border: 'none', 
              cursor: 'pointer', 
              opacity: total === 0 || loading ? 0.6 : 1, 
              fontSize: 16, 
              fontWeight: 700, 
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
            }}
          >
            {loading ? 'Przetwarzanie...' : 'ZAMÓW'}
          </button>
          
          <button 
            onClick={() => navigate(-1)} 
            style={{ 
              marginTop: 12,
              width: '100%', 
              padding: 12, 
              borderRadius: 12, 
              border: '1px solid rgba(255,255,255,0.15)', 
              cursor: 'pointer', 
              background: 'transparent', 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: 14,
            }}
          >
            Kontynuuj zakupy
          </button>
        </div>

      </div>
    </div>
  );
}