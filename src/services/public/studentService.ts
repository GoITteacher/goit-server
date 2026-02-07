import { StudentCollection, type Student } from "../../database/models/student.js";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  PaginatedQueryOptions,
  updateDocument,
} from "./utils.js";

export type StudentQueryOptions = PaginatedQueryOptions<Student>;
export type StudentCreatePayload = Omit<Student, "createdAt" | "updatedAt">;
export type StudentUpdatePayload = Partial<StudentCreatePayload>;

export const listStudents = (options: StudentQueryOptions) =>
  listDocuments(StudentCollection, options);
export const getStudentById = (studentId: string) => getDocument(StudentCollection, studentId);
export const createStudent = (payload: StudentCreatePayload) =>
  createDocument(StudentCollection, payload);
export const updateStudent = (studentId: string, updates: StudentUpdatePayload) =>
  updateDocument(StudentCollection, studentId, updates);
export const deleteStudent = (studentId: string) => deleteDocument(StudentCollection, studentId);
