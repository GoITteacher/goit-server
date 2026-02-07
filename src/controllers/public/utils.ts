import createHttpError from "http-errors";

const normalizeString = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }

  return undefined;
};

export const requireStringField = (value: unknown, fieldName: string) => {
  const normalized = normalizeString(value);
  if (!normalized) {
    throw createHttpError(400, `${fieldName} is required`);
  }

  return normalized;
};

export const optionalStringField = (value: unknown) => normalizeString(value);

export const optionalNumberField = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }

    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

export const optionalBooleanField = (value: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }

  return undefined;
};

export const optionalDateField = (value: unknown) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value as string);
  return Number.isFinite(date.valueOf()) ? date : undefined;
};

export const optionalStringArrayField = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return undefined;
};
