import crypto from "crypto";
import * as jwt from "jsonwebtoken";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import createHttpError from "http-errors";

import { UserCollection, type UserDocument } from "../database/models/user.js";
import { env } from "../utils/env.js";

const ACCESS_TOKEN_SECRET = env("ACCESS_TOKEN_SECRET", "demo-access-secret");
const ACCESS_TOKEN_EXPIRES_IN = env("ACCESS_TOKEN_EXPIRES_IN", "15m");
export const REFRESH_TOKEN_MAX_AGE_MS = Number(
  env("REFRESH_TOKEN_MAX_AGE_MS", String(1000 * 60 * 60 * 24 * 7))
);

export type AccessTokenPayload = {
  sub: string;
  email: string;
  typeAccount: string;
};

export type AuthResult = {
  accessToken: string;
  refreshToken: string;
  user: UserDocument;
};

interface RegisterUserPayload {
  email: string;
  name: string;
  password: string;
  typeAccount?: string;
}

const hashPassword = (value: string) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

const createAccessToken = (user: UserDocument) => {
  const options: SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      typeAccount: user.typeAccount,
    },
    ACCESS_TOKEN_SECRET,
    options
  );
};

const createRefreshToken = () => crypto.randomUUID();

const buildAuthResult = async (user: UserDocument): Promise<AuthResult> => {
  const refreshToken = createRefreshToken();
  user.refreshToken = refreshToken;
  const updatedUser = await user.save();

  return {
    accessToken: createAccessToken(updatedUser),
    refreshToken,
    user: updatedUser,
  };
};

export const registerUser = async ({
  email,
  name,
  password,
  typeAccount,
}: RegisterUserPayload): Promise<AuthResult> => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await UserCollection.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw createHttpError(409, "Email has already been registered");
  }

  const user = await UserCollection.create({
    email: normalizedEmail,
    name,
    passwordHash: hashPassword(password),
    typeAccount: typeAccount ?? "freeUser",
  });

  return buildAuthResult(user);
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await UserCollection.findOne({ email: normalizedEmail });

  if (!user || user.passwordHash !== hashPassword(password)) {
    throw createHttpError(401, "Invalid email or password");
  }

  return buildAuthResult(user);
};

export const refreshTokens = async (refreshToken: string): Promise<AuthResult> => {
  if (!refreshToken) {
    throw createHttpError(401, "Missing refresh token");
  }

  const user = await UserCollection.findOne({ refreshToken });
  if (!user) {
    throw createHttpError(401, "Refresh token is invalid");
  }

  return buildAuthResult(user);
};

export const logoutUser = async (refreshToken?: string) => {
  if (!refreshToken) {
    return;
  }

  await UserCollection.findOneAndUpdate(
    { refreshToken },
    { $unset: { refreshToken: "" } }
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.typeAccount !== "string"
    ) {
      throw new Error("Access token is malformed");
    }

    return {
      sub: payload.sub,
      email: payload.email,
      typeAccount: payload.typeAccount,
    };
  } catch (error) {
    throw createHttpError(401, "Invalid or expired access token");
  }
};
