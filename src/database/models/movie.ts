import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
    language: {
      type: String,
      default: "English",
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

export type Movie = InferSchemaType<typeof movieSchema>;
export type MovieDocument = HydratedDocument<Movie>;

export const MovieCollection = model<Movie>("movie", movieSchema);
