import { http } from './http';

export interface CartItemDto {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

export function getCart(userId?: number) {
  return http.get<CartItemDto[]>('/api/cart', userId ? { userId } : undefined);
}

export function addToCart(productId: string, userId?: number) {
  return http.post<void>('/api/cart/add', { productId, userId });
}

export function changeQuantity(id: string, delta: number) {
  return http.patch<void>(`/api/cart/${id}/quantity`, undefined, { delta });
}

export function removeFromCart(id: string) {
  return http.delete<void>(`/api/cart/${id}`);
}

export function clearCart(userId?: number) {
  return http.delete<void>('/api/cart/clear', userId ? { userId } : undefined);
}
