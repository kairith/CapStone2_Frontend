import type { SessionStatus } from './enums';

// Sessions - real class meetings that depend on course offerings and rooms
export interface Session {
  id: number;
  global_id: string;
  offering_id: number;
  room_id: number;
  start_datetime: string; // ISO datetime string
  end_datetime: string; // ISO datetime string
  status: SessionStatus; // 'planned' | 'completed' | 'canceled' | 'makeup'
  active: number;
  created_at: string;
  updated_at: string;
}

export interface SessionFormData {
  offering_id: number;
  room_id: number;
  start_datetime: string;
  end_datetime: string;
  status?: SessionStatus;
  active?: number;
}

// Extended interface for display with related data
export interface SessionDisplay extends Session {
  // From course offering
  subject_name?: string;
  subject_code?: string;
  group_name?: string;
  term_name?: string;
  instructor_name?: string;
  assistant_name?: string;
  generation_name?: string;
  
  // Room info
  room_name?: string;
  room_capacity?: number;
  
  // Attendance stats
  total_students?: number;
  present_count?: number;
  absent_count?: number;
  late_count?: number;
  excused_count?: number;
  attendance_rate?: number;
  
  // Calculated fields
  duration_minutes?: number;
  is_upcoming?: boolean;
  is_ongoing?: boolean;
  is_past?: boolean;
}

// For filtering and searching sessions
export interface SessionFilters {
  offering_id?: number;
  room_id?: number;
  status?: SessionStatus;
  start_date?: string; // Filter by date range
  end_date?: string;
  instructor_id?: number;
  group_id?: number;
  subject_id?: number;
  term_id?: number;
  generation_id?: number;
  active?: number;
}

// For creating multiple sessions (bulk creation)
export interface SessionBulkCreateData {
  offering_id: number;
  room_id: number;
  sessions: {
    start_datetime: string;
    end_datetime: string;
    status?: SessionStatus;
  }[];
}

// Session with attendance summary
export interface SessionWithAttendance extends SessionDisplay {
  attendance_records?: {
    student_id: number;
    student_name: string;
    status: string;
    checkin_time?: string;
    method?: string;
  }[];
}
