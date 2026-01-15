import type { Request } from "express";
import { RequestHandler } from "express";
import createHttpError from "http-errors";

import * as services from "../services/newsService.js";
import { parseNewsQuery } from "../utils/parseNewsQuery.js";

const requireUser = (req: Request) => {
  if (!req.user) {
    throw createHttpError(401, "Authentication required");
  }

  return req.user;
};

export const getAllNewsController: RequestHandler = async (req, res, next) => {
  try {
    const user = requireUser(req);
    const { pagination, filters } = parseNewsQuery(req.query);
    const result = await services.getAllNews({
      ...pagination,
      ...filters,
      userId: user._id.toString(),
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const createNewsController: RequestHandler = async (req, res, next) => {
  try {
    const user = requireUser(req);
    const newsPayload = {
      ...req.body,
      userId: user._id.toString(),
      typeAccount: user.typeAccount ?? "freeUser",
    };

    const result = await services.createNews(newsPayload);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteNewsController: RequestHandler = async (req, res, next) => {
  try {
    const user = requireUser(req);
    const newsId = req.params.newsId;
    const existingNews = await services.getNewsById(newsId);

    if (!existingNews) {
      throw createHttpError(404, "News post not found");
    }

    if (existingNews.userId !== user._id.toString()) {
      throw createHttpError(403, "Not allowed to remove this post");
    }

    const result = await services.deleteNews(newsId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
