import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// Интерсептор подставляет токен из AsyncStorage **один раз перед запросом**
// (можно оптимизировать в будущем, сохраняя токен в React state)
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    console.log('Token for request:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('Failed to get token for request', e);
  }
  return config;
});

export default api;

