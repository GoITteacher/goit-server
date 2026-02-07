import type { Request, RequestHandler } from "express";
import createHttpError from "http-errors";

import * as todosService from "../services/todosService.js";
import { parseTodosQuery } from "../utils/parseTodosQuery.js";

export const listTodosController: RequestHandler = async (req, res) => {
  const { pagination, filters } = parseTodosQuery(req.query);
  const result = await todosService.listTodos({ ...pagination, ...filters });
  res.status(200).json(result);
};

export const getTodoController: RequestHandler = async (req, res) => {
  const todo = await todosService.getTodoById(req.params.todoId);
  if (!todo) {
    throw createHttpError(404, "Todo not found");
  }
  res.status(200).json({ todo });
};

export const createTodoController: RequestHandler = async (req, res) => {
  const { title, description, completed, priority, dueDate, category, tags } = req.body;

  if (!title || typeof title !== "string") {
    throw createHttpError(400, "Title is required");
  }

  const payload: todosService.TodoCreationData = {
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : undefined,
    completed: typeof completed === "boolean" ? completed : undefined,
    priority: typeof priority === "string" ? (priority as todosService.TodoCreationData["priority"]) : undefined,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    category: typeof category === "string" ? category.trim() : undefined,
    tags: Array.isArray(tags) ? tags.map(String) : undefined,
  };

  const todo = await todosService.createTodo(payload);
  res.status(201).json({ todo });
};

export const updateTodoController: RequestHandler = async (req, res) => {
  const updates: todosService.TodoUpdateData = {};

  if (req.body.title) {
    updates.title = String(req.body.title).trim();
  }
  if (req.body.description) {
    updates.description = String(req.body.description).trim();
  }
  if (typeof req.body.completed === "boolean") {
    updates.completed = req.body.completed;
  }
  if (req.body.priority) {
    updates.priority = String(req.body.priority) as todosService.TodoUpdateData["priority"];
  }
  if (req.body.dueDate) {
    updates.dueDate = new Date(req.body.dueDate);
  }
  if (req.body.category) {
    updates.category = String(req.body.category).trim();
  }
  if (req.body.tags) {
    updates.tags = Array.isArray(req.body.tags)
      ? req.body.tags.map(String)
      : undefined;
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, "No valid fields provided for update");
  }

  const todo = await todosService.updateTodo(req.params.todoId, updates);

  if (!todo) {
    throw createHttpError(404, "Todo not found");
  }

  res.status(200).json({ todo });
};

export const deleteTodoController: RequestHandler = async (req, res) => {
  const todo = await todosService.deleteTodo(req.params.todoId);

  if (!todo) {
    throw createHttpError(404, "Todo not found");
  }

  res.status(204).end();
};
