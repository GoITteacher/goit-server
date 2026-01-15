import type { RequestHandler, Response } from "express";
import createHttpError from "http-errors";

import * as authService from "../services/authService.js";
import type { UserDocument } from "../database/models/user.js";

const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: authService.REFRESH_TOKEN_MAX_AGE_MS,
  path: "/",
};

const formatUser = (user: UserDocument) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  typeAccount: user.typeAccount,
});

const attachRefreshCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_COOKIE_NAME, token, REFRESH_COOKIE_OPTIONS);
};

export const registerUserController: RequestHandler = async (req, res) => {
  const { email, password, name, typeAccount } = req.body;

  if (!email || !password || !name) {
    throw createHttpError(400, "Email, name, and password are required.");
  }

  const { accessToken, refreshToken, user } = await authService.registerUser({
    email,
    name,
    password,
    typeAccount,
  });

  attachRefreshCookie(res, refreshToken);
  res.status(201).json({
    accessToken,
    user: formatUser(user),
  });
};

export const loginController: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError(400, "Email and password are required.");
  }

  const { accessToken, refreshToken, user } = await authService.loginUser(
    email,
    password
  );

  attachRefreshCookie(res, refreshToken);
  res.status(200).json({
    accessToken,
    user: formatUser(user),
  });
};

export const refreshController: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!refreshToken) {
    throw createHttpError(401, "Refresh token is missing.");
  }

  const { accessToken, refreshToken: newToken, user } =
    await authService.refreshTokens(refreshToken);

  attachRefreshCookie(res, newToken);
  res.status(200).json({
    accessToken,
    user: formatUser(user),
  });
};

export const logoutController: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  await authService.logoutUser(refreshToken);
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/" });
  res.status(204).end();
};

export const getMeController: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw createHttpError(401, "Not authenticated");
  }

  res.status(200).json({
    user: formatUser(req.user),
  });
};
