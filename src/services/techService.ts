import api from './api';
import { TechCard } from '../types/tech';

export const getTechCards = async (): Promise<TechCard[]> => {
  try {
    const response = await api.get<TechCard[]>('/api/techcards');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tech cards:', error);
    throw error;
  }
};
