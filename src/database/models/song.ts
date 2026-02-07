import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const songSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
      default: "",
    },
    genre: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    durationSeconds: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
    },
    language: {
      type: String,
      default: "English",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type Song = InferSchemaType<typeof songSchema>;
export type SongDocument = HydratedDocument<Song>;

export const SongCollection = model<Song>("song", songSchema);
