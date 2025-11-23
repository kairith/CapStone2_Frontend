import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
/* Inline type definitions to avoid the unresolved '~/types/attendance' alias */
export interface AttendanceRecord {
  id: number
  student_id: string
  student_name: string
  status: 'Present' | 'Absent' | 'Late' | string
  method?: string
  timestamp?: string
}

export interface AttendanceSession {
  id: number
  date: string
  title?: string
}

export interface AttendanceStats {
  total: number
  present: number
  absent: number
  late: number
  attendance_rate?: number
}

import { attendanceService } from '~/services/attendance'

export const useAttendanceStore = defineStore('attendance', () => {
  // State
  const sessions = ref<AttendanceSession[]>([])
  const currentSession = ref<AttendanceSession | null>(null)
  const attendanceRecords = ref<AttendanceRecord[]>([])
  const filteredRecords = ref<AttendanceRecord[]>([])
  const stats = ref<AttendanceStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Search and filter state
  const searchQuery = ref('')
  const statusFilter = ref('')
  const methodFilter = ref('')

  // Computed
  const sessionStats = computed(() => {
    if (!stats.value) return null
    return {
      ...stats.value,
      presentPercentage: Math.round((stats.value.present / stats.value.total) * 100),
      absentPercentage: Math.round((stats.value.absent / stats.value.total) * 100),
      latePercentage: Math.round((stats.value.late / stats.value.total) * 100)
    }
  })

  const recentSessions = computed(() => {
    return sessions.value
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  })

  // Actions
  async function fetchSessions(lecturerId?: string, classId?: string) {
    try {
      loading.value = true
      error.value = null
      sessions.value = await attendanceService.getSessions(lecturerId, classId)
    } catch (err) {
      error.value = 'Failed to fetch sessions'
      console.error('Error fetching sessions:', err)
    } finally {
      loading.value = false
    }
  }

  async function selectSession(sessionId: number) {
    try {
      loading.value = true
      error.value = null
      
      // Find and set current session
      const session = sessions.value.find(s => s.id === sessionId)
      if (session) {
        currentSession.value = session
      }
      
      // Fetch attendance records for this session
      const [records, sessionStats] = await Promise.all([
        attendanceService.getAttendanceBySession(sessionId),
        attendanceService.getAttendanceStats(sessionId)
      ])
      
      attendanceRecords.value = records
      filteredRecords.value = records
      stats.value = sessionStats
      
      // Reset filters
      searchQuery.value = ''
      statusFilter.value = ''
      methodFilter.value = ''
      
    } catch (err) {
      error.value = 'Failed to load session data'
      console.error('Error selecting session:', err)
    } finally {
      loading.value = false
    }
  }

  function filterRecords() {
    let filtered = [...attendanceRecords.value]

    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(record => 
        record.student_name.toLowerCase().includes(query) ||
        record.student_id.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter.value) {
      filtered = filtered.filter(record => record.status === statusFilter.value)
    }

    // Apply method filter
    if (methodFilter.value) {
      filtered = filtered.filter(record => record.method === methodFilter.value)
    }

    filteredRecords.value = filtered
  }

  async function searchStudents(query: string) {
    if (!currentSession.value) return
    
    try {
      loading.value = true
      const results = await attendanceService.searchStudents(currentSession.value.id, query)
      filteredRecords.value = results
    } catch (err) {
      error.value = 'Failed to search students'
      console.error('Error searching students:', err)
    } finally {
      loading.value = false
    }
  }

  async function recordFaceAttendance(studentId: string, faceData: any) {
    if (!currentSession.value) {
      throw new Error('No session selected')
    }

    try {
      loading.value = true
      const newRecord = await attendanceService.recordFaceAttendance(
        currentSession.value.id, 
        studentId, 
        faceData
      )
      
      // Add to current records
      attendanceRecords.value.push(newRecord)
      filteredRecords.value.push(newRecord)
      
      // Update stats
      if (stats.value) {
        stats.value.total += 1
        if (newRecord.status === 'Present') stats.value.present += 1
        else if (newRecord.status === 'Late') stats.value.late += 1
        stats.value.attendance_rate = Math.round(((stats.value.present + stats.value.late) / stats.value.total) * 100)
      }
      
      return newRecord
    } catch (err) {
      error.value = 'Failed to record attendance'
      console.error('Error recording face attendance:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function refreshCurrentSession() {
    if (currentSession.value) {
      await selectSession(currentSession.value.id)
    }
  }

  function clearSession() {
    currentSession.value = null
    attendanceRecords.value = []
    filteredRecords.value = []
    stats.value = null
    searchQuery.value = ''
    statusFilter.value = ''
    methodFilter.value = ''
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
    filterRecords()
  }

  function setStatusFilter(status: string) {
    statusFilter.value = status
    filterRecords()
  }

  function setMethodFilter(method: string) {
    methodFilter.value = method
    filterRecords()
  }

  return {
    // State
    sessions,
    currentSession,
    attendanceRecords,
    filteredRecords,
    stats,
    loading,
    error,
    searchQuery,
    statusFilter,
    methodFilter,
    
    // Computed
    sessionStats,
    recentSessions,
    
    // Actions
    fetchSessions,
    selectSession,
    filterRecords,
    searchStudents,
    recordFaceAttendance,
    refreshCurrentSession,
    clearSession,
    setSearchQuery,
    setStatusFilter,
    setMethodFilter
  }
})