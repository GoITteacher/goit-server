import type { RequestHandler } from "express";
import createHttpError from "http-errors";

import * as newsService from "../../services/public/newsService.js";
import { parseListQuery, type FilterFieldDefinition } from "../../utils/parseListQuery.js";
import {
  optionalStringField,
  parseDateField,
  parseEnumField,
  parseTagsField,
  requireStringField,
} from "./fieldParsers.js";

const filterFields: FilterFieldDefinition[] = [
  { key: "title", type: "string" },
  { key: "category", type: "string" },
  { key: "source", type: "string" },
  { key: "tags", type: "string" },
];

const categoryOptions = [
  "technology",
  "business",
  "health",
  "lifestyle",
  "science",
  "entertainment",
] as const;

const buildNewsCreatePayload = (body: Record<string, unknown>) => {
  const tags = parseTagsField(body.tags);

  return {
    title: requireStringField(body.title, "title"),
    summary: requireStringField(body.summary, "summary"),
    source: requireStringField(body.source, "source"),
    category: parseEnumField(body.category, "category", categoryOptions),
    publishedAt: parseDateField(body.publishedAt, "publishedAt"),
    url: optionalStringField(body.url),
    tags: tags ?? [],
  };
};

const buildNewsUpdatePayload = (body: Record<string, unknown>): newsService.CatalogNewsUpdatePayload => {
  const updates: newsService.CatalogNewsUpdatePayload = {};

  if (body.title !== undefined) {
    updates.title = requireStringField(body.title, "title");
  }
  if (body.summary !== undefined) {
    updates.summary = requireStringField(body.summary, "summary");
  }
  if (body.source !== undefined) {
    updates.source = requireStringField(body.source, "source");
  }
  if (body.category !== undefined) {
    updates.category = parseEnumField(body.category, "category", categoryOptions);
  }
  if (body.publishedAt !== undefined) {
    updates.publishedAt = parseDateField(body.publishedAt, "publishedAt");
  }
  if (body.url !== undefined) {
    updates.url = optionalStringField(body.url);
  }
  if (body.tags !== undefined) {
    updates.tags = parseTagsField(body.tags) ?? [];
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, "No valid fields provided for update");
  }

  return updates;
};

export const listCatalogNews: RequestHandler = async (req, res) => {
  const { pagination, filters } = parseListQuery(req.query, filterFields);
  const result = await newsService.listCatalogNews({ ...pagination, filters });
  res.status(200).json(result);
};

export const getCatalogNewsById: RequestHandler = async (req, res) => {
  const record = await newsService.getCatalogNewsById(req.params.newsId);

  if (!record) {
    throw createHttpError(404, "Catalog news record not found");
  }

  res.status(200).json({ item: record });
};

export const createCatalogNews: RequestHandler = async (req, res) => {
  const payload = buildNewsCreatePayload(req.body);
  const record = await newsService.createCatalogNews(payload);
  res.status(201).json({ item: record });
};

export const updateCatalogNews: RequestHandler = async (req, res) => {
  const updates = buildNewsUpdatePayload(req.body);
  const record = await newsService.updateCatalogNews(req.params.newsId, updates);

  if (!record) {
    throw createHttpError(404, "Catalog news record not found");
  }

  res.status(200).json({ item: record });
};

export const deleteCatalogNews: RequestHandler = async (req, res) => {
  const record = await newsService.deleteCatalogNews(req.params.newsId);

  if (!record) {
    throw createHttpError(404, "Catalog news record not found");
  }

  res.status(204).end();
};
