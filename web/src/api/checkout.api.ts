import { http } from './http';

export function checkout(userId?: number) {
  return http.post<void>('/api/checkout', { userId });
}
