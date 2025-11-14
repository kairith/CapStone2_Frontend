import type { Schedule } from '@/services/schedules'

export const useScheduleStore = defineStore('schedule', () => {
  const schedules = ref<Schedule[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getScheduleByGroupId = computed(() => {
    return (groupId: string) => schedules.value.find(s => s.group_id === groupId)
  })

  const getActiveSchedules = computed(() => {
    return schedules.value.filter(s => s.status === 'active')
  })

  // Actions
  const fetchSchedules = async () => {
    try {
      loading.value = true
      // In a real app, this would be an API call
      const mockSchedules = await import('@/mock/schedules.json')
      schedules.value = mockSchedules.default as Schedule[]
    } catch (err: any) {
      error.value = err?.message || 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  const createSchedule = async (scheduleData: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      loading.value = true
      const newSchedule: Schedule = {
        id: Date.now(),
        ...scheduleData,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      }
      schedules.value.push(newSchedule)
      return { success: true, data: newSchedule }
    } catch (err: any) {
      error.value = err?.message || 'An error occurred'
      return { success: false, error: err?.message || 'An error occurred' }
    } finally {
      loading.value = false
    }
  }

  const updateSchedule = async (id: number, scheduleData: Partial<Schedule>) => {
    try {
      loading.value = true
      const index = schedules.value.findIndex(s => s.id === id)
      if (index !== -1) {
        schedules.value[index] = {
          ...schedules.value[index],
          ...scheduleData,
          updated_at: new Date().toISOString().split('T')[0]
        } as Schedule
        return { success: true, data: schedules.value[index] }
      }
      throw new Error('Schedule not found')
    } catch (err: any) {
      error.value = err?.message || 'An error occurred'
      return { success: false, error: err?.message || 'An error occurred' }
    } finally {
      loading.value = false
    }
  }

  const deleteSchedule = async (id: number) => {
    try {
      loading.value = true
      const index = schedules.value.findIndex(s => s.id === id)
      if (index !== -1) {
        schedules.value.splice(index, 1)
        return { success: true }
      }
      throw new Error('Schedule not found')
    } catch (err: any) {
      error.value = err?.message || 'An error occurred'
      return { success: false, error: err?.message || 'An error occurred' }
    } finally {
      loading.value = false
    }
  }

  const updateScheduleSlot = async (
    scheduleId: number, 
    day: string, 
    timeSlot: string, 
    slotData: any
  ) => {
    try {
      const schedule = schedules.value.find(s => s.id === scheduleId)
      if (!schedule) throw new Error('Schedule not found')
      
      if (!schedule.schedule_data[day as keyof typeof schedule.schedule_data]) {
        schedule.schedule_data[day as keyof typeof schedule.schedule_data] = []
      }
      
      const dayData = schedule.schedule_data[day as keyof typeof schedule.schedule_data]
      const slotIndex = dayData.findIndex((slot: any) => slot.time === timeSlot)
      if (slotIndex !== -1) {
        dayData[slotIndex] = { ...dayData[slotIndex], ...slotData }
      } else {
        dayData.push({ time: timeSlot, ...slotData })
      }
      
      schedule.updated_at = new Date().toISOString().split('T')[0]
      return { success: true }
    } catch (err: any) {
      error.value = err?.message || 'An error occurred'
      return { success: false, error: err?.message || 'An error occurred' }
    }
  }

  return {
    schedules: readonly(schedules),
    loading: readonly(loading),
    error: readonly(error),
    getScheduleByGroupId,
    getActiveSchedules,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    updateScheduleSlot
  }
})