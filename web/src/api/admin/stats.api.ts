import { http } from '../http';

export function getPlatformStats() {
  return http.get('/api/stats/platform');
}

export function getOrdersLast7Days() {
  return http.get('/api/stats/orders-last-7-days');
}
