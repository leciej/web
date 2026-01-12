
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts, type ProductDto } from "../../api/products.api";

export default function UserProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getProducts()
      .then(items => {
        const found = items.find(p => p.id === id);
        setProduct(found ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Ładowanie…</p>;
  if (!product) return <p>Nie znaleziono produktu</p>;

  return (
    <div className="admin-root">
      <div className="admin-block glass" style={{ maxWidth: 800, margin: "0 auto" }}>
        <button
          className="admin-action secondary"
          onClick={() => navigate(-1)}
        >
          ← Wróć
        </button>

        <h1>{product.name}</h1>

        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: "100%", borderRadius: 16, marginBottom: 16 }}
          />
        )}

        {product.description && <p>{product.description}</p>}

        <h3>{product.price} zł</h3>
      </div>
    </div>
  );
}
