import type { RequestHandler } from "express";
import createHttpError from "http-errors";

import * as songService from "../../services/public/songService.js";
import { parseListQuery, type FilterFieldDefinition } from "../../utils/parseListQuery.js";
import {
  optionalPositiveNumberField,
  optionalStringField,
  parsePositiveNumberField,
  requireStringField,
} from "./fieldParsers.js";

const filterFields: FilterFieldDefinition[] = [
  { key: "title", type: "string" },
  { key: "artist", type: "string" },
  { key: "genre", type: "string" },
  { key: "language", type: "string" },
  { key: "label", type: "string" },
  { key: "releaseYear", type: "number" },
];

const buildSongCreatePayload = (body: Record<string, unknown>) => ({
  title: requireStringField(body.title, "title"),
  artist: requireStringField(body.artist, "artist"),
  album: optionalStringField(body.album) ?? "",
  genre: requireStringField(body.genre, "genre"),
  releaseYear: parsePositiveNumberField(body.releaseYear, "releaseYear"),
  durationSeconds: parsePositiveNumberField(body.durationSeconds, "durationSeconds"),
  label: optionalStringField(body.label),
  language: optionalStringField(body.language) ?? "English",
});

const buildSongUpdatePayload = (body: Record<string, unknown>): songService.SongUpdatePayload => {
  const updates: songService.SongUpdatePayload = {};

  if (body.title !== undefined) {
    updates.title = requireStringField(body.title, "title");
  }
  if (body.artist !== undefined) {
    updates.artist = requireStringField(body.artist, "artist");
  }
  if (body.album !== undefined) {
    updates.album = optionalStringField(body.album) ?? "";
  }
  if (body.genre !== undefined) {
    updates.genre = requireStringField(body.genre, "genre");
  }
  if (body.releaseYear !== undefined) {
    updates.releaseYear = parsePositiveNumberField(body.releaseYear, "releaseYear");
  }
  if (body.durationSeconds !== undefined) {
    updates.durationSeconds = parsePositiveNumberField(body.durationSeconds, "durationSeconds");
  }
  if (body.label !== undefined) {
    updates.label = optionalStringField(body.label);
  }
  if (body.language !== undefined) {
    updates.language = optionalStringField(body.language);
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, "No valid fields provided for update");
  }

  return updates;
};

export const listSongs: RequestHandler = async (req, res) => {
  const { pagination, filters } = parseListQuery(req.query, filterFields);
  const result = await songService.listSongs({ ...pagination, filters });
  res.status(200).json(result);
};

export const getSongById: RequestHandler = async (req, res) => {
  const song = await songService.getSongById(req.params.songId);

  if (!song) {
    throw createHttpError(404, "Song not found");
  }

  res.status(200).json({ item: song });
};

export const createSong: RequestHandler = async (req, res) => {
  const payload = buildSongCreatePayload(req.body);
  const song = await songService.createSong(payload);
  res.status(201).json({ item: song });
};

export const updateSong: RequestHandler = async (req, res) => {
  const updates = buildSongUpdatePayload(req.body);
  const song = await songService.updateSong(req.params.songId, updates);

  if (!song) {
    throw createHttpError(404, "Song not found");
  }

  res.status(200).json({ item: song });
};

export const deleteSong: RequestHandler = async (req, res) => {
  const song = await songService.deleteSong(req.params.songId);

  if (!song) {
    throw createHttpError(404, "Song not found");
  }

  res.status(204).end();
};
