import type { Request, RequestHandler } from "express";
import createHttpError from "http-errors";

import * as notesService from "../services/notesService.js";

const requireUser = (req: Request) => {
  if (!req.user) {
    throw createHttpError(401, "Authentication required");
  }

  return req.user;
};

export const listNotesController: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  const notes = await notesService.listNotesForUser(user._id.toString());
  res.status(200).json({ notes });
};

export const getNoteController: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  const note = await notesService.getNoteForUser(
    req.params.noteId,
    user._id.toString()
  );

  if (!note) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json({ note });
};

export const createNoteController: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  const { title, content, tags, archived } = req.body;

  if (!title || typeof title !== "string" || !content || typeof content !== "string") {
    throw createHttpError(400, "Title and content are required");
  }

  const payload: notesService.NoteCreationData = {
    userId: user._id.toString(),
    title: title.trim(),
    content: content.trim(),
    tags: Array.isArray(tags) ? tags.map(String) : undefined,
    archived: typeof archived === "boolean" ? archived : undefined,
  };

  const note = await notesService.createNote(payload);
  res.status(201).json({ note });
};

export const updateNoteController: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  const updates: notesService.NoteUpdateData = {};

  if ("title" in req.body) {
    const title = req.body.title;
    if (typeof title !== "string") {
      throw createHttpError(400, "Title must be a string");
    }
    updates.title = title.trim();
  }
  if ("content" in req.body) {
    const content = req.body.content;
    if (typeof content !== "string") {
      throw createHttpError(400, "Content must be a string");
    }
    updates.content = content.trim();
  }
  if ("tags" in req.body) {
    updates.tags = Array.isArray(req.body.tags)
      ? req.body.tags.map(String)
      : undefined;
  }
  if ("archived" in req.body) {
    updates.archived = Boolean(req.body.archived);
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, "No valid fields provided for update");
  }

  const note = await notesService.updateNote(
    req.params.noteId,
    user._id.toString(),
    updates
  );

  if (!note) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json({ note });
};

export const deleteNoteController: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  const note = await notesService.deleteNote(
    req.params.noteId,
    user._id.toString()
  );

  if (!note) {
    throw createHttpError(404, "Note not found");
  }

  res.status(204).end();
};
