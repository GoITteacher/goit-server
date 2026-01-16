import { TaskCollection, type Task } from "../database/models/task.js";

export type TaskCreationData = Pick<Task, "userId" | "title"> &
  Partial<Pick<Task, "description" | "status" | "dueDate">>;

export type TaskUpdateData = Partial<Pick<Task, "title" | "description" | "status" | "dueDate">>;

export const listTasksForUser = async (userId: string) => {
  return TaskCollection.find({ userId }).sort({ createdAt: -1 });
};

export const getTaskForUser = async (taskId: string, userId: string) => {
  return TaskCollection.findOne({ _id: taskId, userId });
};

export const createTask = async (payload: TaskCreationData) => {
  return TaskCollection.create(payload);
};

export const updateTask = async (taskId: string, userId: string, updates: TaskUpdateData) => {
  return TaskCollection.findOneAndUpdate({ _id: taskId, userId }, updates, {
    new: true,
  });
};

export const deleteTask = async (taskId: string, userId: string) => {
  return TaskCollection.findOneAndDelete({ _id: taskId, userId });
};
