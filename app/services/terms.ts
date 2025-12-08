import { api } from "./api";
import type { Term, TermFormData } from "~/types/catalog";

export class TermService {
  private baseURL = "/api/terms";

  async getAll(): Promise<Term[]> {
    const response = await api.get<Term[]>(this.baseURL);
    return response.data;
  }

  async getById(id: number): Promise<Term> {
    const response = await api.get<Term>(`${this.baseURL}/${id}`);
    return response.data;
  }

  async create(data: TermFormData): Promise<Term> {
    const response = await api.post<Term>(this.baseURL, data);
    return response.data;
  }

  async update(id: number, data: Partial<TermFormData>): Promise<Term> {
    const response = await api.put<Term>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`);
  }

  async getActive(): Promise<Term[]> {
    const response = await api.get<Term[]>(`${this.baseURL}/active`);
    return response.data;
  }

  async getCurrent(): Promise<Term | null> {
    const response = await api.get<Term | null>(`${this.baseURL}/current`);
    return response.data;
  }
}

// Export singleton instance
export const termService = new TermService();
