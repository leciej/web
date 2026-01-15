import { http } from './http';

/* =========================================
   DTO (Auth & User)
   ========================================= */

export interface User {
  id: number;
  login?: string;
  email?: string;
  role?: 'Admin' | 'User';
}

/* =========================================
   DTO (Profile Stats & Activity)
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
  dataJson?: string; // Tutaj są szczegóły (np. nazwa produktu)
}

// Backend zwraca PagedResult, więc musimy obsłużyć pole 'items'
export interface ActivityResponseDto {
  items: ActivityDto[];
}

/* =========================================
   API (Authentication)
   ========================================= */

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

/* =========================================
   API (Profile & Stats)
   ========================================= */

// Pobieranie statystyk użytkownika
export function getUserStats(userId: number) {
  return http.get<UserStatsDto>(`/api/users/${userId}/stats`);
}

// Pobieranie historii aktywności
export function getUserActivity(userId: number) {
  // 🔥 KLUCZOWE: Dodajemy viewerUserId=${userId}, aby ominąć błąd 401
  return http.get<ActivityResponseDto>(`/api/activity?userId=${userId}&viewerUserId=${userId}`);
}