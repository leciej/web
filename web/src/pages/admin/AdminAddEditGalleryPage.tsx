import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
} from "../../api/gallery.api";
import type { CreateGalleryItemRequestDto } from "../../api/gallery.api";

export default function AdminAddEditGalleryPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  /* =========================
     LOAD (EDIT MODE)
     ========================= */
  useEffect(() => {
    if (!isEdit || !id) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const items = await getGallery();
        if (cancelled) return;

        const item = items.find(i => i.id === id);
        if (!item) {
          alert("Nie znaleziono arcydzieła");
          navigate(-1);
          return;
        }

        setTitle(item.title ?? "");
        setArtist(item.artist ?? "");
        setPrice(item.price != null ? String(item.price) : "");
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

  /* =========================
     IMAGE
     ========================= */
  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // preview TYLKO lokalnie
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // NIE ruszamy imageUrl (backend tego nie przyjmie)
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
  };

  /* =========================
     SAVE (BACKEND SAFE)
     ========================= */
  const save = async () => {
    if (!title.trim() || !artist.trim() || !price.trim()) {
      alert("Uzupełnij wszystkie pola");
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      alert("Cena jest nieprawidłowa");
      return;
    }

    try {
      const payload: CreateGalleryItemRequestDto = {
        title: title.trim(),
        artist: artist.trim(),
        price: numericPrice,
      };

      // imageUrl wysyłamy TYLKO jeśli to prawdziwy URL
      if (imageUrl && imageUrl.startsWith("http")) {
        payload.imageUrl = imageUrl.trim();
      }

      if (isEdit && id) {
        await updateGalleryItem(id, payload);
      } else {
        await createGalleryItem(payload);
      }

      navigate("/admin/gallery");
    } catch (err) {
      console.error(err);
      alert("Nie udało się zapisać arcydzieła");
    }
  };

  /* =========================
     UI
     ========================= */
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
          {isEdit ? "Edytuj arcydzieło" : "Dodaj arcydzieło"}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
          }}
        >
          {/* FORM */}
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
                  placeholder="Tytuł"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <input
                  className="form-input"
                  placeholder="Autor"
                  value={artist}
                  onChange={e => setArtist(e.target.value)}
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
                  onChange={e => handleImageUrlChange(e.target.value)}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={e =>
                    handleFileChange(e.target.files?.[0] ?? null)
                  }
                />
              </>
            )}
          </div>

          {/* PREVIEW */}
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
              {title || "Tytuł dzieła"}
            </div>

            <div style={{ fontSize: 13, opacity: 0.75 }}>
              {artist || "Autor"}
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
