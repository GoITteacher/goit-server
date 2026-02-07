import { MovieCollection, type Movie } from "../../database/models/movie.js";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  PaginatedQueryOptions,
  updateDocument,
} from "./utils.js";

export type MovieQueryOptions = PaginatedQueryOptions<Movie>;
export type MovieCreatePayload = Omit<Movie, "createdAt" | "updatedAt">;
export type MovieUpdatePayload = Partial<MovieCreatePayload>;

export const listMovies = (options: MovieQueryOptions) => listDocuments(MovieCollection, options);
export const getMovieById = (movieId: string) => getDocument(MovieCollection, movieId);
export const createMovie = (payload: MovieCreatePayload) => createDocument(MovieCollection, payload);
export const updateMovie = (movieId: string, updates: MovieUpdatePayload) =>
  updateDocument(MovieCollection, movieId, updates);
export const deleteMovie = (movieId: string) => deleteDocument(MovieCollection, movieId);
