import { http } from "./http";

/* ===== PLATFORM ===== */

export interface PlatformStatsDto {
  purchasedCount: number;
  totalSpent: number;
  ratedCount: number;
  averageRating: number;
  commentsCount: number;
  activitiesCount: number;
}

export function getPlatformStats() {
  return http.get<PlatformStatsDto>("/api/stats/platform");
}

/* ===== ORDERS CHART (LAST 7 DAYS) ===== */

export interface OrdersChartDto {
  days: string[];
  orders: number[];
  revenue: number[];
}

export function getOrdersLast7Days() {
  return http.get<OrdersChartDto>("/api/stats/orders-last-7-days");
}
