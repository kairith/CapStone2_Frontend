import { defineStore } from "pinia";
import type { Class } from "~/types/class";

export const useClassStore = defineStore("class", {
  state: () => ({
    classes: [] as Class[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // Get all active classes
    activeClasses: (state) =>
      state.classes.filter((c) => c.status === "active"),

    // Get classes by lecturer ID
    classesByLecturer: (state) => (lecturerId: number) =>
      state.classes.filter((c) => c.lecturerId === lecturerId),

    // Get classes by student (through group)
    classesByStudent: (state) => (studentGroup: string, studentGen: string) =>
      state.classes.filter(
        (c) => c.group === studentGroup && c.generation === studentGen
      ),

    // Get class by ID
    getClassById: (state) => (id: number) =>
      state.classes.find((c) => c.id === id),

    // Get classes by semester
    classesBySemester: (state) => (semester: string) =>
      state.classes.filter((c) => c.semester === semester),
  },

  actions: {
    // Fetch all classes
    async fetchClasses() {
      this.loading = true;
      this.error = null;
      try {
        // TODO: Replace with actual API call
        const mockClasses = await import("~/mock/classes.json");
        this.classes = mockClasses.default;
      } catch (error) {
        this.error = "Failed to fetch classes";
        console.error("Error fetching classes:", error);
      } finally {
        this.loading = false;
      }
    },

    // Create new class
    async createClass(classData: Omit<Class, "id">) {
      this.loading = true;
      this.error = null;
      try {
        // TODO: Replace with actual API call
        const newClass: Class = {
          ...classData,
          id: Math.max(...this.classes.map((c) => c.id), 0) + 1,
        };
        this.classes.push(newClass);
        return newClass;
      } catch (error) {
        this.error = "Failed to create class";
        console.error("Error creating class:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update class
    async updateClass(id: number, classData: Partial<Class>) {
      this.loading = true;
      this.error = null;
      try {
        const index = this.classes.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.classes[index] = { ...this.classes[index], ...classData };
          return this.classes[index];
        }
        throw new Error("Class not found");
      } catch (error) {
        this.error = "Failed to update class";
        console.error("Error updating class:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete class
    async deleteClass(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const index = this.classes.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.classes.splice(index, 1);
        }
      } catch (error) {
        this.error = "Failed to delete class";
        console.error("Error deleting class:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Toggle class status
    async toggleClassStatus(id: number) {
      const classItem = this.getClassById(id);
      if (classItem) {
        const newStatus = classItem.status === "active" ? "inactive" : "active";
        await this.updateClass(id, { status: newStatus });
      }
    },
  },
});
