import type { ParsedQs } from "qs";

import type { TodoQueryFilters } from "../services/todosService.js";

type TodoQuery = ParsedQs & {
  page?: string | string[];
  perPage?: string | string[];
  sortField?: string | string[];
  sortOrder?: string | string[];
  completed?: string | string[];
  priority?: string | string[];
  category?: string | string[];
  title?: string | string[];
  tag?: string | string[];
  dueBefore?: string | string[];
  dueAfter?: string | string[];
};

const parseString = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }
  return typeof value === "string" ? value : undefined;
};

const parseNumber = (value: unknown, fallback: number): number => {
  if (Array.isArray(value)) {
    return parseNumber(value[0], fallback);
  }
  const parsed = typeof value === "string" ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseBoolean = (value: unknown): boolean | undefined => {
  const stringValue = parseString(value);
  if (typeof stringValue === "undefined") {
    return undefined;
  }
  if (stringValue === "true") return true;
  if (stringValue === "false") return false;
  return undefined;
};

const parseDate = (value: unknown): Date | undefined => {
  const stringValue = parseString(value);
  if (!stringValue) return undefined;
  const date = new Date(stringValue);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const parseTodosQuery = (query: TodoQuery) => {
  const page = parseNumber(query.page, 1);
  const perPage = parseNumber(query.perPage, 10);

  const sortField = parseString(query.sortField) || "createdAt";
  const sortOrder = parseString(query.sortOrder) === "asc" ? 1 : -1;

  const filters: TodoQueryFilters = {};

  const completed = parseBoolean(query.completed);
  if (typeof completed === "boolean") {
    filters.completed = completed;
  }

  const priority = parseString(query.priority);
  if (priority) {
    filters.priority = priority as TodoQueryFilters["priority"];
  }

  const category = parseString(query.category);
  if (category) {
    filters.category = category;
  }

  const title = parseString(query.title);
  if (title) {
    filters.title = title;
  }

  const tag = parseString(query.tag);
  if (tag) {
    filters.tag = tag;
  }

  const dueBefore = parseDate(query.dueBefore);
  if (dueBefore) {
    filters.dueBefore = dueBefore;
  }

  const dueAfter = parseDate(query.dueAfter);
  if (dueAfter) {
    filters.dueAfter = dueAfter;
  }

  return {
    pagination: { page, perPage, sort: { [sortField]: sortOrder as 1 | -1 } },
    filters,
  };
};
