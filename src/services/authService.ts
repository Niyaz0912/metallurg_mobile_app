import api from './api';
import { LoginData } from '../types/auth';

interface LoginResponse {
  token: string;
  // Add other user properties if the backend returns them
}

export const login = async (credentials: LoginData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/users/login', credentials);
  return response.data;
};
