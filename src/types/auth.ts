export interface LoginData {
  username: string;
  password: string;
}

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
  // Добавьте другие нужные поля, если есть
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: Department;  // Добавлено поле департамента
}
