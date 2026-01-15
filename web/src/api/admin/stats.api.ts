import { http } from '../http';

/* =========================================
   ===== ADMIN / PLATFORM STATS =====
   ========================================= */

export interface PlatformStatsDto {
  purchasedCount: number;
  totalSpent: number;
  ratedCount: number;
  averageRating: number;
  commentsCount: number;
  activitiesCount: number;
}

export function getPlatformStats() {
  return http.get<PlatformStatsDto>('/api/stats/platform');
}

/* ===== ORDERS CHART (LAST 7 DAYS) ===== */

export interface OrdersChartDto {
  days: string[];
  orders: number[];
  revenue: number[];
}

export function getOrdersLast7Days() {
  return http.get<OrdersChartDto>('/api/stats/orders-last-7-days');
}

/* =========================================
   ===== USER STATS & ACTIVITY (DODANE) =====
   ========================================= */

export interface UserStatsDto {
  purchasedCount: number;
  totalSpent: number;
  ratedCount: number;
  averageRating: number;
  commentsCount: number;
}

export interface ActivityDto {
  type: string;
  createdAt: string;
  targetType?: string;
  message?: string;
}

export interface ActivityResponseDto {
  items: ActivityDto[];
}

// Statystyki konkretnego usera
export function getUserStats(userId: number) {
  return http.get<UserStatsDto>(`/api/users/${userId}/stats`);
}

// Aktywność konkretnego usera
export function getUserActivity(userId: number) {
  return http.get<ActivityResponseDto>('/api/activity', { userId });
}