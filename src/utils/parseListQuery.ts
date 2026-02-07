import type { ParsedQs } from "qs";

export type FilterFieldType = "string" | "number" | "boolean";

export type FilterFieldDefinition = {
  key: string;
  type: FilterFieldType;
};

const normalizeString = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0].trim() || undefined : undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }

  return undefined;
};

const parsePositiveNumber = (value: unknown, fallback: number): number => {
  const normalized = normalizeString(value);
  if (!normalized) {
    return fallback;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseNumberValue = (value: string): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseBooleanValue = (value: string): boolean | undefined => {
  const normalized = value.toLowerCase();
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }

  return undefined;
};

export const parseListQuery = (query: ParsedQs, filterFields: FilterFieldDefinition[]) => {
  const page = parsePositiveNumber(query.page, 1);
  const perPage = parsePositiveNumber(query.perPage, 10);
  const sortField = normalizeString(query.sortField) || "createdAt";
  const sortOrder = normalizeString(query.sortOrder) === "asc" ? 1 : -1;

  const filters: Record<string, unknown> = {};

  filterFields.forEach(({ key, type }) => {
    const rawValue = query[key];
    const normalized = normalizeString(rawValue);

    if (!normalized) {
      return;
    }

    if (type === "string") {
      filters[key] = { $regex: normalized, $options: "i" };
      return;
    }

    if (type === "number") {
      const parsedNumber = parseNumberValue(normalized);
      if (parsedNumber !== undefined) {
        filters[key] = parsedNumber;
      }
      return;
    }

    if (type === "boolean") {
      const parsedBoolean = parseBooleanValue(normalized);
      if (parsedBoolean !== undefined) {
        filters[key] = parsedBoolean;
      }
    }
  });

  return {
    pagination: {
      page,
      perPage,
      sort: { [sortField]: sortOrder as 1 | -1 },
    },
    filters,
  };
};
