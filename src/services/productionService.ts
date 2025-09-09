import api from './api';
import { ProductionPlan } from '../types/production';

export const getProductionPlans = async (): Promise<ProductionPlan[]> => {
  try {
    const response = await api.get<ProductionPlan[]>('/productionPlans');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch production plans:', error);
    throw error;
  }
};
