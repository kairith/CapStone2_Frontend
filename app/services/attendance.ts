import { ref } from 'vue'

/**
 * Inline attendance types to avoid unresolved '~/types/attendance' import.
 * These mirror the shapes used in this service and can be moved to a shared
 * types file later if you add a proper path alias or a types file.
 */
export type AttendanceRecord = {
  id: number
  session_id: number
  student_id: string
  student_name: string
  status: 'Present' | 'Absent' | 'Late' | 'Excused' | string
  checkin_time?: string
  checkout_time?: string
  method?: string
  verification_status?: string
  similarity_score?: number
  remarks?: string
}

export type AttendanceSession = {
  id: number
  name: string
  date: string
  start_time: string
  end_time: string
  class_id: string
  class_name: string
  room?: string
  lecturer_id?: string
  status?: string
  total_students?: number
  present_count?: number
  absent_count?: number
}

export type AttendanceStats = {
  total: number
  present: number
  absent: number
  late: number
  excused: number
  attendance_rate: number
}

export class AttendanceService {
  private baseURL = '/api/attendance'

  // Get sessions for a lecturer/class
  async getSessions(lecturerId?: string, classId?: string): Promise<AttendanceSession[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock data - replace with actual API call
      return [
        {
          id: 1,
          name: 'Introduction to Programming - Week 1',
          date: '2024-11-21',
          start_time: '08:00',
          end_time: '10:00',
          class_id: 'CS101',
          class_name: 'Introduction to Programming',
          room: 'Room A101',
          lecturer_id: lecturerId || 'L001',
          status: 'completed',
          total_students: 25,
          present_count: 23,
          absent_count: 2
        },
        {
          id: 2,
          name: 'Data Structures - Week 3',
          date: '2024-11-20',
          start_time: '10:30',
          end_time: '12:30',
          class_id: 'CS201',
          class_name: 'Data Structures',
          room: 'Room B203',
          lecturer_id: lecturerId || 'L001',
          status: 'completed',
          total_students: 30,
          present_count: 28,
          absent_count: 2
        },
        {
          id: 3,
          name: 'Web Development - Lab Session',
          date: '2024-11-19',
          start_time: '14:00',
          end_time: '16:00',
          class_id: 'CS301',
          class_name: 'Web Development',
          room: 'Lab C301',
          lecturer_id: lecturerId || 'L001',
          status: 'completed',
          total_students: 20,
          present_count: 19,
          absent_count: 1
        }
      ]
    } catch (error) {
      console.error('Error fetching sessions:', error)
      throw error
    }
  }

  // Get attendance records for a specific session
  async getAttendanceBySession(sessionId: number): Promise<AttendanceRecord[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Mock data based on session ID
      const baseRecords: AttendanceRecord[] = [
        {
          id: 1,
          session_id: sessionId,
          student_id: 'S001',
          student_name: 'John Doe',
          status: 'Present',
          checkin_time: '2024-11-21T08:05:00Z',
          checkout_time: '2024-11-21T09:55:00Z',
          method: 'Face Recognition',
          verification_status: 'Verified',
          similarity_score: 95.5,
          remarks: 'On time arrival'
        },
        {
          id: 2,
          session_id: sessionId,
          student_id: 'S002',
          student_name: 'Jane Smith',
          status: 'Present',
          checkin_time: '2024-11-21T08:03:00Z',
          checkout_time: '2024-11-21T09:58:00Z',
          method: 'Face Recognition',
          verification_status: 'Verified',
          similarity_score: 92.3
        },
        {
          id: 3,
          session_id: sessionId,
          student_id: 'S003',
          student_name: 'Mike Johnson',
          status: 'Late',
          checkin_time: '2024-11-21T08:15:00Z',
          checkout_time: '2024-11-21T09:50:00Z',
          method: 'Face Recognition',
          verification_status: 'Verified',
          similarity_score: 89.7,
          remarks: '15 minutes late'
        },
        {
          id: 4,
          session_id: sessionId,
          student_id: 'S004',
          student_name: 'Sarah Wilson',
          status: 'Present',
          checkin_time: '2024-11-21T07:58:00Z',
          checkout_time: '2024-11-21T10:02:00Z',
          method: 'Face Recognition',
          verification_status: 'Verified',
          similarity_score: 96.2
        },
        {
          id: 5,
          session_id: sessionId,
          student_id: 'S005',
          student_name: 'David Brown',
          status: 'Absent',
          method: 'Manual',
          verification_status: 'Failed',
          remarks: 'Did not attend class'
        },
        {
          id: 6,
          session_id: sessionId,
          student_id: 'S006',
          student_name: 'Emily Davis',
          status: 'Present',
          checkin_time: '2024-11-21T08:01:00Z',
          checkout_time: '2024-11-21T09:59:00Z',
          method: 'QR Code',
          verification_status: 'Verified'
        },
        {
          id: 7,
          session_id: sessionId,
          student_id: 'S007',
          student_name: 'Alex Chen',
          status: 'Present',
          checkin_time: '2024-11-21T08:07:00Z',
          checkout_time: '2024-11-21T09:53:00Z',
          method: 'Face Recognition',
          verification_status: 'Verified',
          similarity_score: 91.8
        },
        {
          id: 8,
          session_id: sessionId,
          student_id: 'S008',
          student_name: 'Lisa Anderson',
          status: 'Excused',
          method: 'Manual',
          verification_status: 'Verified',
          remarks: 'Medical appointment - pre-approved absence'
        }
      ]
      
      return baseRecords
    } catch (error) {
      console.error('Error fetching attendance records:', error)
      throw error
    }
  }

  // Get attendance statistics for a session
  async getAttendanceStats(sessionId: number): Promise<AttendanceStats> {
    try {
      const records = await this.getAttendanceBySession(sessionId)
      
      return {
        total: records.length,
        present: records.filter(r => r.status === 'Present').length,
        absent: records.filter(r => r.status === 'Absent').length,
        late: records.filter(r => r.status === 'Late').length,
        excused: records.filter(r => r.status === 'Excused').length,
        attendance_rate: Math.round((records.filter(r => ['Present', 'Late'].includes(r.status)).length / records.length) * 100)
      }
    } catch (error) {
      console.error('Error calculating attendance stats:', error)
      throw error
    }
  }

  // Record face recognition attendance
  async recordFaceAttendance(sessionId: number, studentId: string, faceData: any): Promise<AttendanceRecord> {
    try {
      // Simulate face recognition processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful recognition
      const newRecord: AttendanceRecord = {
        id: Date.now(),
        session_id: sessionId,
        student_id: studentId,
        student_name: 'Scanned Student',
        status: 'Present',
        checkin_time: new Date().toISOString(),
        method: 'Face Recognition',
        verification_status: 'Verified',
        similarity_score: Math.random() * 10 + 90, // 90-100%
        remarks: 'Face scan successful'
      }
      
      return newRecord
    } catch (error) {
      console.error('Error recording face attendance:', error)
      throw error
    }
  }

  // Search students by name or ID
  async searchStudents(sessionId: number, query: string): Promise<AttendanceRecord[]> {
    try {
      const records = await this.getAttendanceBySession(sessionId)
      const lowercaseQuery = query.toLowerCase()
      
      return records.filter(record => 
        record.student_name.toLowerCase().includes(lowercaseQuery) ||
        record.student_id.toLowerCase().includes(lowercaseQuery)
      )
    } catch (error) {
      console.error('Error searching students:', error)
      throw error
    }
  }
}

export const attendanceService = new AttendanceService()