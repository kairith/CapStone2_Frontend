// Role Service for API communication
export interface Role {
  id: string | number
  name: string
  description: string
  level: 'Admin' | 'Staff' | 'User' | 'Student'
  type: 'System' | 'Custom' | 'Academic'
  is_active: boolean
  permissions: string[]
  user_count?: number
  created_at: string
  updated_at?: string
}

export interface RoleFilters {
  status?: 'All' | 'Active' | 'Inactive'
  type?: 'All' | 'System' | 'Custom' | 'Academic'
  level?: 'All' | 'Admin' | 'Staff' | 'User' | 'Student'
  search?: string
}

export class RoleService {
  private baseUrl = '/api/roles'

  async getAllRoles(): Promise<Role[]> {
    try {
      // In a real application, this would be an actual API call
      // const response = await $fetch(`${this.baseUrl}`)
      // return response.data
      
      // For now, return mock data
      const mockData = await import('@/mock/roles.json')
      return mockData.default
    } catch (error) {
      console.error('Error fetching roles:', error)
      throw new Error('Failed to fetch roles')
    }
  }

  async getRoleById(id: string | number): Promise<Role | null> {
    try {
      // const response = await $fetch(`${this.baseUrl}/${id}`)
      // return response.data
      
      const roles = await this.getAllRoles()
      return roles.find(role => role.id === id) || null
    } catch (error) {
      console.error('Error fetching role:', error)
      throw new Error('Failed to fetch role')
    }
  }

  async getFilteredRoles(filters: RoleFilters): Promise<Role[]> {
    try {
      const roles = await this.getAllRoles()
      let filtered = [...roles]

      if (filters.status && filters.status !== 'All') {
        filtered = filtered.filter(role => 
          filters.status === 'Active' ? role.is_active : !role.is_active
        )
      }

      if (filters.type && filters.type !== 'All') {
        filtered = filtered.filter(role => role.type === filters.type)
      }

      if (filters.level && filters.level !== 'All') {
        filtered = filtered.filter(role => role.level === filters.level)
      }

      if (filters.search) {
        const query = filters.search.toLowerCase()
        filtered = filtered.filter(role => 
          role.name.toLowerCase().includes(query) ||
          role.description.toLowerCase().includes(query)
        )
      }

      return filtered
    } catch (error) {
      console.error('Error filtering roles:', error)
      throw new Error('Failed to filter roles')
    }
  }

  async exportRoles(format: 'pdf' | 'excel'): Promise<Blob> {
    try {
      // const response = await $fetch(`${this.baseUrl}/export`, {
      //   method: 'GET',
      //   query: { format }
      // })
      // return response
      
      // Mock export functionality
      console.log(`Exporting roles as ${format}`)
      return new Blob(['Mock export data'], { type: 'text/plain' })
    } catch (error) {
      console.error('Error exporting roles:', error)
      throw new Error('Failed to export roles')
    }
  }
}

export const roleService = new RoleService()