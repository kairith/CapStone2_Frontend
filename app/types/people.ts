import type { Role, Position, Gender } from "./enums";

// Admins
export interface Admin {
  id: number;
  global_id: string;
  email: string;
  password?: string;
  role: Role;
  first_name?: string;
  last_name?: string;
  active: number; // 0 or 1
  created_at: string;
  updated_at: string;
}

export interface AdminFormData {
  email: string;
  password?: string;
  role: Role;
  first_name?: string;
  last_name?: string;
  active?: number;
}

// Instructors (Professors, Lecturers, Assistants)
export interface Instructor {
  id: number;
  global_id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  password?: string;
  position: Position;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface InstructorFormData {
  first_name?: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  password?: string;
  position: Position;
  active?: number;
}

// Students
export interface Student {
  id: number;
  global_id: string;
  student_code: string;
  first_name?: string;
  last_name?: string;
  gender?: Gender;
  dob?: string;
  email: string;
  phone_number?: string;
  password?: string;
  address?: string;
  profile_image?: string;
  generation_id?: number;
  group_id?: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface StudentFormData {
  student_code: string;
  first_name?: string;
  last_name?: string;
  gender?: Gender;
  dob?: string;
  email: string;
  phone_number?: string;
  password?: string;
  address?: string;
  profile_image?: string;
  generation_id?: number;
  group_id?: number;
  active?: number;
}

// Display interface with related data
export interface StudentDisplay extends Student {
  generation_name?: string;
  group_name?: string;
  full_name?: string;
}
