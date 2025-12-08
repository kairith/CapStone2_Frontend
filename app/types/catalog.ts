// Catalog entities: Departments, Specializations, Subjects, Terms, Groups, Rooms, Generations

// Departments
export interface Department {
  id: number;
  global_id: string;
  name: string;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentFormData {
  name: string;
  active?: number;
}

// Specializations
export interface Specialization {
  id: number;
  global_id: string;
  name: string;
  department_id: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface SpecializationFormData {
  name: string;
  department_id: number;
  active?: number;
}

export interface SpecializationDisplay extends Specialization {
  department_name?: string;
}

// Subjects
export interface Subject {
  id: number;
  global_id: string;
  code: string;
  specialization_id: number;
  name: string;
  description?: string;
  credits?: number;
  lecture_hours?: number;
  lab_hours?: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface SubjectFormData {
  code: string;
  specialization_id: number;
  name: string;
  description?: string;
  credits?: number;
  lecture_hours?: number;
  lab_hours?: number;
  active?: number;
}

export interface SubjectDisplay extends Subject {
  specialization_name?: string;
  department_name?: string;
}

// Terms
export interface Term {
  id: number;
  global_id: string;
  term: string;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface TermFormData {
  term: string;
  active?: number;
}

// Groups
export interface Group {
  id: number;
  global_id: string;
  group_name: string;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface GroupFormData {
  group_name: string;
  active?: number;
}

// Rooms
export interface Room {
  id: number;
  global_id: string;
  room: string;
  capacity?: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface RoomFormData {
  room: string;
  capacity?: number;
  active?: number;
}

// Generations
export interface Generation {
  id: number;
  global_id: string;
  generation: string;
  start_year?: number;
  end_year?: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface GenerationFormData {
  generation: string;
  start_year?: number;
  end_year?: number;
  active?: number;
}
