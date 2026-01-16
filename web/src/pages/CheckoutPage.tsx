import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkout } from '../api/checkout.api';
import { useUser } from '../context/useUser';

export default function CheckoutPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return <p>Zaloguj się, aby złożyć zamówienie</p>;

  if (done) {
    return (
      <div className="admin-block glass" style={{ textAlign: 'center', padding: '40px' }}>
        <h1>Zamówienie złożone ✅</h1>
        <button className="admin-action primary" onClick={() => navigate('/user/products')}>
          Wróć do sklepu
        </button>
      </div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      await checkout(user.id);
      setDone(true);
    } catch {
      setError('Błąd składania zamówienia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-root">
      <div className="admin-block glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '32px' }}>
        <h1>Finalizacja zamówienia</h1>
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        
        <button
          className="admin-action primary full"
          disabled={loading}
          onClick={handleCheckout}
        >
          {loading ? 'Przetwarzanie…' : 'Zatwierdź i zapłać'}
        </button>
      </div>
    </div>
  );
}