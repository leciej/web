import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProducts,
  createProduct,
  updateProduct,
} from "../../api/products.api";
import type { CreateProductRequestDto } from "../../api/products.api";

import { emitActivity } from "../../features/activityStore";

export default function AdminAddEditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!isEdit || !id) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const items = await getProducts();
        if (cancelled) return;

        const item = items.find(p => p.id === id);
        if (!item) {
          alert("Nie znaleziono produktu");
          navigate(-1);
          return;
        }

        setName(item.name ?? "");
        setDescription(item.description ?? "");
        setPrice(String(item.price));
        setImageUrl(item.imageUrl ?? "");
        setPreviewUrl(item.imageUrl ?? "");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, isEdit, navigate]);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
  };

  const save = async () => {
    if (!name.trim() || !description.trim() || !price.trim()) {
      alert("Uzupełnij wszystkie pola");
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      alert("Nieprawidłowa cena");
      return;
    }

    const payload: CreateProductRequestDto = {
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
    };

    if (imageUrl && imageUrl.startsWith("http")) {
      payload.imageUrl = imageUrl.trim();
    }

    try {
      if (isEdit && id) {
        await updateProduct(id, payload);
        emitActivity("EDIT_PRODUCT");
      } else {
        await createProduct(payload);
        emitActivity("ADD_PRODUCT");
      }

      navigate("/admin/products");
    } catch {
      alert("Nie udało się zapisać produktu");
    }
  };

  return (
    <div className="admin-root">
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            textAlign: "center",
            color: "rgba(255,255,255,0.95)",
          }}
        >
          {isEdit ? "Edytuj produkt" : "Dodaj produkt"}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
          }}
        >
          <div
            className="admin-block glass"
            style={{
              minHeight: 420,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {loading ? (
              "Ładowanie…"
            ) : (
              <>
                <input
                  className="form-input"
                  placeholder="Nazwa produktu"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />

                <textarea
                  className="form-input"
                  placeholder="Opis produktu"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                />

                <input
                  className="form-input"
                  type="number"
                  placeholder="Cena"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />

                <input
                  className="form-input"
                  placeholder="URL obrazu"
                  value={imageUrl}
                  onChange={e =>
                    handleImageUrlChange(e.target.value)
                  }
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={e =>
                    handleFileChange(
                      e.target.files?.[0] ?? null
                    )
                  }
                />
              </>
            )}
          </div>

          <div
            className="admin-block glass"
            style={{
              minHeight: 420,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 220,
                borderRadius: 18,
                overflow: "hidden",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                opacity: 0.75,
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                "Brak obrazu"
              )}
            </div>

            <div style={{ fontWeight: 800, fontSize: 18 }}>
              {name || "Nazwa produktu"}
            </div>

            <div style={{ fontSize: 13, opacity: 0.75 }}>
              {description || "Opis produktu"}
            </div>

            {price && (
              <div style={{ marginTop: 6, fontWeight: 800 }}>
                {price} zł
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
          }}
        >
          <button
            className="admin-action secondary"
            onClick={() => navigate(-1)}
            style={{ minWidth: 160 }}
          >
            Anuluj
          </button>

          <button
            className="admin-action primary"
            onClick={save}
            style={{ minWidth: 160 }}
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
}