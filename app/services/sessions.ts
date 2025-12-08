import { api } from "./api";
import type {
  Session,
  SessionFormData,
  SessionDisplay,
  SessionFilters,
  SessionBulkCreateData,
  SessionWithAttendance,
} from "~/types/session";

export class SessionService {
  private baseURL = "/api/sessions";

  /**
   * Get all sessions with optional filters
   */
  async getAll(filters?: SessionFilters): Promise<SessionDisplay[]> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() ? `${this.baseURL}?${params}` : this.baseURL;
    const response = await api.get<SessionDisplay[]>(url);
    return response.data;
  }

  /**
   * Get a single session by ID
   */
  async getById(id: number): Promise<SessionDisplay> {
    const response = await api.get<SessionDisplay>(`${this.baseURL}/${id}`);
    return response.data;
  }

  /**
   * Get session with attendance records
   */
  async getWithAttendance(id: number): Promise<SessionWithAttendance> {
    const response = await api.get<SessionWithAttendance>(
      `${this.baseURL}/${id}/attendance`
    );
    return response.data;
  }

  /**
   * Get sessions by course offering
   */
  async getByOffering(offeringId: number): Promise<SessionDisplay[]> {
    const response = await api.get<SessionDisplay[]>(
      `${this.baseURL}/offering/${offeringId}`
    );
    return response.data;
  }

  /**
   * Get sessions by room
   */
  async getByRoom(roomId: number): Promise<SessionDisplay[]> {
    const response = await api.get<SessionDisplay[]>(
      `${this.baseURL}/room/${roomId}`
    );
    return response.data;
  }

  /**
   * Get sessions by date range
   */
  async getByDateRange(
    startDate: string,
    endDate: string
  ): Promise<SessionDisplay[]> {
    const response = await api.get<SessionDisplay[]>(
      `${this.baseURL}/date-range?start=${startDate}&end=${endDate}`
    );
    return response.data;
  }

  /**
   * Get upcoming sessions
   */
  async getUpcoming(limit?: number): Promise<SessionDisplay[]> {
    const url = limit
      ? `${this.baseURL}/upcoming?limit=${limit}`
      : `${this.baseURL}/upcoming`;
    const response = await api.get<SessionDisplay[]>(url);
    return response.data;
  }

  /**
   * Get today's sessions
   */
  async getToday(): Promise<SessionDisplay[]> {
    const response = await api.get<SessionDisplay[]>(`${this.baseURL}/today`);
    return response.data;
  }

  /**
   * Get sessions for a specific instructor
   */
  async getByInstructor(
    instructorId: number,
    filters?: SessionFilters
  ): Promise<SessionDisplay[]> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString()
      ? `${this.baseURL}/instructor/${instructorId}?${params}`
      : `${this.baseURL}/instructor/${instructorId}`;

    const response = await api.get<SessionDisplay[]>(url);
    return response.data;
  }

  /**
   * Get sessions for a specific student (through enrollments)
   */
  async getByStudent(
    studentId: number,
    filters?: SessionFilters
  ): Promise<SessionDisplay[]> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString()
      ? `${this.baseURL}/student/${studentId}?${params}`
      : `${this.baseURL}/student/${studentId}`;

    const response = await api.get<SessionDisplay[]>(url);
    return response.data;
  }

  /**
   * Create a new session
   */
  async create(data: SessionFormData): Promise<Session> {
    const response = await api.post<Session>(this.baseURL, data);
    return response.data;
  }

  /**
   * Create multiple sessions at once (bulk create)
   */
  async bulkCreate(data: SessionBulkCreateData): Promise<Session[]> {
    const response = await api.post<Session[]>(`${this.baseURL}/bulk`, data);
    return response.data;
  }

  /**
   * Update an existing session
   */
  async update(id: number, data: Partial<SessionFormData>): Promise<Session> {
    const response = await api.put<Session>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a session (soft delete - sets active to 0)
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`);
  }

  /**
   * Update session status
   */
  async updateStatus(
    id: number,
    status: "planned" | "completed" | "canceled" | "makeup"
  ): Promise<Session> {
    const response = await api.patch<Session>(`${this.baseURL}/${id}/status`, {
      status,
    });
    return response.data;
  }

  /**
   * Mark session as completed
   */
  async markCompleted(id: number): Promise<Session> {
    return this.updateStatus(id, "completed");
  }

  /**
   * Cancel a session
   */
  async cancel(id: number, reason?: string): Promise<Session> {
    const response = await api.patch<Session>(`${this.baseURL}/${id}/cancel`, {
      reason,
    });
    return response.data;
  }

  /**
   * Create a makeup session
   */
  async createMakeup(
    originalSessionId: number,
    data: SessionFormData
  ): Promise<Session> {
    const response = await api.post<Session>(
      `${this.baseURL}/${originalSessionId}/makeup`,
      data
    );
    return response.data;
  }

  /**
   * Check for room conflicts
   */
  async checkRoomConflict(
    roomId: number,
    startDatetime: string,
    endDatetime: string,
    excludeSessionId?: number
  ): Promise<{
    hasConflict: boolean;
    conflicts: SessionDisplay[];
  }> {
    const response = await api.post<{
      hasConflict: boolean;
      conflicts: SessionDisplay[];
    }>(`${this.baseURL}/check-room-conflict`, {
      room_id: roomId,
      start_datetime: startDatetime,
      end_datetime: endDatetime,
      exclude_session_id: excludeSessionId,
    });
    return response.data;
  }

  /**
   * Get attendance statistics for a session
   */
  async getAttendanceStats(id: number): Promise<{
    total_students: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendance_rate: number;
  }> {
    const response = await api.get(`${this.baseURL}/${id}/attendance-stats`);
    return response.data;
  }

  /**
   * Get session statistics
   */
  async getStatistics(filters?: SessionFilters): Promise<{
    total: number;
    by_status: Record<string, number>;
    by_room: Record<string, number>;
    upcoming: number;
    completed: number;
    canceled: number;
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

  /**
   * Generate sessions for a course offering based on schedule pattern
   */
  async generateSchedule(
    offeringId: number,
    scheduleData: {
      start_date: string;
      end_date: string;
      days_of_week: number[]; // 0=Sunday, 1=Monday, etc.
      start_time: string;
      end_time: string;
      room_id: number;
      exclude_dates?: string[]; // Holidays, etc.
    }
  ): Promise<Session[]> {
    const response = await api.post<Session[]>(
      `${this.baseURL}/generate-schedule`,
      { offering_id: offeringId, ...scheduleData }
    );
    return response.data;
  }
}

// Export singleton instance
export const sessionService = new SessionService();
