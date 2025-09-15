import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginData } from '../types/auth';

interface LoginResponse {
  token: string;
  // можно добавить другие поля, если backend их возвращает
}

export const login = async (credentials: LoginData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/users/login', credentials);
  const token = response.data.token;

  // Сохраняем токен в AsyncStorage сразу после логина
  await AsyncStorage.setItem('userToken', token);

  return response.data;
};

