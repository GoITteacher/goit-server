import createHttpError from "http-errors";

const normalizeString = (value: unknown): string => {
  if (typeof value === "string") {
    return value.trim();
  }

  return "";
};

const coerceNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      return NaN;
    }
    return Number(trimmed);
  }

  return NaN;
};

export const requireStringField = (value: unknown, fieldName: string): string => {
  const normalized = normalizeString(value);
  if (!normalized) {
    throw createHttpError(400, `${fieldName} is required`);
  }

  return normalized;
};

export const optionalStringField = (value: unknown): string | undefined => {
  const normalized = normalizeString(value);
  return normalized === "" ? undefined : normalized;
};

export const parseNumberField = (value: unknown, fieldName: string): number => {
  const parsed = coerceNumber(value);
  if (!Number.isFinite(parsed)) {
    throw createHttpError(400, `${fieldName} must be a valid number`);
  }

  return parsed;
};

export const parsePositiveNumberField = (value: unknown, fieldName: string): number => {
  const parsed = parseNumberField(value, fieldName);
  if (parsed <= 0) {
    throw createHttpError(400, `${fieldName} must be greater than zero`);
  }

  return parsed;
};

export const optionalNumberField = (value: unknown, fieldName: string): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return parseNumberField(value, fieldName);
};

export const optionalPositiveNumberField = (
  value: unknown,
  fieldName: string
): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return parsePositiveNumberField(value, fieldName);
};

export const parseNumberInRangeField = (
  value: unknown,
  fieldName: string,
  min: number,
  max: number
): number => {
  const parsed = parseNumberField(value, fieldName);
  if (parsed < min || parsed > max) {
    throw createHttpError(400, `${fieldName} must be between ${min} and ${max}`);
  }

  return parsed;
};

export const optionalNumberInRangeField = (
  value: unknown,
  fieldName: string,
  min: number,
  max: number
): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return parseNumberInRangeField(value, fieldName, min, max);
};

export const parseDateField = (value: unknown, fieldName: string): Date => {
  if (value === undefined || value === null) {
    throw createHttpError(400, `${fieldName} is required`);
  }

  const parsed = new Date(value as string);
  if (Number.isNaN(parsed.getTime())) {
    throw createHttpError(400, `${fieldName} must be a valid date`);
  }

  return parsed;
};

export const optionalDateField = (
  value: unknown,
  fieldName: string
): Date | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return parseDateField(value, fieldName);
};

const normalizeEnumValue = (value: unknown): string => {
  if (typeof value === "string") {
    return value.trim();
  }

  return "";
};

export const parseEnumField = <T extends string>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[]
): T => {
  const normalized = normalizeEnumValue(value);
  if (!allowedValues.includes(normalized as T)) {
    throw createHttpError(
      400,
      `${fieldName} must be one of: ${allowedValues.join(", ")}`
    );
  }

  return normalized as T;
};

export const optionalEnumField = <T extends string>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[]
): T | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return parseEnumField(value, fieldName, allowedValues);
};

export const optionalBooleanField = (value: unknown, fieldName: string): boolean | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }

  throw createHttpError(400, `${fieldName} must be true or false`);
};

export const parseTagsField = (value: unknown): string[] | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const values = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  const filtered = values
    .map((item) => (typeof item === "string" ? item.trim() : String(item).trim()))
    .filter((item) => item !== "");

  return filtered.length ? filtered : undefined;
};
