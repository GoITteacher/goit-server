import type { FilterQuery } from "mongoose";

import { TodoCollection, type Todo } from "../database/models/todo.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export type TodoQueryFilters = {
  completed?: boolean;
  priority?: Todo["priority"];
  category?: string;
  title?: string;
  tag?: string;
  dueBefore?: Date;
  dueAfter?: Date;
};

export type TodoQueryOptions = TodoQueryFilters & {
  page?: number;
  perPage?: number;
  sort?: Record<string, 1 | -1>;
};

export type TodoCreationData = Pick<Todo, "title"> &
  Partial<Pick<Todo, "description" | "completed" | "priority" | "dueDate" | "category" | "tags">>;

export type TodoUpdateData = Partial<Pick<Todo, "title" | "description" | "completed" | "priority" | "dueDate" | "category" | "tags">>;

export const listTodos = async ({
  page = 1,
  perPage = 10,
  sort = { createdAt: -1 },
  ...filters
}: TodoQueryOptions) => {
  const offset = (page - 1) * perPage;
  const query: FilterQuery<Todo> = {};

  if (typeof filters.completed === "boolean") {
    query.completed = filters.completed;
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }

  if (filters.category) {
    query.category = { $regex: filters.category, $options: "i" };
  }

  if (filters.title) {
    query.title = { $regex: filters.title, $options: "i" };
  }

  if (filters.tag) {
    query.tags = filters.tag;
  }

  if (filters.dueBefore || filters.dueAfter) {
    const dueFilter: FilterQuery<Todo>["dueDate"] = {};

    if (filters.dueBefore) {
      dueFilter.$lte = filters.dueBefore;
    }
    if (filters.dueAfter) {
      dueFilter.$gte = filters.dueAfter;
    }

    query.dueDate = dueFilter;
  }

  try {
    const total = await TodoCollection.countDocuments(query);
    const todos = await TodoCollection.find(query).sort(sort).skip(offset).limit(perPage);

    return {
      ...calculatePaginationData(total, page, perPage),
      todos,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Error fetching todos: ${message}`);
  }
};

export const getTodoById = async (todoId: string) => {
  return TodoCollection.findById(todoId);
};

export const createTodo = async (payload: TodoCreationData) => {
  return TodoCollection.create(payload);
};

export const updateTodo = async (todoId: string, updates: TodoUpdateData) => {
  return TodoCollection.findByIdAndUpdate(todoId, updates, { new: true });
};

export const deleteTodo = async (todoId: string) => {
  return TodoCollection.findByIdAndDelete(todoId);
};
