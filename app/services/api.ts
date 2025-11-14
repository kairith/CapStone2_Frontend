// Mock API service for frontend development
// This will be replaced with real API calls later

export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
}

export const api = {
  async get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    // Mock API response - replace with real API later
    return {
      data: [] as T,
      status: 200,
      statusText: 'OK'
    }
  },

  async post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    // Mock API response - replace with real API later
    return {
      data: data as T,
      status: 201,
      statusText: 'Created'
    }
  },

  async put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    // Mock API response - replace with real API later
    return {
      data: data as T,
      status: 200,
      statusText: 'OK'
    }
  },

  async patch<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    // Mock API response - replace with real API later
    return {
      data: data as T,
      status: 200,
      statusText: 'OK'
    }
  },

  async delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    // Mock API response - replace with real API later
    return {
      data: null as T,
      status: 204,
      statusText: 'No Content'
    }
  }
}