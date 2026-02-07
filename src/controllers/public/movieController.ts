import type { RequestHandler } from "express";
import createHttpError from "http-errors";

import * as movieService from "../../services/public/movieService.js";
import { parseListQuery, type FilterFieldDefinition } from "../../utils/parseListQuery.js";
import {
  optionalNumberInRangeField,
  optionalStringField,
  parsePositiveNumberField,
  requireStringField,
} from "./fieldParsers.js";

const filterFields: FilterFieldDefinition[] = [
  { key: "title", type: "string" },
  { key: "director", type: "string" },
  { key: "genre", type: "string" },
  { key: "language", type: "string" },
  { key: "releaseYear", type: "number" },
  { key: "rating", type: "number" },
];

const buildMovieCreatePayload = (body: Record<string, unknown>) => ({
  title: requireStringField(body.title, "title"),
  director: requireStringField(body.director, "director"),
  genre: requireStringField(body.genre, "genre"),
  releaseYear: parsePositiveNumberField(body.releaseYear, "releaseYear"),
  rating: optionalNumberInRangeField(body.rating, "rating", 0, 10),
  durationMinutes: parsePositiveNumberField(body.durationMinutes, "durationMinutes"),
  language: optionalStringField(body.language) ?? "English",
  summary: optionalStringField(body.summary),
});

const buildMovieUpdatePayload = (body: Record<string, unknown>): movieService.MovieUpdatePayload => {
  const updates: movieService.MovieUpdatePayload = {};

  if (body.title !== undefined) {
    updates.title = requireStringField(body.title, "title");
  }
  if (body.director !== undefined) {
    updates.director = requireStringField(body.director, "director");
  }
  if (body.genre !== undefined) {
    updates.genre = requireStringField(body.genre, "genre");
  }
  if (body.releaseYear !== undefined) {
    updates.releaseYear = parsePositiveNumberField(body.releaseYear, "releaseYear");
  }
  if (body.rating !== undefined) {
    updates.rating = optionalNumberInRangeField(body.rating, "rating", 0, 10);
  }
  if (body.durationMinutes !== undefined) {
    updates.durationMinutes = parsePositiveNumberField(body.durationMinutes, "durationMinutes");
  }
  if (body.language !== undefined) {
    updates.language = optionalStringField(body.language);
  }
  if (body.summary !== undefined) {
    updates.summary = optionalStringField(body.summary);
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, "No valid fields provided for update");
  }

  return updates;
};

export const listMovies: RequestHandler = async (req, res) => {
  const { pagination, filters } = parseListQuery(req.query, filterFields);
  const result = await movieService.listMovies({ ...pagination, filters });
  res.status(200).json(result);
};

export const getMovieById: RequestHandler = async (req, res) => {
  const movie = await movieService.getMovieById(req.params.movieId);

  if (!movie) {
    throw createHttpError(404, "Movie not found");
  }

  res.status(200).json({ item: movie });
};

export const createMovie: RequestHandler = async (req, res) => {
  const payload = buildMovieCreatePayload(req.body);
  const movie = await movieService.createMovie(payload);
  res.status(201).json({ item: movie });
};

export const updateMovie: RequestHandler = async (req, res) => {
  const updates = buildMovieUpdatePayload(req.body);
  const movie = await movieService.updateMovie(req.params.movieId, updates);

  if (!movie) {
    throw createHttpError(404, "Movie not found");
  }

  res.status(200).json({ item: movie });
};

export const deleteMovie: RequestHandler = async (req, res) => {
  const movie = await movieService.deleteMovie(req.params.movieId);

  if (!movie) {
    throw createHttpError(404, "Movie not found");
  }

  res.status(204).end();
};
