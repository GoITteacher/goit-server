import type { RequestHandler } from "express";
import createHttpError from "http-errors";

import { UserCollection } from "../database/models/user.js";
import { verifyAccessToken } from "../services/authService.js";

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw createHttpError(401, "Access token is missing");
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    const user = await UserCollection.findById(payload.sub);
    if (!user) {
      throw createHttpError(401, "User not found");
    }

    req.user = user;
    req.typeAccount = user.typeAccount ?? null;

    next();
  } catch (error) {
    next(error);
  }
};
