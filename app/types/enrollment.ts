import type { EnrollmentStatus } from "./enums";

// Enrollments - links students to course offerings
export interface Enrollment {
  id: number;
  global_id: string;
  student_id: number;
  offering_id: number;
  status: EnrollmentStatus; // 1=enrolled, 2=dropped, 3=completed
  active: number;
  enrolled_at: string;
  dropped_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentFormData {
  student_id: number;
  offering_id: number;
  status?: EnrollmentStatus;
  active?: number;
}

// Extended interface for display
export interface EnrollmentDisplay extends Enrollment {
  // Student info
  student_name?: string;
  student_code?: string;
  student_email?: string;

  // Course offering info
  subject_name?: string;
  subject_code?: string;
  group_name?: string;
  term_name?: string;
  instructor_name?: string;
  generation_name?: string;

  // Attendance statistics
  total_sessions?: number;
  attended_sessions?: number;
  attendance_rate?: number;
}

// For bulk enrollment
export interface BulkEnrollmentData {
  offering_id: number;
  student_ids: number[];
}

// For filtering enrollments
export interface EnrollmentFilters {
  student_id?: number;
  offering_id?: number;
  status?: EnrollmentStatus;
  term_id?: number;
  generation_id?: number;
  active?: number;
}
