import { defineStore } from 'pinia';
import type { 
  Enrollment, 
  EnrollmentDisplay, 
  EnrollmentFormData,
  EnrollmentFilters,
  BulkEnrollmentData
} from '~/types/enrollment';
import { enrollmentService } from '~/services/enrollments';

export const useEnrollmentStore = defineStore('enrollment', {
  state: () => ({
    enrollments: [] as EnrollmentDisplay[],
    currentEnrollment: null as EnrollmentDisplay | null,
    loading: false,
    error: null as string | null,
    filters: {} as EnrollmentFilters,
  }),

  getters: {
    // Get active enrollments
    activeEnrollments: (state) =>
      state.enrollments.filter((e) => e.active === 1),

    // Get enrollments by status
    enrollmentsByStatus: (state) => (status: 1 | 2 | 3) =>
      state.enrollments.filter((e) => e.status === status),

    // Get enrolled (status = 1)
    currentEnrollments: (state) =>
      state.enrollments.filter((e) => e.status === 1),

    // Get dropped (status = 2)
    droppedEnrollments: (state) =>
      state.enrollments.filter((e) => e.status === 2),

    // Get completed (status = 3)
    completedEnrollments: (state) =>
      state.enrollments.filter((e) => e.status === 3),

    // Get enrollments by student
    enrollmentsByStudent: (state) => (studentId: number) =>
      state.enrollments.filter((e) => e.student_id === studentId),

    // Get enrollments by offering
    enrollmentsByOffering: (state) => (offeringId: number) =>
      state.enrollments.filter((e) => e.offering_id === offeringId),

    // Get enrollment by ID
    getEnrollmentById: (state) => (id: number) =>
      state.enrollments.find((e) => e.id === id),

    // Get enrollment count by offering
    enrollmentCountByOffering: (state) => (offeringId: number) =>
      state.enrollments.filter((e) => e.offering_id === offeringId && e.status === 1).length,
  },

  actions: {
    // Fetch all enrollments with optional filters
    async fetchEnrollments(filters?: EnrollmentFilters) {
      this.loading = true;
      this.error = null;
      try {
        if (filters) {
          this.filters = filters;
        }
        this.enrollments = await enrollmentService.getAll(this.filters);
      } catch (error) {
        this.error = 'Failed to fetch enrollments';
        console.error('Error fetching enrollments:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch a single enrollment by ID
    async fetchEnrollmentById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        this.currentEnrollment = await enrollmentService.getById(id);
        return this.currentEnrollment;
      } catch (error) {
        this.error = 'Failed to fetch enrollment';
        console.error('Error fetching enrollment:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch enrollments by student
    async fetchByStudent(studentId: number) {
      this.loading = true;
      this.error = null;
      try {
        this.enrollments = await enrollmentService.getByStudent(studentId);
      } catch (error) {
        this.error = 'Failed to fetch enrollments by student';
        console.error('Error fetching enrollments by student:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch enrollments by course offering
    async fetchByOffering(offeringId: number) {
      this.loading = true;
      this.error = null;
      try {
        this.enrollments = await enrollmentService.getByOffering(offeringId);
      } catch (error) {
        this.error = 'Failed to fetch enrollments by offering';
        console.error('Error fetching enrollments by offering:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch current enrollments for a student
    async fetchCurrentEnrollments(studentId: number) {
      this.loading = true;
      this.error = null;
      try {
        this.enrollments = await enrollmentService.getCurrentEnrollments(studentId);
      } catch (error) {
        this.error = 'Failed to fetch current enrollments';
        console.error('Error fetching current enrollments:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create new enrollment
    async createEnrollment(data: EnrollmentFormData) {
      this.loading = true;
      this.error = null;
      try {
        // Validate enrollment first
        const validation = await enrollmentService.validateEnrollment(
          data.student_id,
          data.offering_id
        );
        
        if (!validation.eligible) {
          throw new Error(`Enrollment not allowed: ${validation.reasons?.join(', ')}`);
        }

        const newEnrollment = await enrollmentService.create(data);
        
        // Refresh the list
        await this.fetchEnrollments(this.filters);
        
        return newEnrollment;
      } catch (error) {
        this.error = 'Failed to create enrollment';
        console.error('Error creating enrollment:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Bulk enroll students
    async bulkEnroll(data: BulkEnrollmentData) {
      this.loading = true;
      this.error = null;
      try {
        const newEnrollments = await enrollmentService.bulkEnroll(data);
        
        // Refresh the list
        await this.fetchEnrollments(this.filters);
        
        return newEnrollments;
      } catch (error) {
        this.error = 'Failed to bulk enroll students';
        console.error('Error bulk enrolling students:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Enroll group
    async enrollGroup(offeringId: number, groupId: number) {
      this.loading = true;
      this.error = null;
      try {
        const enrollments = await enrollmentService.enrollGroup(offeringId, groupId);
        
        // Refresh the list
        await this.fetchEnrollments(this.filters);
        
        return enrollments;
      } catch (error) {
        this.error = 'Failed to enroll group';
        console.error('Error enrolling group:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update enrollment
    async updateEnrollment(id: number, data: Partial<EnrollmentFormData>) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await enrollmentService.update(id, data);
        
        // Update in local state
        const index = this.enrollments.findIndex((e) => e.id === id);
        if (index !== -1) {
          // Re-fetch to get updated display data
          await this.fetchEnrollmentById(id);
          this.enrollments[index] = this.currentEnrollment!;
        }
        
        return updated;
      } catch (error) {
        this.error = 'Failed to update enrollment';
        console.error('Error updating enrollment:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete enrollment
    async deleteEnrollment(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await enrollmentService.delete(id);
        
        // Remove from local state
        this.enrollments = this.enrollments.filter((e) => e.id !== id);
      } catch (error) {
        this.error = 'Failed to delete enrollment';
        console.error('Error deleting enrollment:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Drop enrollment
    async dropEnrollment(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await enrollmentService.drop(id);
        
        // Update in local state
        const index = this.enrollments.findIndex((e) => e.id === id);
        if (index !== -1 && this.enrollments[index]) {
          this.enrollments[index]!.status = 2;
          this.enrollments[index]!.dropped_at = new Date().toISOString();
        }
        
        return updated;
      } catch (error) {
        this.error = 'Failed to drop enrollment';
        console.error('Error dropping enrollment:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Complete enrollment
    async completeEnrollment(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await enrollmentService.complete(id);
        
        // Update in local state
        const index = this.enrollments.findIndex((e) => e.id === id);
        if (index !== -1 && this.enrollments[index]) {
          this.enrollments[index]!.status = 3;
        }
        
        return updated;
      } catch (error) {
        this.error = 'Failed to complete enrollment';
        console.error('Error completing enrollment:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Check if student is enrolled
    async checkEnrollment(studentId: number, offeringId: number) {
      this.loading = true;
      this.error = null;
      try {
        return await enrollmentService.checkEnrollment(studentId, offeringId);
      } catch (error) {
        this.error = 'Failed to check enrollment';
        console.error('Error checking enrollment:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get enrollment with statistics
    async getWithStats(id: number) {
      this.loading = true;
      this.error = null;
      try {
        return await enrollmentService.getWithStats(id);
      } catch (error) {
        this.error = 'Failed to fetch enrollment with statistics';
        console.error('Error fetching enrollment with statistics:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get offering statistics
    async getOfferingStats(offeringId: number) {
      this.loading = true;
      this.error = null;
      try {
        return await enrollmentService.getOfferingStats(offeringId);
      } catch (error) {
        this.error = 'Failed to fetch offering statistics';
        console.error('Error fetching offering statistics:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get student statistics
    async getStudentStats(studentId: number) {
      this.loading = true;
      this.error = null;
      try {
        return await enrollmentService.getStudentStats(studentId);
      } catch (error) {
        this.error = 'Failed to fetch student statistics';
        console.error('Error fetching student statistics:', error);
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
      this.enrollments = [];
      this.currentEnrollment = null;
      this.loading = false;
      this.error = null;
      this.filters = {};
    },
  },
});
