import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api/products.api";
import type { ProductDto } from "../api/products.api";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDto | null>(null);

  useEffect(() => {
    if (id) {
      getProduct(id).then(setProduct);
    }
  }, [id]);

  if (!product) return <p>Ładowanie…</p>;

  return (
    <div className="admin-root">
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <h1 style={{ color: "#fff" }}>{product.name}</h1>

        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: "100%",
              maxHeight: 360,
              objectFit: "cover",
              borderRadius: 16,
            }}
          />
        )}

        <p style={{ color: "#ddd" }}>{product.description}</p>

        <p style={{ fontWeight: 800, color: "#fff" }}>{product.price} zł</p>

        <div style={{ display: "flex", gap: 16 }}>
          <button className="admin-action secondary" onClick={() => navigate(-1)}>
            Wróć
          </button>

          <button
            className="admin-action primary"
            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
          >
            Edytuj
          </button>
        </div>
      </div>
    </div>
  );
}