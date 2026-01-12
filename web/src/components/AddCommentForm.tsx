import { useState } from 'react';
import { addComment } from '../api/comments.api';

export default function AddCommentForm({
  productId,
}: {
  productId: string;
}) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (text.trim().length < 3) {
      setError('Komentarz musi mieć co najmniej 3 znaki');
      return;
    }

    try {
      await addComment(productId, 1, text); // userId = 1 (guest)
      setSuccess(true);
      setText('');
      setError('');
    } catch {
      setError('Błąd zapisu komentarza');
    }
  };

  return (
    <form onSubmit={submit}>
      <h3>Dodaj komentarz</h3>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <br />

      <button type="submit">Zapisz</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Zapisano</p>}
    </form>
  );
}
