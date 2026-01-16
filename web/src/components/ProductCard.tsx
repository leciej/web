import { Link } from 'react-router-dom';
import type { ProductDto } from '../api/products.api';

export default function ProductCard({ product }: { product: ProductDto }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 16 }}>
      <h3>{product.name}</h3>
      <p>{product.price} zł</p>
      <Link to={`/products/${product.id}`}>Szczegóły</Link>
    </div>
  );
}