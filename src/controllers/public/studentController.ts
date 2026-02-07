import type { RequestHandler } from "express";
import createHttpError from "http-errors";

import * as studentService from "../../services/public/studentService.js";
import { parseListQuery, type FilterFieldDefinition } from "../../utils/parseListQuery.js";
import {
  optionalBooleanField,
  optionalStringField,
  optionalNumberInRangeField,
  optionalPositiveNumberField,
  parsePositiveNumberField,
  requireStringField,
} from "./fieldParsers.js";

const filterFields: FilterFieldDefinition[] = [
  { key: "firstName", type: "string" },
  { key: "lastName", type: "string" },
  { key: "major", type: "string" },
  { key: "cohortYear", type: "number" },
  { key: "gpa", type: "number" },
  { key: "enrolled", type: "boolean" },
];

const buildStudentCreatePayload = (body: Record<string, unknown>) => ({
  firstName: requireStringField(body.firstName, "firstName"),
  lastName: requireStringField(body.lastName, "lastName"),
  major: requireStringField(body.major, "major"),
  cohortYear: parsePositiveNumberField(body.cohortYear, "cohortYear"),
  gpa: optionalNumberInRangeField(body.gpa, "gpa", 0, 4) ?? 0,
  enrolled: optionalBooleanField(body.enrolled, "enrolled") ?? true,
});

const buildStudentUpdatePayload = (body: Record<string, unknown>): studentService.StudentUpdatePayload => {
  const updates: studentService.StudentUpdatePayload = {};

  if (body.firstName !== undefined) {
    updates.firstName = requireStringField(body.firstName, "firstName");
  }
  if (body.lastName !== undefined) {
    updates.lastName = requireStringField(body.lastName, "lastName");
  }
  if (body.major !== undefined) {
    updates.major = requireStringField(body.major, "major");
  }
  if (body.cohortYear !== undefined) {
    updates.cohortYear = parsePositiveNumberField(body.cohortYear, "cohortYear");
  }
  if (body.gpa !== undefined) {
    updates.gpa = optionalNumberInRangeField(body.gpa, "gpa", 0, 4);
  }
  if (body.enrolled !== undefined) {
    updates.enrolled = optionalBooleanField(body.enrolled, "enrolled");
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, "No valid fields provided for update");
  }

  return updates;
};

export const listStudents: RequestHandler = async (req, res) => {
  const { pagination, filters } = parseListQuery(req.query, filterFields);
  const result = await studentService.listStudents({ ...pagination, filters });
  res.status(200).json(result);
};

export const getStudentById: RequestHandler = async (req, res) => {
  const student = await studentService.getStudentById(req.params.studentId);

  if (!student) {
    throw createHttpError(404, "Student not found");
  }

  res.status(200).json({ item: student });
};

export const createStudent: RequestHandler = async (req, res) => {
  const payload = buildStudentCreatePayload(req.body);
  const student = await studentService.createStudent(payload);
  res.status(201).json({ item: student });
};

export const updateStudent: RequestHandler = async (req, res) => {
  const updates = buildStudentUpdatePayload(req.body);
  const student = await studentService.updateStudent(req.params.studentId, updates);

  if (!student) {
    throw createHttpError(404, "Student not found");
  }

  res.status(200).json({ item: student });
};

export const deleteStudent: RequestHandler = async (req, res) => {
  const student = await studentService.deleteStudent(req.params.studentId);

  if (!student) {
    throw createHttpError(404, "Student not found");
  }

  res.status(204).end();
};
