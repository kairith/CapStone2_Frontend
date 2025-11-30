import type { Class, ClassFormData } from "~/types/class";

const API_BASE = "/api";

export const classService = {
  // Get all classes
  async getAll(): Promise<Class[]> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${API_BASE}/classes`);
      return response.json();
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  },

  // Get class by ID
  async getById(id: number): Promise<Class> {
    try {
      const response = await fetch(`${API_BASE}/classes/${id}`);
      return response.json();
    } catch (error) {
      console.error("Error fetching class:", error);
      throw error;
    }
  },

  // Get classes by lecturer
  async getByLecturer(lecturerId: number): Promise<Class[]> {
    try {
      const response = await fetch(
        `${API_BASE}/classes?lecturerId=${lecturerId}`
      );
      return response.json();
    } catch (error) {
      console.error("Error fetching lecturer classes:", error);
      throw error;
    }
  },

  // Get classes by student group
  async getByStudentGroup(group: string, generation: string): Promise<Class[]> {
    try {
      const response = await fetch(
        `${API_BASE}/classes?group=${group}&generation=${generation}`
      );
      return response.json();
    } catch (error) {
      console.error("Error fetching student classes:", error);
      throw error;
    }
  },

  // Create new class
  async create(data: ClassFormData): Promise<Class> {
    try {
      const response = await fetch(`${API_BASE}/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("Error creating class:", error);
      throw error;
    }
  },

  // Update class
  async update(id: number, data: Partial<ClassFormData>): Promise<Class> {
    try {
      const response = await fetch(`${API_BASE}/classes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("Error updating class:", error);
      throw error;
    }
  },

  // Delete class
  async delete(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/classes/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  },

  // Toggle class status
  async toggleStatus(id: number): Promise<Class> {
    try {
      const response = await fetch(`${API_BASE}/classes/${id}/toggle-status`, {
        method: "PATCH",
      });
      return response.json();
    } catch (error) {
      console.error("Error toggling class status:", error);
      throw error;
    }
  },
};
