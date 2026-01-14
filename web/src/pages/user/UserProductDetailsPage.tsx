import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProducts, type ProductDto } from "../../api/products.api";
import { addToCart } from "../../api/cart.api";
import {
  getProductComments,
  addComment,
  type CommentDto,
} from "../../api/comments.api";

/* ================= utils ================= */

function formatRelativeDate(dateString: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );

  if (diff < 60) return "przed chwilą";
  if (diff < 3600) return `${Math.floor(diff / 60)} min temu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} godz. temu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} dni temu`;

  return new Date(dateString).toLocaleDateString("pl-PL");
}

const getUserId = (): number | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    const user = JSON.parse(raw);
    return typeof user.id === "number" ? user.id : null;
  } catch {
    return null;
  }
};

/* ================= component ================= */

export default function UserProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const userId = useMemo(() => getUserId(), []);

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [addingCart, setAddingCart] = useState(false);
  const [addingComment, setAddingComment] = useState(false);

  /* ================= data ================= */

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    Promise.all([
      getProducts().then(
        (products) =>
          products.find((p) => p.id === id) ?? null
      ),
      getProductComments(id),
    ]).then(([product, comments]) => {
      if (cancelled) return;

      setProduct(product);
      setComments(comments);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ================= handlers ================= */

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingCart(true);
    await addToCart(product.id);
    setAddingCart(false);
    navigate("/user/cart");
  };

  const handleAddComment = async () => {
    if (!userId || !commentText.trim() || !id) return;

    setAddingComment(true);
    const newComment = await addComment(
      id,
      userId,
      commentText.trim()
    );
    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
    setAddingComment(false);
  };

  /* ================= render ================= */

  if (loading) return <p>Ładowanie…</p>;
  if (!product) return <p>Nie znaleziono produktu</p>;

  return (
    <div className="admin-root">
      <div
        style={{
          maxWidth: 1700,
          margin: "0 auto",
          padding: 40,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: 48,
          }}
        >
          {/* IMAGE */}
<div
  className="admin-block glass"
  style={{
    padding: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 520,
  }}
>
  <img
    src={product.imageUrl}
    alt={product.name}
    style={{
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
      borderRadius: 24,
    }}
  />
</div>


          {/* INFO + ADD TO CART */}
<div
  className="admin-block glass"
  style={{
    padding: 36,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 520,
  }}
>
  {/* TEXT */}
  <div>
    <h1
      style={{
        fontSize: 34,
        marginBottom: 10,
        lineHeight: 1.15,
      }}
    >
      {product.name}
    </h1>

    <p
      style={{
        fontSize: 16,
        opacity: 0.8,
        lineHeight: 1.45,
        marginBottom: 24,
      }}
    >
      {product.description}
    </p>
  </div>

  {/* PRICE + CTA */}
  <div>
    <div
      style={{
        fontSize: 30,
        fontWeight: 800,
        marginBottom: 16,
      }}
    >
      {product.price} zł
    </div>

    <button
  onClick={handleAddToCart}
  disabled={addingCart}
  style={{
    width: "calc(100% + 32px)",   // ⬅️ SZERSZY niż content
    marginLeft: -16,              // ⬅️ wyjście poza padding
    padding: "20px 0",
    borderRadius: 24,
    border: "none",
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: 0.5,
    color: "#fff",
    background: "linear-gradient(135deg,#2ecc71,#27ae60)",
    cursor: addingCart ? "default" : "pointer",
    opacity: addingCart ? 0.6 : 1,
    transition: "transform .12s ease",
  }}
  onMouseDown={(e) =>
    !addingCart && (e.currentTarget.style.transform = "scale(0.96)")
  }
  onMouseUp={(e) =>
    (e.currentTarget.style.transform = "scale(1)")
  }
>
  {addingCart ? "Dodawanie…" : "DODAJ DO KOSZYKA"}
</button>

  </div>
</div>


          {/* COMMENTS */}
<div
  className="admin-block glass"
  style={{
    padding: 36,
    minHeight: 520,
    maxHeight: 520,
    display: "flex",
    flexDirection: "column",
  }}
>
  {/* HEADER */}
  <h2
    style={{
      fontSize: 28,
      textAlign: "center",
      marginBottom: 20,
    }}
  >
    Komentarze ({comments.length})
  </h2>

  {/* SCROLL CONTAINER */}
  <div
    style={{
      flex: 1,
      overflowY: "auto",
      paddingRight: 8,
      display: "flex",
      flexDirection: "column",
      gap: 12,                // spacing bez marginów
      scrollPaddingTop: 8,
    }}
  >
    {comments.length === 0 && (
      <p
        style={{
          opacity: 0.6,
          textAlign: "center",
          marginTop: 40,
        }}
      >
        Brak komentarzy
      </p>
    )}

    {comments.map((c) => (
      <div
        key={c.id}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.25)",
          borderRadius: 18,
          padding: "14px 20px",
        }}
      >
        {/* META */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 13,
            opacity: 0.7,
            marginBottom: 6,
          }}
        >
          <strong>{c.author ?? "Gość"}</strong>
          <span>{formatRelativeDate(c.createdAt)}</span>
        </div>

        {/* TEXT */}
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.4,
            maxWidth: "100%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "anywhere", // ⬅️ KLUCZ: łamanie długich ciągów
          }}
        >
          {c.text}
        </div>
      </div>
    ))}
  </div>
</div>


          {/* ADD COMMENT */}
<div
  className="admin-block glass"
  style={{
    padding: 36,
    minHeight: 520,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
>
  {/* FORM */}
  <div>
    <h2
      style={{
        fontSize: 28,
        textAlign: "center",
        marginBottom: 20,
      }}
    >
      Dodaj komentarz
    </h2>

    <textarea
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      disabled={!userId}
      placeholder={
        userId
          ? "Napisz komentarz…"
          : "Zaloguj się, aby dodać komentarz"
      }
      style={{
        width: "100%",
        minHeight: 140,
        padding: "16px 18px",
        fontSize: 15,
        lineHeight: 1.4,
        borderRadius: 18,
        border: "none",
        resize: "vertical",
        background: "rgba(255,255,255,0.25)",
        color: "#fff",
        outline: "none",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      }}
    />

    <button
      onClick={handleAddComment}
      disabled={!userId || addingComment || !commentText.trim()}
      style={{
        width: "calc(100% + 32px)", // ⬅️ wizualnie szerszy
        marginLeft: -16,
        marginTop: 18,
        padding: "18px 0",
        borderRadius: 22,
        border: "none",
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: 0.5,
        color: "#fff",
        background: "#2196f3",
        cursor:
          !userId || addingComment || !commentText.trim()
            ? "default"
            : "pointer",
        opacity:
          !userId || addingComment || !commentText.trim()
            ? 0.6
            : 1,
        transition: "transform .12s ease",
      }}
      onMouseDown={(e) =>
        !addingComment &&
        commentText.trim() &&
        (e.currentTarget.style.transform = "scale(0.96)")
      }
      onMouseUp={(e) =>
        (e.currentTarget.style.transform = "scale(1)")
      }
    >
      {addingComment ? "Dodawanie…" : "DODAJ KOMENTARZ"}
    </button>
  </div>

  {/* BACK */}
  <button
  onClick={() => navigate(-1)}
  style={{
    width: "100%",
    padding: "14px 0",
    borderRadius: 999, // ⬅️ pill
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    color: "#111",
    background: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    transition: "background .15s ease, transform .12s ease",
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.background = "rgba(255,255,255,1)")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.background = "rgba(255,255,255,0.9)")
  }
  onMouseDown={(e) =>
    (e.currentTarget.style.transform = "scale(0.97)")
  }
  onMouseUp={(e) =>
    (e.currentTarget.style.transform = "scale(1)")
  }
>
  ← Wróć
</button>

</div>

        </div>
      </div>
    </div>
  );
}
