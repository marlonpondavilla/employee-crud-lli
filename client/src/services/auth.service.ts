import api from '../api/axios';
import type { AuthUser, LoginResponse } from '../types/auth';

export const loginRequest = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', { username, password });
  return data;
};

export const meRequest = async (): Promise<{ user: AuthUser }> => {
  const { data } = await api.get<{ user: AuthUser }>('/auth/me');
  return data;
};