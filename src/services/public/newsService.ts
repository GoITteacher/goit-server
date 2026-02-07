import { CatalogNewsCollection, type CatalogNews } from "../../database/models/catalogNews.js";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  PaginatedQueryOptions,
  updateDocument,
} from "./utils.js";

export type CatalogNewsQueryOptions = PaginatedQueryOptions<CatalogNews>;
export type CatalogNewsCreatePayload = Omit<CatalogNews, "createdAt" | "updatedAt">;
export type CatalogNewsUpdatePayload = Partial<CatalogNewsCreatePayload>;

export const listCatalogNews = (options: CatalogNewsQueryOptions) =>
  listDocuments(CatalogNewsCollection, options);

export const getCatalogNewsById = (newsId: string) => getDocument(CatalogNewsCollection, newsId);
export const createCatalogNews = (payload: CatalogNewsCreatePayload) =>
  createDocument(CatalogNewsCollection, payload);
export const updateCatalogNews = (newsId: string, updates: CatalogNewsUpdatePayload) =>
  updateDocument(CatalogNewsCollection, newsId, updates);
export const deleteCatalogNews = (newsId: string) => deleteDocument(CatalogNewsCollection, newsId);
