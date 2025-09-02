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

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
