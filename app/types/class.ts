export interface Class {
  id: number;
  subject: string;
  code: string;
  lecturerId: number;
  lecturerName: string;
  classType:
    | "Theory Class"
    | "Lab Class"
    | "Seminar"
    | "Workshop"
    | "Capstone Project";
  year: number;
  term: number;
  group: string;
  generation: string;
  dayOfWeek: string[];
  startTime: string;
  endTime: string;
  schedule: string;
  room: string;
  students: number;
  attendance: number;
  status: "active" | "inactive";
  semester: string;
  color: string;
  description?: string;
  sessions?: number;
  department: string;
}

export interface ClassFormData {
  subject: string;
  code: string;
  lecturerId: number;
  classType:
    | "Theory Class"
    | "Lab Class"
    | "Seminar"
    | "Workshop"
    | "Capstone Project";
  year: number;
  term: number;
  group: string;
  generation: string;
  dayOfWeek: string[];
  startTime: string;
  endTime: string;
  schedule: string;
  room: string;
  students: number;
  semester: string;
  color: string;
  description?: string;
  status: "active" | "inactive";
  department: string;
}
