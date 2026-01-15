import { http } from "./http";

export interface CheckoutResponse {
  orderId: string;
  totalAmount: number;
}

export const checkout = (userId?: number) => {
  if (!userId) {
    return Promise.reject(new Error("Brak ID użytkownika"));
  }
  
  // Backend CheckoutController: [HttpPost] /api/checkout, Body: { userId }
  return http.post<CheckoutResponse>("/api/checkout", { userId });
};