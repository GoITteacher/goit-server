import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const todoSchema = new Schema(
  {
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
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    category: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export type Todo = InferSchemaType<typeof todoSchema>;
export type TodoDocument = HydratedDocument<Todo>;

export const TodoCollection = model<Todo>("todos", todoSchema);
