import { api } from './api';
import type { 
  CourseOffering, 
  CourseOfferingFormData, 
  CourseOfferingDisplay,
  CourseOfferingFilters 
} from '~/types/courseOffering';

export class CourseOfferingService {
  private baseURL = '/api/course-offerings';

  /**
   * Get all course offerings with optional filters
   */
  async getAll(filters?: CourseOfferingFilters): Promise<CourseOfferingDisplay[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() ? `${this.baseURL}?${params}` : this.baseURL;
    const response = await api.get<CourseOfferingDisplay[]>(url);
    return response.data;
  }

  /**
   * Get a single course offering by ID
   */
  async getById(id: number): Promise<CourseOfferingDisplay> {
    const response = await api.get<CourseOfferingDisplay>(`${this.baseURL}/${id}`);
    return response.data;
  }

  /**
   * Get course offerings by term
   */
  async getByTerm(termId: number): Promise<CourseOfferingDisplay[]> {
    const response = await api.get<CourseOfferingDisplay[]>(`${this.baseURL}/term/${termId}`);
    return response.data;
  }

  /**
   * Get course offerings by instructor
   */
  async getByInstructor(instructorId: number): Promise<CourseOfferingDisplay[]> {
    const response = await api.get<CourseOfferingDisplay[]>(`${this.baseURL}/instructor/${instructorId}`);
    return response.data;
  }

  /**
   * Get course offerings by generation
   */
  async getByGeneration(generationId: number): Promise<CourseOfferingDisplay[]> {
    const response = await api.get<CourseOfferingDisplay[]>(`${this.baseURL}/generation/${generationId}`);
    return response.data;
  }

  /**
   * Get course offerings by group
   */
  async getByGroup(groupId: number): Promise<CourseOfferingDisplay[]> {
    const response = await api.get<CourseOfferingDisplay[]>(`${this.baseURL}/group/${groupId}`);
    return response.data;
  }

  /**
   * Create a new course offering
   */
  async create(data: CourseOfferingFormData): Promise<CourseOffering> {
    const response = await api.post<CourseOffering>(this.baseURL, data);
    return response.data;
  }

  /**
   * Update an existing course offering
   */
  async update(id: number, data: Partial<CourseOfferingFormData>): Promise<CourseOffering> {
    const response = await api.put<CourseOffering>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a course offering (soft delete - sets active to 0)
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`);
  }

  /**
   * Update course offering status
   */
  async updateStatus(id: number, status: 1 | 2 | 3 | 4): Promise<CourseOffering> {
    const response = await api.patch<CourseOffering>(`${this.baseURL}/${id}/status`, { status });
    return response.data;
  }

  /**
   * Get enrolled students count for a course offering
   */
  async getEnrollmentCount(id: number): Promise<number> {
    const response = await api.get<{ count: number }>(`${this.baseURL}/${id}/enrollment-count`);
    return response.data.count;
  }

  /**
   * Get course offerings for current term (active term)
   */
  async getCurrentTermOfferings(): Promise<CourseOfferingDisplay[]> {
    const response = await api.get<CourseOfferingDisplay[]>(`${this.baseURL}/current-term`);
    return response.data;
  }

  /**
   * Check for scheduling conflicts
   */
  async checkConflicts(data: CourseOfferingFormData): Promise<{ hasConflict: boolean; conflicts: any[] }> {
    const response = await api.post<{ hasConflict: boolean; conflicts: any[] }>(
      `${this.baseURL}/check-conflicts`,
      data
    );
    return response.data;
  }

  /**
   * Clone a course offering to a new term
   */
  async clone(id: number, newTermId: number): Promise<CourseOffering> {
    const response = await api.post<CourseOffering>(`${this.baseURL}/${id}/clone`, { term_id: newTermId });
    return response.data;
  }

  /**
   * Get course offerings statistics
   */
  async getStatistics(filters?: CourseOfferingFilters): Promise<{
    total: number;
    by_status: Record<string, number>;
    by_term: Record<string, number>;
    by_generation: Record<string, number>;
  }> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() 
      ? `${this.baseURL}/statistics?${params}` 
      : `${this.baseURL}/statistics`;
    
    const response = await api.get(url);
    return response.data;
  }
}

// Export singleton instance
export const courseOfferingService = new CourseOfferingService();
