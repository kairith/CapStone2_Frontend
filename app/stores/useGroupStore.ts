export const useGroupStore = defineStore('group', () => {
  const groups = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Get all groups
  const fetchGroups = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch('/api/groups')
      groups.value = response.data || response
    } catch (err) {
      error.value = err.message
      console.error('Error fetching groups:', err)
    } finally {
      loading.value = false
    }
  }

  // Get group by ID
  const getGroupById = (id) => {
    return groups.value.find(group => group.id === id)
  }

  // Create new group
  const createGroup = async (groupData) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch('/api/groups', {
        method: 'POST',
        body: groupData
      })
      groups.value.push(response.data || response)
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update group
  const updateGroup = async (id, groupData) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch(`/api/groups/${id}`, {
        method: 'PUT',
        body: groupData
      })
      const index = groups.value.findIndex(group => group.id === id)
      if (index !== -1) {
        groups.value[index] = response.data || response
      }
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete group
  const deleteGroup = async (id) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/groups/${id}`, {
        method: 'DELETE'
      })
      groups.value = groups.value.filter(group => group.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Toggle group active status
  const toggleGroupStatus = async (id) => {
    const group = getGroupById(id)
    if (group) {
      await updateGroup(id, { ...group, active: group.active ? 0 : 1 })
    }
  }

  return {
    groups: readonly(groups),
    loading: readonly(loading),
    error: readonly(error),
    fetchGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    toggleGroupStatus
  }
})