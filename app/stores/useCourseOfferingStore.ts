import { defineStore } from "pinia";
import type {
  CourseOffering,
  CourseOfferingDisplay,
  CourseOfferingFormData,
  CourseOfferingFilters,
} from "~/types/courseOffering";
import { courseOfferingService } from "~/services/courseOfferings";

export const useCourseOfferingStore = defineStore("courseOffering", {
  state: () => ({
    offerings: [] as CourseOfferingDisplay[],
    currentOffering: null as CourseOfferingDisplay | null,
    loading: false,
    error: null as string | null,
    filters: {} as CourseOfferingFilters,
  }),

  getters: {
    // Get active offerings
    activeOfferings: (state) => state.offerings.filter((o) => o.active === 1),

    // Get offerings by status
    offeringsByStatus: (state) => (status: 1 | 2 | 3 | 4) =>
      state.offerings.filter((o) => o.status === status),

    // Get offerings by term
    offeringsByTerm: (state) => (termId: number) =>
      state.offerings.filter((o) => o.term_id === termId),

    // Get offerings by instructor
    offeringsByInstructor: (state) => (instructorId: number) =>
      state.offerings.filter((o) => o.instructor_id === instructorId),

    // Get offerings by generation
    offeringsByGeneration: (state) => (generationId: number) =>
      state.offerings.filter((o) => o.generation_id === generationId),

    // Get offerings by group
    offeringsByGroup: (state) => (groupId: number) =>
      state.offerings.filter((o) => o.group_id === groupId),

    // Get offering by ID
    getOfferingById: (state) => (id: number) =>
      state.offerings.find((o) => o.id === id),

    // Get planned offerings (status = 1)
    plannedOfferings: (state) => state.offerings.filter((o) => o.status === 1),

    // Get active offerings (status = 2)
    currentOfferings: (state) => state.offerings.filter((o) => o.status === 2),

    // Get completed offerings (status = 3)
    completedOfferings: (state) =>
      state.offerings.filter((o) => o.status === 3),
  },

  actions: {
    // Fetch all offerings with optional filters
    async fetchOfferings(filters?: CourseOfferingFilters) {
      this.loading = true;
      this.error = null;
      try {
        if (filters) {
          this.filters = filters;
        }
        this.offerings = await courseOfferingService.getAll(this.filters);
      } catch (error) {
        this.error = "Failed to fetch course offerings";
        console.error("Error fetching course offerings:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch a single offering by ID
    async fetchOfferingById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        this.currentOffering = await courseOfferingService.getById(id);
        return this.currentOffering;
      } catch (error) {
        this.error = "Failed to fetch course offering";
        console.error("Error fetching course offering:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch offerings by term
    async fetchByTerm(termId: number) {
      this.loading = true;
      this.error = null;
      try {
        this.offerings = await courseOfferingService.getByTerm(termId);
      } catch (error) {
        this.error = "Failed to fetch course offerings by term";
        console.error("Error fetching course offerings by term:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch offerings by instructor
    async fetchByInstructor(instructorId: number) {
      this.loading = true;
      this.error = null;
      try {
        this.offerings = await courseOfferingService.getByInstructor(
          instructorId
        );
      } catch (error) {
        this.error = "Failed to fetch course offerings by instructor";
        console.error("Error fetching course offerings by instructor:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch current term offerings
    async fetchCurrentTermOfferings() {
      this.loading = true;
      this.error = null;
      try {
        this.offerings = await courseOfferingService.getCurrentTermOfferings();
      } catch (error) {
        this.error = "Failed to fetch current term offerings";
        console.error("Error fetching current term offerings:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create new course offering
    async createOffering(data: CourseOfferingFormData) {
      this.loading = true;
      this.error = null;
      try {
        // Check for conflicts first
        const conflictCheck = await courseOfferingService.checkConflicts(data);
        if (conflictCheck.hasConflict) {
          throw new Error(
            `Scheduling conflicts detected: ${JSON.stringify(
              conflictCheck.conflicts
            )}`
          );
        }

        const newOffering = await courseOfferingService.create(data);

        // Refresh the list
        await this.fetchOfferings(this.filters);

        return newOffering;
      } catch (error) {
        this.error = "Failed to create course offering";
        console.error("Error creating course offering:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update course offering
    async updateOffering(id: number, data: Partial<CourseOfferingFormData>) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await courseOfferingService.update(id, data);

        // Update in local state
        const index = this.offerings.findIndex((o) => o.id === id);
        if (index !== -1) {
          // Re-fetch to get updated display data
          await this.fetchOfferingById(id);
          this.offerings[index] = this.currentOffering!;
        }

        return updated;
      } catch (error) {
        this.error = "Failed to update course offering";
        console.error("Error updating course offering:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete course offering
    async deleteOffering(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await courseOfferingService.delete(id);

        // Remove from local state
        this.offerings = this.offerings.filter((o) => o.id !== id);
      } catch (error) {
        this.error = "Failed to delete course offering";
        console.error("Error deleting course offering:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update offering status
    async updateStatus(id: number, status: 1 | 2 | 3 | 4) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await courseOfferingService.updateStatus(id, status);

        // Update in local state
        const index = this.offerings.findIndex((o) => o.id === id);
        if (index !== -1 && this.offerings[index]) {
          this.offerings[index]!.status = status;
        }

        return updated;
      } catch (error) {
        this.error = "Failed to update offering status";
        console.error("Error updating offering status:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Clone offering to new term
    async cloneOffering(id: number, newTermId: number) {
      this.loading = true;
      this.error = null;
      try {
        const cloned = await courseOfferingService.clone(id, newTermId);

        // Refresh the list
        await this.fetchOfferings(this.filters);

        return cloned;
      } catch (error) {
        this.error = "Failed to clone course offering";
        console.error("Error cloning course offering:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get statistics
    async getStatistics(filters?: CourseOfferingFilters) {
      this.loading = true;
      this.error = null;
      try {
        return await courseOfferingService.getStatistics(filters);
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
      this.offerings = [];
      this.currentOffering = null;
      this.loading = false;
      this.error = null;
      this.filters = {};
    },
  },
});
