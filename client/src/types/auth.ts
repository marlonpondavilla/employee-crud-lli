export type UserRole = 'Admin' | 'User' | string;

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}