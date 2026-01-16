import { http } from '../http';

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

export interface OrdersChartDto {
  days: string[];
  orders: number[];
  revenue: number[];
}

export function getOrdersLast7Days() {
  return http.get<OrdersChartDto>('/api/stats/orders-last-7-days');
}

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

export function getUserStats(userId: number) {
  return http.get<UserStatsDto>(`/api/users/${userId}/stats`);
}

export function getUserActivity(userId: number) {
  return http.get<ActivityResponseDto>('/api/activity', { userId });
}