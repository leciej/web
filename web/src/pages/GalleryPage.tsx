import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getGallery,
  type GalleryItemDto,
} from '../api/gallery.api';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGallery()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie galerii…</p>;

  return (
    <div>
      <h1>Arcydzieła</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {items.map(item => (
          <div key={item.id} style={{ border: '1px solid #444', padding: 12 }}>
            <h3>{item.title}</h3>
            <p>{item.artist}</p>
            <p>{item.price} zł</p>

            <Link to={`/gallery/${item.id}`}>Szczegóły</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
