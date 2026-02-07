import type { RequestHandler } from "express";
import createHttpError from "http-errors";

import * as lessonService from "../../services/public/lessonService.js";
import { parseListQuery, type FilterFieldDefinition } from "../../utils/parseListQuery.js";
import {
  optionalEnumField,
  optionalStringField,
  parseDateField,
  parsePositiveNumberField,
  requireStringField,
} from "./fieldParsers.js";

const filterFields: FilterFieldDefinition[] = [
  { key: "title", type: "string" },
  { key: "subject", type: "string" },
  { key: "level", type: "string" },
  { key: "teacher", type: "string" },
  { key: "durationMinutes", type: "number" },
];

const levelOptions = ["beginner", "intermediate", "advanced"] as const;

const buildLessonCreatePayload = (body: Record<string, unknown>) => ({
  title: requireStringField(body.title, "title"),
  subject: requireStringField(body.subject, "subject"),
  level: optionalEnumField(body.level, "level", levelOptions) ?? "beginner",
  teacher: requireStringField(body.teacher, "teacher"),
  durationMinutes: parsePositiveNumberField(body.durationMinutes, "durationMinutes"),
  publishedAt: parseDateField(body.publishedAt, "publishedAt"),
  summary: optionalStringField(body.summary),
});

const buildLessonUpdatePayload = (body: Record<string, unknown>): lessonService.LessonUpdatePayload => {
  const updates: lessonService.LessonUpdatePayload = {};

  if (body.title !== undefined) {
    updates.title = requireStringField(body.title, "title");
  }
  if (body.subject !== undefined) {
    updates.subject = requireStringField(body.subject, "subject");
  }
  if (body.level !== undefined) {
    updates.level = optionalEnumField(body.level, "level", levelOptions);
  }
  if (body.teacher !== undefined) {
    updates.teacher = requireStringField(body.teacher, "teacher");
  }
  if (body.durationMinutes !== undefined) {
    updates.durationMinutes = parsePositiveNumberField(body.durationMinutes, "durationMinutes");
  }
  if (body.publishedAt !== undefined) {
    updates.publishedAt = parseDateField(body.publishedAt, "publishedAt");
  }
  if (body.summary !== undefined) {
    updates.summary = optionalStringField(body.summary);
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, "No valid fields provided for update");
  }

  return updates;
};

export const listLessons: RequestHandler = async (req, res) => {
  const { pagination, filters } = parseListQuery(req.query, filterFields);
  const result = await lessonService.listLessons({ ...pagination, filters });
  res.status(200).json(result);
};

export const getLessonById: RequestHandler = async (req, res) => {
  const lesson = await lessonService.getLessonById(req.params.lessonId);

  if (!lesson) {
    throw createHttpError(404, "Lesson not found");
  }

  res.status(200).json({ item: lesson });
};

export const createLesson: RequestHandler = async (req, res) => {
  const payload = buildLessonCreatePayload(req.body);
  const lesson = await lessonService.createLesson(payload);
  res.status(201).json({ item: lesson });
};

export const updateLesson: RequestHandler = async (req, res) => {
  const updates = buildLessonUpdatePayload(req.body);
  const lesson = await lessonService.updateLesson(req.params.lessonId, updates);

  if (!lesson) {
    throw createHttpError(404, "Lesson not found");
  }

  res.status(200).json({ item: lesson });
};

export const deleteLesson: RequestHandler = async (req, res) => {
  const lesson = await lessonService.deleteLesson(req.params.lessonId);

  if (!lesson) {
    throw createHttpError(404, "Lesson not found");
  }

  res.status(204).end();
};
