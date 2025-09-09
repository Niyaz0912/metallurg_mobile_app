import api from './api';
import { User } from '../types/auth';

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>('/api/users');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};
