import { LessonCollection, type Lesson } from "../../database/models/lesson.js";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  PaginatedQueryOptions,
  updateDocument,
} from "./utils.js";

export type LessonQueryOptions = PaginatedQueryOptions<Lesson>;
export type LessonCreatePayload = Omit<Lesson, "createdAt" | "updatedAt">;
export type LessonUpdatePayload = Partial<LessonCreatePayload>;

export const listLessons = (options: LessonQueryOptions) =>
  listDocuments(LessonCollection, options);
export const getLessonById = (lessonId: string) => getDocument(LessonCollection, lessonId);
export const createLesson = (payload: LessonCreatePayload) =>
  createDocument(LessonCollection, payload);
export const updateLesson = (lessonId: string, updates: LessonUpdatePayload) =>
  updateDocument(LessonCollection, lessonId, updates);
export const deleteLesson = (lessonId: string) => deleteDocument(LessonCollection, lessonId);
