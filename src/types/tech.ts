export interface TechCard {
  id: number;
  productName: string;
  description?: string;
  drawingUrl?: string;
  specifications?: string;
  productionStages?: string;
  createdAt: string;
  updatedAt: string;
  partNumber?: string;
  customer?: string;
  order?: string;
  quantity?: number;
  pdfUrl?: string;
  pdfFileSize?: number;
  totalProducedQuantity?: number;
  status?: string;
  priority?: string;
  plannedEndDate?: string;
  actualEndDate?: string;
  notes?: string;
  createdById?: number;
}
