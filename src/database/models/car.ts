import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const carSchema = new Schema(
  {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mileage: {
      type: Number,
      default: 0,
    },
    fuelType: {
      type: String,
      required: true,
      enum: ["gasoline", "diesel", "electric", "hybrid"],
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type Car = InferSchemaType<typeof carSchema>;
export type CarDocument = HydratedDocument<Car>;

export const CarCollection = model<Car>("car", carSchema);
