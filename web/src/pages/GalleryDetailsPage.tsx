import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/useUser';
import {
  getGalleryItem,
  getGalleryRating,
  rateGalleryItem,
  type GalleryItemDto,
  type GalleryRatingSummaryDto,
} from '../api/gallery.api';

export default function GalleryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();

  const [item, setItem] = useState<GalleryItemDto | null>(null);
  const [rating, setRating] = useState<GalleryRatingSummaryDto | null>(null);

  useEffect(() => {
    if (!id) return;

    getGalleryItem(id).then(setItem);
    getGalleryRating(id, user?.id).then(setRating);
  }, [id, user]);

  const handleRate = async (value: number) => {
    if (!id || !user) return;
    try {
      await rateGalleryItem(id, user.id, value);
      const updatedRating = await getGalleryRating(id, user.id);
      setRating(updatedRating);
    } catch (error) {
      console.error("Błąd podczas oceniania:", error);
    }
  };

  if (!item) return <p>Ładowanie…</p>;

  return (
    <div className="admin-root">
      <div className="admin-block glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
        <h1>{item.title}</h1>
        <p style={{ opacity: 0.8 }}>Autor: {item.artist}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ade80' }}>
          {item.price.toFixed(2)} zł
        </p>

        {rating && (
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <p>Średnia ocena: <strong>{rating.average.toFixed(1)} / 5</strong></p>
            <p>Liczba głosów: {rating.votes}</p>
            {rating.myRating && (
              <p style={{ color: '#60a5fa' }}>Twoja ocena: <strong>{rating.myRating}</strong></p>
            )}
          </div>
        )}

        {user && (
          <div style={{ marginTop: '24px' }}>
            <p>Wystaw ocenę:</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  className="admin-action secondary"
                  style={{ width: '44px', height: '44px', padding: 0 }}
                  onClick={() => handleRate(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}