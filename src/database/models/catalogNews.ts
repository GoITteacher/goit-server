import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const catalogNewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["technology", "business", "health", "lifestyle", "science", "entertainment"],
    },
    publishedAt: {
      type: Date,
      required: true,
    },
    url: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type CatalogNews = InferSchemaType<typeof catalogNewsSchema>;
export type CatalogNewsDocument = HydratedDocument<CatalogNews>;

export const CatalogNewsCollection = model<CatalogNews>("catalogNews", catalogNewsSchema);
