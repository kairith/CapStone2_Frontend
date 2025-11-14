type Role = {
  id: number | string
  is_active: boolean
  level: string
  type?: string
  [key: string]: any
}

export const useRoleStore = defineStore('role', () => {
  const roles = ref<Role[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const activeRoles = computed(() => roles.value.filter(role => role.is_active))
  const inactiveRoles = computed(() => roles.value.filter(role => !role.is_active))
  const adminRoles = computed(() => roles.value.filter(role => role.level === 'Admin'))
  const userRoles = computed(() => roles.value.filter(role => role.level === 'Lecturer'))

  const getRoleById = computed(() => {
    return (id: number | string) => roles.value.find(role => role.id === id)
  })

  const getRolesByType = computed(() => {
    return (type: string) => roles.value.filter(role => role.type === type)
  })

  // Actions
  const fetchRoles = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Simulate API call with mock data
      const mockRoles = await import('@/mock/roles.json')
      roles.value = mockRoles.default
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = String(err) || 'Failed to fetch roles'
      }
      console.error('Error fetching roles:', err)
    } finally {
      loading.value = false
    }
  }

  const refreshRoles = async () => {
    await fetchRoles()
  }

  const getRoleStats = computed(() => {
    return {
      total: roles.value.length,
      active: activeRoles.value.length,
      inactive: inactiveRoles.value.length,
      admin: adminRoles.value.length,
      user: userRoles.value.length
    }
  })

  return {
    // State
    roles,
    loading,
    error,
    
    // Getters
    activeRoles,
    inactiveRoles,
    adminRoles,
    userRoles,
    getRoleById,
    getRolesByType,
    getRoleStats,
    
    // Actions
    fetchRoles,
    refreshRoles
  }
})