import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const studentSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    major: {
      type: String,
      required: true,
    },
    cohortYear: {
      type: Number,
      required: true,
    },
    gpa: {
      type: Number,
      min: 0,
      max: 4,
      default: 0,
    },
    enrolled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type Student = InferSchemaType<typeof studentSchema>;
export type StudentDocument = HydratedDocument<Student>;

export const StudentCollection = model<Student>("student", studentSchema);
