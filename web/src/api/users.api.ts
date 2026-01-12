import { http } from './http';

/* ========= DTO ========= */

export interface User {
  id: number;
  login?: string;
  email?: string;
  role?: 'Admin' | 'User';
}

/* ========= API ========= */

/* http.post<User>() ZWRACA User, NIE response */
export function createGuest(): Promise<User> {
  return http.post<User>('/api/users/guest');
}

export function login(
  loginOrEmail: string,
  password: string
): Promise<User> {
  return http.post<User>('/api/users/login', {
    loginOrEmail,
    password,
  });
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
