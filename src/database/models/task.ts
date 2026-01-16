import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const allowedStatuses = ["todo", "in-progress", "done"] as const;

const taskSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: allowedStatuses,
      default: "todo",
      required: true,
    },
    dueDate: {
      type: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export type TaskStatus = (typeof allowedStatuses)[number];
export type Task = InferSchemaType<typeof taskSchema>;
export type TaskDocument = HydratedDocument<Task>;

export const TaskCollection = model<Task>("tasks", taskSchema);
