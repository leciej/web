import { http } from './http';

export interface CartItemDto {
  cartItemId: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  source?: string;
}

export function getCart(userId?: number) {
  return http.get<CartItemDto[]>('/api/cart', userId ? { userId } : undefined);
}

export function addToCart(productId: string, userId?: number) {
  return http.post<void>('/api/cart/add', { 
    productId, 
    userId, 
    quantity: 1 
  });
}

export function changeQuantity(cartItemId: string, delta: number) {
  return http.patch<void>(`/api/cart/${cartItemId}/quantity`, undefined, { delta });
}

export function removeFromCart(cartItemId: string) {
  return http.delete<void>(`/api/cart/${cartItemId}`);
}

export function clearCart(userId?: number) {
  return http.delete<void>('/api/cart/clear', userId ? { userId } : undefined);
}