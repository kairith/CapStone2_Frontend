import { defineStore } from "pinia";
import type {
  Session,
  SessionDisplay,
  SessionFormData,
  SessionFilters,
  SessionBulkCreateData,
  SessionWithAttendance,
} from "~/types/session";
import { sessionService } from "~/services/sessions";

export const useSessionStore = defineStore("session", {
  state: () => ({
    sessions: [] as SessionDisplay[],
    currentSession: null as SessionDisplay | null,
    currentSessionWithAttendance: null as SessionWithAttendance | null,
    loading: false,
    error: null as string | null,
    filters: {} as SessionFilters,
  }),

  getters: {
    // Get active sessions
    activeSessions: (state) => state.sessions.filter((s) => s.active === 1),

    // Get sessions by status
    sessionsByStatus:
      (state) => (status: "planned" | "completed" | "canceled" | "makeup") =>
        state.sessions.filter((s) => s.status === status),

    // Get upcoming sessions (planned and not past)
    upcomingSessions: (state) =>
      state.sessions
        .filter(
          (s) =>
            s.status === "planned" && new Date(s.start_datetime) > new Date()
        )
        .sort(
          (a, b) =>
            new Date(a.start_datetime).getTime() -
            new Date(b.start_datetime).getTime()
        ),

    // Get today's sessions
    todaySessions: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return state.sessions
        .filter((s) => {
          const sessionDate = new Date(s.start_datetime);
          return sessionDate >= today && sessionDate < tomorrow;
        })
        .sort(
          (a, b) =>
            new Date(a.start_datetime).getTime() -
            new Date(b.start_datetime).getTime()
        );
    },

    // Get ongoing sessions
    ongoingSessions: (state) => {
      const now = new Date();
      return state.sessions.filter((s) => {
        const start = new Date(s.start_datetime);
        const end = new Date(s.end_datetime);
        return start <= now && end >= now && s.status !== "canceled";
      });
    },

    // Get sessions by offering
    sessionsByOffering: (state) => (offeringId: number) =>
      state.sessions.filter((s) => s.offering_id === offeringId),

    // Get sessions by room
    sessionsByRoom: (state) => (roomId: number) =>
      state.sessions.filter((s) => s.room_id === roomId),

    // Get session by ID
    getSessionById: (state) => (id: number) =>
      state.sessions.find((s) => s.id === id),

    // Get completed sessions
    completedSessions: (state) =>
      state.sessions.filter((s) => s.status === "completed"),

    // Get canceled sessions
    canceledSessions: (state) =>
      state.sessions.filter((s) => s.status === "canceled"),

    // Get makeup sessions
    makeupSessions: (state) =>
      state.sessions.filter((s) => s.status === "makeup"),
  },

  actions: {
    // Fetch all sessions with optional filters
    async fetchSessions(filters?: SessionFilters) {
      this.loading = true;
      this.error = null;
      try {
        if (filters) {
          this.filters = filters;
        }
        this.sessions = await sessionService.getAll(this.filters);
      } catch (error) {
        this.error = "Failed to fetch sessions";
        console.error("Error fetching sessions:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch a single session by ID
    async fetchSessionById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        this.currentSession = await sessionService.getById(id);
        return this.currentSession;
      } catch (error) {
        this.error = "Failed to fetch session";
        console.error("Error fetching session:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch session with attendance records
    async fetchSessionWithAttendance(id: number) {
      this.loading = true;
      this.error = null;
      try {
        this.currentSessionWithAttendance =
          await sessionService.getWithAttendance(id);
        return this.currentSessionWithAttendance;
      } catch (error) {
        this.error = "Failed to fetch session with attendance";
        console.error("Error fetching session with attendance:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch sessions by course offering
    async fetchByOffering(offeringId: number) {
      this.loading = true;
      this.error = null;
      try {
        this.sessions = await sessionService.getByOffering(offeringId);
      } catch (error) {
        this.error = "Failed to fetch sessions by offering";
        console.error("Error fetching sessions by offering:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch sessions by instructor
    async fetchByInstructor(instructorId: number, filters?: SessionFilters) {
      this.loading = true;
      this.error = null;
      try {
        this.sessions = await sessionService.getByInstructor(
          instructorId,
          filters
        );
      } catch (error) {
        this.error = "Failed to fetch sessions by instructor";
        console.error("Error fetching sessions by instructor:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch sessions by student
    async fetchByStudent(studentId: number, filters?: SessionFilters) {
      this.loading = true;
      this.error = null;
      try {
        this.sessions = await sessionService.getByStudent(studentId, filters);
      } catch (error) {
        this.error = "Failed to fetch sessions by student";
        console.error("Error fetching sessions by student:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch upcoming sessions
    async fetchUpcoming(limit?: number) {
      this.loading = true;
      this.error = null;
      try {
        this.sessions = await sessionService.getUpcoming(limit);
      } catch (error) {
        this.error = "Failed to fetch upcoming sessions";
        console.error("Error fetching upcoming sessions:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch today's sessions
    async fetchToday() {
      this.loading = true;
      this.error = null;
      try {
        this.sessions = await sessionService.getToday();
      } catch (error) {
        this.error = "Failed to fetch today's sessions";
        console.error("Error fetching today's sessions:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create new session
    async createSession(data: SessionFormData) {
      this.loading = true;
      this.error = null;
      try {
        // Check for room conflicts
        const conflictCheck = await sessionService.checkRoomConflict(
          data.room_id,
          data.start_datetime,
          data.end_datetime
        );

        if (conflictCheck.hasConflict) {
          throw new Error(
            `Room conflict detected: ${JSON.stringify(conflictCheck.conflicts)}`
          );
        }

        const newSession = await sessionService.create(data);

        // Refresh the list
        await this.fetchSessions(this.filters);

        return newSession;
      } catch (error) {
        this.error = "Failed to create session";
        console.error("Error creating session:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Bulk create sessions
    async bulkCreateSessions(data: SessionBulkCreateData) {
      this.loading = true;
      this.error = null;
      try {
        const newSessions = await sessionService.bulkCreate(data);

        // Refresh the list
        await this.fetchSessions(this.filters);

        return newSessions;
      } catch (error) {
        this.error = "Failed to bulk create sessions";
        console.error("Error bulk creating sessions:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update session
    async updateSession(id: number, data: Partial<SessionFormData>) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await sessionService.update(id, data);

        // Update in local state
        const index = this.sessions.findIndex((s) => s.id === id);
        if (index !== -1) {
          // Re-fetch to get updated display data
          await this.fetchSessionById(id);
          this.sessions[index] = this.currentSession!;
        }

        return updated;
      } catch (error) {
        this.error = "Failed to update session";
        console.error("Error updating session:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete session
    async deleteSession(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await sessionService.delete(id);

        // Remove from local state
        this.sessions = this.sessions.filter((s) => s.id !== id);
      } catch (error) {
        this.error = "Failed to delete session";
        console.error("Error deleting session:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update session status
    async updateStatus(
      id: number,
      status: "planned" | "completed" | "canceled" | "makeup"
    ) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await sessionService.updateStatus(id, status);

        // Update in local state
        const index = this.sessions.findIndex((s) => s.id === id);
        if (index !== -1 && this.sessions[index]) {
          this.sessions[index]!.status = status;
        }

        return updated;
      } catch (error) {
        this.error = "Failed to update session status";
        console.error("Error updating session status:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Mark session as completed
    async markCompleted(id: number) {
      return this.updateStatus(id, "completed");
    },

    // Cancel session
    async cancelSession(id: number, reason?: string) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await sessionService.cancel(id, reason);

        // Update in local state
        const index = this.sessions.findIndex((s) => s.id === id);
        if (index !== -1 && this.sessions[index]) {
          this.sessions[index]!.status = "canceled";
        }

        return updated;
      } catch (error) {
        this.error = "Failed to cancel session";
        console.error("Error canceling session:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create makeup session
    async createMakeupSession(
      originalSessionId: number,
      data: SessionFormData
    ) {
      this.loading = true;
      this.error = null;
      try {
        const makeup = await sessionService.createMakeup(
          originalSessionId,
          data
        );

        // Refresh the list
        await this.fetchSessions(this.filters);

        return makeup;
      } catch (error) {
        this.error = "Failed to create makeup session";
        console.error("Error creating makeup session:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Generate schedule
    async generateSchedule(
      offeringId: number,
      scheduleData: {
        start_date: string;
        end_date: string;
        days_of_week: number[];
        start_time: string;
        end_time: string;
        room_id: number;
        exclude_dates?: string[];
      }
    ) {
      this.loading = true;
      this.error = null;
      try {
        const generatedSessions = await sessionService.generateSchedule(
          offeringId,
          scheduleData
        );

        // Refresh the list
        await this.fetchSessions(this.filters);

        return generatedSessions;
      } catch (error) {
        this.error = "Failed to generate schedule";
        console.error("Error generating schedule:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get attendance statistics
    async getAttendanceStats(id: number) {
      this.loading = true;
      this.error = null;
      try {
        return await sessionService.getAttendanceStats(id);
      } catch (error) {
        this.error = "Failed to fetch attendance statistics";
        console.error("Error fetching attendance statistics:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get statistics
    async getStatistics(filters?: SessionFilters) {
      this.loading = true;
      this.error = null;
      try {
        return await sessionService.getStatistics(filters);
      } catch (error) {
        this.error = "Failed to fetch statistics";
        console.error("Error fetching statistics:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Clear filters
    clearFilters() {
      this.filters = {};
    },

    // Reset state
    reset() {
      this.sessions = [];
      this.currentSession = null;
      this.currentSessionWithAttendance = null;
      this.loading = false;
      this.error = null;
      this.filters = {};
    },
  },
});
