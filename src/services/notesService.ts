import { NoteCollection, type Note } from "../database/models/note.js";

export type NoteCreationData = Pick<Note, "userId" | "title" | "content"> & {
  tags?: string[];
  archived?: boolean;
};

export type NoteUpdateData = Partial<Pick<Note, "title" | "content" | "tags" | "archived">>;

export const listNotesForUser = async (userId: string) => {
  return NoteCollection.find({ userId }).sort({ updatedAt: -1 });
};

export const getNoteForUser = async (noteId: string, userId: string) => {
  return NoteCollection.findOne({ _id: noteId, userId });
};

export const createNote = async (payload: NoteCreationData) => {
  return NoteCollection.create(payload);
};

export const updateNote = async (noteId: string, userId: string, updates: NoteUpdateData) => {
  return NoteCollection.findOneAndUpdate({ _id: noteId, userId }, updates, {
    new: true,
  });
};

export const deleteNote = async (noteId: string, userId: string) => {
  return NoteCollection.findOneAndDelete({ _id: noteId, userId });
};
