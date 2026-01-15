import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const allowedTypes = ["freeUser", "paidUser", "agencyUser"] as const;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    typeAccount: {
      type: String,
      enum: allowedTypes,
      default: "freeUser",
      required: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export type UserAccountType = (typeof allowedTypes)[number];
export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

export const UserCollection = model<User>("users", userSchema);
