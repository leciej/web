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

  if (!item) return <p>Ładowanie…</p>;

  return (
    <div>
      <h1>{item.title}</h1>
      <p>Autor: {item.artist}</p>
      <p>Cena: {item.price} zł</p>

      {rating && (
        <div>
          <p>Średnia: {rating.average}</p>
          <p>Głosy: {rating.votes}</p>
          {rating.myRating && <p>Twoja ocena: {rating.myRating}</p>}
        </div>
      )}

      {user && (
        <div>
          <p>Oceń:</p>
          {[1, 2, 3, 4, 5].map(v => (
            <button
              key={v}
              onClick={() =>
                rateGalleryItem(item.id, user.id, v).then(() =>
                  getGalleryRating(item.id, user.id).then(setRating)
                )
              }
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
