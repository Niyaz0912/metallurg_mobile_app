// src/types/assignments.ts
export interface ShiftAssignment {
  id: number;
  taskNumber: string;
  productName: string;
  quantity: number;
  completedQuantity: number;
  priority: 'urgent' | 'normal' | 'low';
  deadline: string;
  shiftStart: string;
  shiftEnd: string;
  techCardId?: number;
  pdfUrl?: string;
  status: 'pending' | 'in_progress' | 'completed';
  customerName: string;
  orderName: string;
}

export interface TaskReport {
  assignmentId: number;
  completedQuantity: number;
  comment?: string;
  reportTime: string;
}
