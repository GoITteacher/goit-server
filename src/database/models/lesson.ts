import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
    teacher: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: Date,
      required: true,
    },
    summary: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type Lesson = InferSchemaType<typeof lessonSchema>;
export type LessonDocument = HydratedDocument<Lesson>;

export const LessonCollection = model<Lesson>("lesson", lessonSchema);
