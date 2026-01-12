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

  if (!user) {
    return <p>Zaloguj się, aby złożyć zamówienie</p>;
  }

  if (done) {
    return (
      <div>
        <h1>Zamówienie złożone ✅</h1>
        <button onClick={() => navigate('/products')}>
          Wróć do sklepu
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>

      {error && <p>{error}</p>}

      <button
        disabled={loading}
        onClick={() => {
          setLoading(true);
          setError(null);

          checkout(user.id)
            .then(() => setDone(true))
            .catch(() => setError('Błąd składania zamówienia'))
            .finally(() => setLoading(false));
        }}
      >
        {loading ? 'Przetwarzanie…' : 'Złóż zamówienie'}
      </button>
    </div>
  );
}
