// Attendance record matching backend table structure
export interface AttendanceRecord {
  id: number
  global_id: string
  session_id: number
  student_id: number
  status: 'Present' | 'Absent' | 'Late' | 'Excused'
  checkin_time: string
  checkout_time: string
  method: 'Face Recognition' | 'Manual' | 'QR Code' | 'Fingerprint'
  device_id: number
  verification_id: number
  remarks?: string
  created_at: string
  updated_at: string
}

// Attendance session for grouping records
export interface AttendanceSession {
  id: number
  name: string
  date: string
  start_time: string
  end_time: string
  class_id: string
  class_name: string
  room: string
  lecturer_id: string
  status: 'active' | 'completed' | 'cancelled'
  total_students: number
  present_count: number
  absent_count: number
  late_count: number
}

// Extended interface for display purposes
export interface AttendanceRecordDisplay extends AttendanceRecord {
  student_name?: string
  student_email?: string
  class_name?: string
  session_name?: string
}

export interface AttendanceStats {
  total: number
  present: number
  absent: number
  late: number
  excused: number
  attendance_rate: number
}

export interface FaceRecognitionData {
  image: string // base64 encoded image
  confidence?: number
  metadata?: {
    timestamp: string
    location?: string
    device_id?: string
  }
}

export interface AttendanceFilter {
  search?: string
  status?: 'Present' | 'Absent' | 'Late' | 'Excused'
  method?: 'Face Recognition' | 'Manual' | 'QR Code'
  date_from?: string
  date_to?: string
}