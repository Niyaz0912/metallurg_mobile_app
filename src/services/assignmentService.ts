import api from './api';
import { ShiftAssignment } from '../types/assignments';

export const getAssignments = async (): Promise<ShiftAssignment[]> => {
  try {
    const response = await api.get<ShiftAssignment[]>('/assignments');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assignments:', error);
    throw error;
  }
};
