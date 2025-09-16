import api from './api';
import { User } from '../types/auth';

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

// ИСПРАВЛЕННАЯ ФУНКЦИЯ: Получение полного профиля текущего пользователя
export const getCurrentUserProfile = async (): Promise<User> => {
  try {
    console.log('🔍 Fetching current user profile...');
    const response = await api.get('/api/users/me');
    console.log('📋 Raw API response:', response.data);
    
    // ✅ ИСПРАВЛЕНИЕ: Сервер возвращает { user: {...} }
    if (response.data.user) {
      console.log('✅ User data extracted from response:', response.data.user);
      return response.data.user;
    } else {
      console.error('❌ No user field in response:', response.data);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('❌ Failed to fetch current user profile:', error);
    throw error;
  }
};

// АЛЬТЕРНАТИВНАЯ ФУНКЦИЯ: Получение профиля по ID (если нужна)
export const getUserProfile = async (userId: number): Promise<User> => {
  try {
    console.log(`🔍 Fetching user profile for userId: ${userId}`);
    const response = await api.get(`/api/users/${userId}/profile`);
    console.log('📋 User profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch user profile for userId ${userId}:`, error);
    throw error;
  }
};
