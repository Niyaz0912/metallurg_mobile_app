// Описание ролей пользователей
export enum UserRole {
  EMPLOYEE = 'employee',
  MASTER = 'master',
  DIRECTOR = 'director',
  ADMIN = 'admin'
}

// Описание департамента
export interface Department {
  id: number;
  name: string;
  description?: string;
}

// Описание пользователя
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  position?: string;
  phone?: string;
  departmentId?: number;  // ✅ Поле для связи с департаментом
  department?: Department | null;  // ✅ Полная информация о департаменте
}

// Данные для авторизации
export interface LoginData {
  username: string;
  password: string;
}

// Ответ сервера при авторизации
export interface LoginResponse {
  token: string;
  user: User;
}

