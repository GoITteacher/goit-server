import { SongCollection, type Song } from "../../database/models/song.js";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  PaginatedQueryOptions,
  updateDocument,
} from "./utils.js";

export type SongQueryOptions = PaginatedQueryOptions<Song>;
export type SongCreatePayload = Omit<Song, "createdAt" | "updatedAt">;
export type SongUpdatePayload = Partial<SongCreatePayload>;

export const listSongs = (options: SongQueryOptions) => listDocuments(SongCollection, options);
export const getSongById = (songId: string) => getDocument(SongCollection, songId);
export const createSong = (payload: SongCreatePayload) => createDocument(SongCollection, payload);
export const updateSong = (songId: string, updates: SongUpdatePayload) =>
  updateDocument(SongCollection, songId, updates);
export const deleteSong = (songId: string) => deleteDocument(SongCollection, songId);
