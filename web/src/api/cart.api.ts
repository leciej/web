import { http } from './http';

// Interfejs dopasowany do Twojego CartController.cs:
// select new { cartItemId = c.Id, id = c.TargetId, ... }
export interface CartItemDto {
  cartItemId: string; // To jest GUID wiersza w koszyku (do usuwania)
  id: string;         // To jest ID produktu/obrazu (TargetId)
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  source?: string;    // "PRODUCTS" lub "GALLERY"
}

export function getCart(userId?: number) {
  // Backend: [HttpGet] public async Task<IActionResult> GetCart([FromQuery] int? userId, ...)
  return http.get<CartItemDto[]>('/api/cart', userId ? { userId } : undefined);
}

export function addToCart(productId: string, userId?: number) {
  // Backend: [HttpPost("add")] - wymaga quantity w body
  return http.post<void>('/api/cart/add', { 
    productId, 
    userId, 
    quantity: 1 
  });
}

export function changeQuantity(cartItemId: string, delta: number) {
  // Backend: [HttpPatch("{id:guid}/quantity")] - id to cartItemId
  return http.patch<void>(`/api/cart/${cartItemId}/quantity`, undefined, { delta });
}

export function removeFromCart(cartItemId: string) {
  // Backend: [HttpDelete("{id:guid}")] - id to cartItemId
  return http.delete<void>(`/api/cart/${cartItemId}`);
}

export function clearCart(userId?: number) {
  return http.delete<void>('/api/cart/clear', userId ? { userId } : undefined);
}