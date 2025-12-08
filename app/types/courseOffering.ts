import type { OfferingStatus } from './enums';

// Course Offerings - connects subjects, terms, groups, instructors, rooms, and generations
export interface CourseOffering {
  id: number;
  global_id: string;
  group_id: number;
  subject_id: number;
  term_id: number;
  instructor_id: number;
  assistant_id: number;
  room_id?: number;
  generation_id: number;
  description?: string;
  start_time?: string; // Time only (HH:mm:ss)
  end_time?: string; // Time only (HH:mm:ss)
  status: OfferingStatus; // 1=planned, 2=active, 3=completed, 4=canceled
  active: number;
  created_at: string;
  updated_at: string;
}

export interface CourseOfferingFormData {
  group_id: number;
  subject_id: number;
  term_id: number;
  instructor_id: number;
  assistant_id: number;
  room_id?: number;
  generation_id: number;
  description?: string;
  start_time?: string;
  end_time?: string;
  status?: OfferingStatus;
  active?: number;
}

// Extended interface for display with related entity names
export interface CourseOfferingDisplay extends CourseOffering {
  group_name?: string;
  subject_name?: string;
  subject_code?: string;
  term_name?: string;
  instructor_name?: string;
  instructor_email?: string;
  assistant_name?: string;
  assistant_email?: string;
  room_name?: string;
  generation_name?: string;
  credits?: number;
  lecture_hours?: number;
  lab_hours?: number;
  enrolled_students?: number;
}

// For filtering and searching
export interface CourseOfferingFilters {
  group_id?: number;
  subject_id?: number;
  term_id?: number;
  instructor_id?: number;
  generation_id?: number;
  status?: OfferingStatus;
  active?: number;
}
