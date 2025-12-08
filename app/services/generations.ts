import { api } from "./api";
import type { Generation, GenerationFormData } from "~/types/catalog";

export class GenerationService {
  private baseURL = "/api/generations";

  async getAll(): Promise<Generation[]> {
    const response = await api.get<Generation[]>(this.baseURL);
    return response.data;
  }

  async getById(id: number): Promise<Generation> {
    const response = await api.get<Generation>(`${this.baseURL}/${id}`);
    return response.data;
  }

  async create(data: GenerationFormData): Promise<Generation> {
    const response = await api.post<Generation>(this.baseURL, data);
    return response.data;
  }

  async update(
    id: number,
    data: Partial<GenerationFormData>
  ): Promise<Generation> {
    const response = await api.put<Generation>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`);
  }

  async getActive(): Promise<Generation[]> {
    const response = await api.get<Generation[]>(`${this.baseURL}/active`);
    return response.data;
  }

  async getCurrent(): Promise<Generation | null> {
    const response = await api.get<Generation | null>(
      `${this.baseURL}/current`
    );
    return response.data;
  }

  async getStudentCount(id: number): Promise<number> {
    const response = await api.get<{ count: number }>(
      `${this.baseURL}/${id}/student-count`
    );
    return response.data.count;
  }
}

// Export singleton instance
export const generationService = new GenerationService();
