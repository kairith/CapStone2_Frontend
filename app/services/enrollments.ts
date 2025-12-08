import { api } from "./api";
import type {
  Enrollment,
  EnrollmentFormData,
  EnrollmentDisplay,
  EnrollmentFilters,
  BulkEnrollmentData,
} from "~/types/enrollment";

export class EnrollmentService {
  private baseURL = "/api/enrollments";

  /**
   * Get all enrollments with optional filters
   */
  async getAll(filters?: EnrollmentFilters): Promise<EnrollmentDisplay[]> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() ? `${this.baseURL}?${params}` : this.baseURL;
    const response = await api.get<EnrollmentDisplay[]>(url);
    return response.data;
  }

  /**
   * Get a single enrollment by ID
   */
  async getById(id: number): Promise<EnrollmentDisplay> {
    const response = await api.get<EnrollmentDisplay>(`${this.baseURL}/${id}`);
    return response.data;
  }

  /**
   * Get enrollments by student
   */
  async getByStudent(studentId: number): Promise<EnrollmentDisplay[]> {
    const response = await api.get<EnrollmentDisplay[]>(
      `${this.baseURL}/student/${studentId}`
    );
    return response.data;
  }

  /**
   * Get enrollments by course offering
   */
  async getByOffering(offeringId: number): Promise<EnrollmentDisplay[]> {
    const response = await api.get<EnrollmentDisplay[]>(
      `${this.baseURL}/offering/${offeringId}`
    );
    return response.data;
  }

  /**
   * Get student's current enrollments (active term)
   */
  async getCurrentEnrollments(studentId: number): Promise<EnrollmentDisplay[]> {
    const response = await api.get<EnrollmentDisplay[]>(
      `${this.baseURL}/student/${studentId}/current`
    );
    return response.data;
  }

  /**
   * Create a new enrollment
   */
  async create(data: EnrollmentFormData): Promise<Enrollment> {
    const response = await api.post<Enrollment>(this.baseURL, data);
    return response.data;
  }

  /**
   * Bulk enroll students to a course offering
   */
  async bulkEnroll(data: BulkEnrollmentData): Promise<Enrollment[]> {
    const response = await api.post<Enrollment[]>(`${this.baseURL}/bulk`, data);
    return response.data;
  }

  /**
   * Update an enrollment
   */
  async update(
    id: number,
    data: Partial<EnrollmentFormData>
  ): Promise<Enrollment> {
    const response = await api.put<Enrollment>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  /**
   * Delete an enrollment (soft delete - sets active to 0)
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`);
  }

  /**
   * Drop an enrollment (set status to 2 and record dropped_at)
   */
  async drop(id: number): Promise<Enrollment> {
    const response = await api.patch<Enrollment>(`${this.baseURL}/${id}/drop`);
    return response.data;
  }

  /**
   * Mark enrollment as completed (set status to 3)
   */
  async complete(id: number): Promise<Enrollment> {
    const response = await api.patch<Enrollment>(
      `${this.baseURL}/${id}/complete`
    );
    return response.data;
  }

  /**
   * Check if student is enrolled in a course offering
   */
  async checkEnrollment(
    studentId: number,
    offeringId: number
  ): Promise<{ enrolled: boolean; enrollment?: Enrollment }> {
    const response = await api.get<{
      enrolled: boolean;
      enrollment?: Enrollment;
    }>(
      `${this.baseURL}/check?student_id=${studentId}&offering_id=${offeringId}`
    );
    return response.data;
  }

  /**
   * Get enrollment with attendance statistics
   */
  async getWithStats(id: number): Promise<EnrollmentDisplay> {
    const response = await api.get<EnrollmentDisplay>(
      `${this.baseURL}/${id}/stats`
    );
    return response.data;
  }

  /**
   * Get enrollment statistics for a course offering
   */
  async getOfferingStats(offeringId: number): Promise<{
    total: number;
    enrolled: number;
    dropped: number;
    completed: number;
  }> {
    const response = await api.get(
      `${this.baseURL}/offering/${offeringId}/statistics`
    );
    return response.data;
  }

  /**
   * Get enrollment statistics for a student
   */
  async getStudentStats(studentId: number): Promise<{
    total: number;
    current: number;
    completed: number;
    dropped: number;
    total_credits: number;
  }> {
    const response = await api.get(
      `${this.baseURL}/student/${studentId}/statistics`
    );
    return response.data;
  }

  /**
   * Enroll entire group to a course offering
   */
  async enrollGroup(
    offeringId: number,
    groupId: number
  ): Promise<Enrollment[]> {
    const response = await api.post<Enrollment[]>(
      `${this.baseURL}/enroll-group`,
      { offering_id: offeringId, group_id: groupId }
    );
    return response.data;
  }

  /**
   * Validate enrollment eligibility
   */
  async validateEnrollment(
    studentId: number,
    offeringId: number
  ): Promise<{
    eligible: boolean;
    reasons?: string[];
  }> {
    const response = await api.post<{ eligible: boolean; reasons?: string[] }>(
      `${this.baseURL}/validate`,
      { student_id: studentId, offering_id: offeringId }
    );
    return response.data;
  }
}

// Export singleton instance
export const enrollmentService = new EnrollmentService();
