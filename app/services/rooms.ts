import { api } from './api';
import type { Room, RoomFormData } from '~/types/catalog';

export class RoomService {
  private baseURL = '/api/rooms';

  async getAll(): Promise<Room[]> {
    const response = await api.get<Room[]>(this.baseURL);
    return response.data;
  }

  async getById(id: number): Promise<Room> {
    const response = await api.get<Room>(`${this.baseURL}/${id}`);
    return response.data;
  }

  async create(data: RoomFormData): Promise<Room> {
    const response = await api.post<Room>(this.baseURL, data);
    return response.data;
  }

  async update(id: number, data: Partial<RoomFormData>): Promise<Room> {
    const response = await api.put<Room>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`);
  }

  async getActive(): Promise<Room[]> {
    const response = await api.get<Room[]>(`${this.baseURL}/active`);
    return response.data;
  }

  async getAvailable(startDatetime: string, endDatetime: string): Promise<Room[]> {
    const response = await api.get<Room[]>(
      `${this.baseURL}/available?start=${startDatetime}&end=${endDatetime}`
    );
    return response.data;
  }

  async checkAvailability(roomId: number, startDatetime: string, endDatetime: string): Promise<{
    available: boolean;
    conflicts?: any[];
  }> {
    const response = await api.post<{ available: boolean; conflicts?: any[] }>(
      `${this.baseURL}/${roomId}/check-availability`,
      { start_datetime: startDatetime, end_datetime: endDatetime }
    );
    return response.data;
  }
}

// Export singleton instance
export const roomService = new RoomService();
