import type { Request, RequestHandler } from "express";
import createHttpError from "http-errors";

import * as tasksService from "../services/tasksService.js";

const requireUser = (req: Request) => {
  if (!req.user) {
    throw createHttpError(401, "Authentication required");
  }

  return req.user;
};

export const listTasksController: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  const tasks = await tasksService.listTasksForUser(user._id.toString());
  res.status(200).json({ tasks });
};

export const getTaskController: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  const task = await tasksService.getTaskForUser(
    req.params.taskId,
    user._id.toString()
  );

  if (!task) {
    throw createHttpError(404, "Task not found");
  }

  res.status(200).json({ task });
};

export const createTaskController: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  const { title, description, status, dueDate } = req.body;

  if (!title || typeof title !== "string") {
    throw createHttpError(400, "Task title is required");
  }

  const payload: tasksService.TaskCreationData = {
    userId: user._id.toString(),
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : "",
    status: typeof status === "string" ? (status as tasksService.TaskCreationData["status"]) : undefined,
    dueDate: dueDate ? new Date(dueDate) : undefined,
  };

  const task = await tasksService.createTask(payload);
  res.status(201).json({ task });
};

export const updateTaskController: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  const updates: tasksService.TaskUpdateData = {};

  if (req.body.title) {
    updates.title = String(req.body.title).trim();
  }
  if (req.body.description) {
    updates.description = String(req.body.description).trim();
  }
  if (req.body.status) {
    updates.status = String(req.body.status) as tasksService.TaskUpdateData["status"];
  }
  if (req.body.dueDate) {
    updates.dueDate = new Date(req.body.dueDate);
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, "No valid fields provided for update");
  }

  const task = await tasksService.updateTask(
    req.params.taskId,
    user._id.toString(),
    updates
  );

  if (!task) {
    throw createHttpError(404, "Task not found");
  }

  res.status(200).json({ task });
};

export const deleteTaskController: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  const task = await tasksService.deleteTask(
    req.params.taskId,
    user._id.toString()
  );

  if (!task) {
    throw createHttpError(404, "Task not found");
  }

  res.status(204).end();
};
