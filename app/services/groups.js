import { api } from './api.js'

export const groupsService = {
  // Get all groups
  async getAll() {
    try {
      return await api.get('/groups')
    } catch (error) {
      throw new Error(`Failed to fetch groups: ${error.message}`)
    }
  },

  // Get group by ID
  async getById(id) {
    try {
      return await api.get(`/groups/${id}`)
    } catch (error) {
      throw new Error(`Failed to fetch group: ${error.message}`)
    }
  },

  // Create new group
  async create(groupData) {
    try {
      const payload = {
        global_id: groupData.global_id,
        group_name: groupData.group_name,
        active: groupData.active || 1
      }
      return await api.post('/groups', payload)
    } catch (error) {
      throw new Error(`Failed to create group: ${error.message}`)
    }
  },

  // Update group
  async update(id, groupData) {
    try {
      const payload = {
        global_id: groupData.global_id,
        group_name: groupData.group_name,
        active: groupData.active
      }
      return await api.put(`/groups/${id}`, payload)
    } catch (error) {
      throw new Error(`Failed to update group: ${error.message}`)
    }
  },

  // Delete group
  async delete(id) {
    try {
      return await api.delete(`/groups/${id}`)
    } catch (error) {
      throw new Error(`Failed to delete group: ${error.message}`)
    }
  },

  // Toggle group status
  async toggleStatus(id, currentStatus) {
    try {
      return await api.patch(`/groups/${id}/status`, {
        active: currentStatus ? 0 : 1
      })
    } catch (error) {
      throw new Error(`Failed to toggle group status: ${error.message}`)
    }
  }
}