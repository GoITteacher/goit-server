import type { FilterQuery, Model, UpdateQuery } from "mongoose";

import { calculatePaginationData, type PaginationMeta } from "../../utils/calculatePaginationData.js";

export type PaginationOptions = {
  page?: number;
  perPage?: number;
  sort?: Record<string, 1 | -1>;
};

export type PaginatedQueryOptions<T> = PaginationOptions & {
  filters?: FilterQuery<T>;
};

export type PaginatedResult<T> = PaginationMeta & {
  items: T[];
};

export const listDocuments = async <T>(
  model: Model<T>,
  {
    filters = {},
    page = 1,
    perPage = 10,
    sort = { createdAt: -1 },
  }: PaginatedQueryOptions<T>
): Promise<PaginatedResult<T>> => {
  const offset = (page - 1) * perPage;
  const totalItems = await model.countDocuments(filters);
  const items = await model.find(filters).sort(sort).skip(offset).limit(perPage);
  const pagination = calculatePaginationData(totalItems, page, perPage);

  return {
    ...pagination,
    items,
  };
};

export const createDocument = async <T>(
  model: Model<T>,
  payload: Parameters<Model<T>["create"]>[0]
) => model.create(payload);

export const updateDocument = async <T>(
  model: Model<T>,
  id: string,
  updates: UpdateQuery<T>
) =>
  model.findByIdAndUpdate(id, updates, {
    new: true,
  });

export const deleteDocument = async <T>(model: Model<T>, id: string) =>
  model.findByIdAndDelete(id);

export const getDocument = <T>(model: Model<T>, id: string) =>
  model.findById(id);
