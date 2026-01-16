import { http } from './http';

export interface User {
  id: number;
  login?: string;
  email?: string;
  role?: 'Admin' | 'User';
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
  dataJson?: string;
}

export interface ActivityResponseDto {
  items: ActivityDto[];
}

export function createGuest(): Promise<User> {
  return http.post<User>('/api/users/guest');
}

export function login(loginOrEmail: string, password: string): Promise<User> {
  return http.post<User>('/api/users/login', { loginOrEmail, password });
}

export function register(data: {
  name?: string;
  surname?: string;
  login?: string;
  email?: string;
  password?: string;
}): Promise<User> {
  return http.post<User>('/api/users/register', data);
}

export function getUserStats(userId: number) {
  return http.get<UserStatsDto>(`/api/users/${userId}/stats`);
}

export function getUserActivity(userId: number) {
  return http.get<ActivityResponseDto>(`/api/activity?userId=${userId}&viewerUserId=${userId}`);
}