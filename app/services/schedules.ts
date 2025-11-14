// Mock service for frontend development
// This will be replaced with real API calls later

export interface ScheduleSlot {
  time: string
  subject: string
  lecturer?: string
  room?: string
  type: 'Theory' | 'Lab' | 'Project' | 'Seminar' | 'Break'
}

export interface ScheduleData {
  Monday: ScheduleSlot[]
  Tuesday: ScheduleSlot[]
  Wednesday: ScheduleSlot[]
  Thursday: ScheduleSlot[]
  Friday: ScheduleSlot[]
}

export interface Schedule {
  id?: number
  group_id: string
  group_name: string
  generation: number
  year: number
  specialize: string
  semester: number
  academic_year: string
  start_date: string
  end_date: string
  schedule_data: ScheduleData
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export class ScheduleService {
  private baseUrl = '/api/schedules'

  // Mock methods - will be replaced with real API calls later
  async getAllSchedules(): Promise<Schedule[]> {
    try {
      // Mock response for frontend development
      const mockSchedules = await import('@/mock/schedules.json')
      return mockSchedules.default as Schedule[]
    } catch (error) {
      console.error('Error fetching schedules:', error)
      throw error
    }
  }

  async getScheduleById(id: number): Promise<Schedule> {
    try {
      // Mock response for frontend development
      const schedules = await this.getAllSchedules()
      const schedule = schedules.find(s => s.id === id)
      if (!schedule) throw new Error('Schedule not found')
      return schedule
    } catch (error) {
      console.error('Error fetching schedule:', error)
      throw error
    }
  }

  async getScheduleByGroupId(groupId: string): Promise<Schedule | null> {
    try {
      // Mock response for frontend development
      const schedules = await this.getAllSchedules()
      return schedules.find(s => s.group_id === groupId) || null
    } catch (error) {
      console.error('Error fetching schedule by group ID:', error)
      throw error
    }
  }

  async createSchedule(scheduleData: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>): Promise<Schedule> {
    try {
      // Mock response for frontend development
      const newSchedule: Schedule = {
        id: Date.now(),
        ...scheduleData,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      }
      return newSchedule
    } catch (error) {
      console.error('Error creating schedule:', error)
      throw error
    }
  }

  async updateSchedule(id: number, scheduleData: Partial<Schedule>): Promise<Schedule> {
    try {
      // Mock response for frontend development
      const existingSchedule = await this.getScheduleById(id)
      const updatedSchedule: Schedule = {
        ...existingSchedule,
        ...scheduleData,
        updated_at: new Date().toISOString().split('T')[0]
      }
      return updatedSchedule
    } catch (error) {
      console.error('Error updating schedule:', error)
      throw error
    }
  }

  async deleteSchedule(id: number): Promise<void> {
    try {
      // Mock response for frontend development
      console.log('Schedule deleted:', id)
    } catch (error) {
      console.error('Error deleting schedule:', error)
      throw error
    }
  }

  async updateScheduleSlot(
    scheduleId: number, 
    day: keyof ScheduleData, 
    timeSlot: string, 
    slotData: Partial<ScheduleSlot>
  ): Promise<Schedule> {
    try {
      // Mock response for frontend development
      const schedule = await this.getScheduleById(scheduleId)
      schedule.updated_at = new Date().toISOString().split('T')[0]
      return schedule
    } catch (error) {
      console.error('Error updating schedule slot:', error)
      throw error
    }
  }

  async duplicateSchedule(id: number, newGroupData: { group_id: string; group_name: string }): Promise<Schedule> {
    try {
      // Mock response for frontend development
      const originalSchedule = await this.getScheduleById(id)
      const duplicatedSchedule: Schedule = {
        ...originalSchedule,
        id: Date.now(),
        ...newGroupData,
        status: 'inactive',
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      }
      return duplicatedSchedule
    } catch (error) {
      console.error('Error duplicating schedule:', error)
      throw error
    }
  }

  async getSchedulesByFilter(filters: {
    generation?: number
    year?: number
    specialize?: string
    status?: string
  }): Promise<Schedule[]> {
    try {
      // Mock response for frontend development
      let schedules = await this.getAllSchedules()
      
      if (filters.generation) {
        schedules = schedules.filter(s => s.generation === filters.generation)
      }
      if (filters.year) {
        schedules = schedules.filter(s => s.year === filters.year)
      }
      if (filters.specialize) {
        schedules = schedules.filter(s => s.specialize === filters.specialize)
      }
      if (filters.status) {
        schedules = schedules.filter(s => s.status === filters.status)
      }
      
      return schedules
    } catch (error) {
      console.error('Error fetching filtered schedules:', error)
      throw error
    }
  }

  async exportSchedule(id: number, format: 'pdf' | 'excel'): Promise<Blob> {
    try {
      // Mock response for frontend development
      const mockBlob = new Blob(['Mock export data'], { type: 'text/plain' })
      return mockBlob
    } catch (error) {
      console.error('Error exporting schedule:', error)
      throw error
    }
  }

  async importSchedule(file: File, groupId: string): Promise<Schedule> {
    try {
      // Mock response for frontend development
      const mockSchedule: Schedule = {
        id: Date.now(),
        group_id: groupId,
        group_name: `Imported Group ${groupId}`,
        generation: 9,
        year: 2025,
        specialize: 'CS',
        semester: 1,
        academic_year: '2024-2025',
        start_date: '2024-09-01',
        end_date: '2024-12-20',
        schedule_data: this.generateEmptyScheduleData(),
        status: 'active',
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      }
      return mockSchedule
    } catch (error) {
      console.error('Error importing schedule:', error)
      throw error
    }
  }

  validateScheduleData(schedule: Partial<Schedule>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!schedule.group_id || !/^[A-Z]\d{3}$/.test(schedule.group_id)) {
      errors.push('Group ID must be in format: G001')
    }

    if (!schedule.group_name || schedule.group_name.trim().length < 3) {
      errors.push('Group name must be at least 3 characters')
    }

    if (!schedule.generation || schedule.generation < 1) {
      errors.push('Generation is required')
    }

    if (!schedule.year || schedule.year < 2020) {
      errors.push('Valid year is required')
    }

    if (!schedule.specialize) {
      errors.push('Specialization is required')
    }

    if (!schedule.semester || ![1, 2].includes(schedule.semester)) {
      errors.push('Semester must be 1 or 2')
    }

    if (!schedule.start_date || !schedule.end_date) {
      errors.push('Start date and end date are required')
    } else if (new Date(schedule.start_date) >= new Date(schedule.end_date)) {
      errors.push('End date must be after start date')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  generateEmptyScheduleData(): ScheduleData {
    const timeSlots = [
      '08:00-09:30',
      '09:30-09:50',
      '09:50-11:20',
      '11:20-12:10',
      '12:10-13:40',
      '13:40-13:50',
      '13:50-15:20',
      '15:20-15:30',
      '15:30-17:00'
    ]

    const days: (keyof ScheduleData)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const scheduleData = {} as ScheduleData

    days.forEach(day => {
      scheduleData[day] = timeSlots.map(time => ({
        time,
        subject: '',
        lecturer: '',
        room: '',
        type: time.includes('Break') ? 'Break' : 'Theory'
      } as ScheduleSlot))
    })

    return scheduleData
  }
}

export const scheduleService = new ScheduleService()