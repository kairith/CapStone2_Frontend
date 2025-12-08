import { api } from './api';
import type { 
  Subject, 
  SubjectFormData, 
  SubjectDisplay,
  Department,
  DepartmentFormData,
  Specialization,
  SpecializationFormData,
  SpecializationDisplay
} from '~/types/catalog';

export class SubjectService {
  private baseURL = '/api/subjects';

  async getAll(): Promise<SubjectDisplay[]> {
    const response = await api.get<SubjectDisplay[]>(this.baseURL);
    return response.data;
  }

  async getById(id: number): Promise<SubjectDisplay> {
    const response = await api.get<SubjectDisplay>(`${this.baseURL}/${id}`);
    return response.data;
  }

  async getBySpecialization(specializationId: number): Promise<SubjectDisplay[]> {
    const response = await api.get<SubjectDisplay[]>(`${this.baseURL}/specialization/${specializationId}`);
    return response.data;
  }

  async getByCode(code: string): Promise<SubjectDisplay> {
    const response = await api.get<SubjectDisplay>(`${this.baseURL}/code/${code}`);
    return response.data;
  }

  async create(data: SubjectFormData): Promise<Subject> {
    const response = await api.post<Subject>(this.baseURL, data);
    return response.data;
  }

  async update(id: number, data: Partial<SubjectFormData>): Promise<Subject> {
    const response = await api.put<Subject>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`);
  }

  async getActive(): Promise<SubjectDisplay[]> {
    const response = await api.get<SubjectDisplay[]>(`${this.baseURL}/active`);
    return response.data;
  }
}

export class DepartmentService {
  private baseURL = '/api/departments';

  async getAll(): Promise<Department[]> {
    const response = await api.get<Department[]>(this.baseURL);
    return response.data;
  }

  async getById(id: number): Promise<Department> {
    const response = await api.get<Department>(`${this.baseURL}/${id}`);
    return response.data;
  }

  async create(data: DepartmentFormData): Promise<Department> {
    const response = await api.post<Department>(this.baseURL, data);
    return response.data;
  }

  async update(id: number, data: Partial<DepartmentFormData>): Promise<Department> {
    const response = await api.put<Department>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`);
  }

  async getActive(): Promise<Department[]> {
    const response = await api.get<Department[]>(`${this.baseURL}/active`);
    return response.data;
  }
}

export class SpecializationService {
  private baseURL = '/api/specializations';

  async getAll(): Promise<SpecializationDisplay[]> {
    const response = await api.get<SpecializationDisplay[]>(this.baseURL);
    return response.data;
  }

  async getById(id: number): Promise<SpecializationDisplay> {
    const response = await api.get<SpecializationDisplay>(`${this.baseURL}/${id}`);
    return response.data;
  }

  async getByDepartment(departmentId: number): Promise<SpecializationDisplay[]> {
    const response = await api.get<SpecializationDisplay[]>(`${this.baseURL}/department/${departmentId}`);
    return response.data;
  }

  async create(data: SpecializationFormData): Promise<Specialization> {
    const response = await api.post<Specialization>(this.baseURL, data);
    return response.data;
  }

  async update(id: number, data: Partial<SpecializationFormData>): Promise<Specialization> {
    const response = await api.put<Specialization>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`);
  }

  async getActive(): Promise<SpecializationDisplay[]> {
    const response = await api.get<SpecializationDisplay[]>(`${this.baseURL}/active`);
    return response.data;
  }
}

// Export singleton instances
export const subjectService = new SubjectService();
export const departmentService = new DepartmentService();
export const specializationService = new SpecializationService();
