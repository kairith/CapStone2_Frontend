export interface User {
  id: string | number;
  name: string;
  email: string;
  role: "admin" | "lecturer" | "student";
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: "admin" | "lecturer" | "student";
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface AuthError {
  message: string;
  statusCode?: number;
}

export type UserRole = "admin" | "lecturer" | "student";

export type Permission =
  | "read"
  | "write"
  | "delete"
  | "manage_users"
  | "manage_system"
  | "manage_attendance"
  | "manage_classes"
  | "view_attendance"
  | "submit_leave";
