import { CarCollection, type Car } from "../../database/models/car.js";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  PaginatedQueryOptions,
  updateDocument,
} from "./utils.js";

export type CarQueryOptions = PaginatedQueryOptions<Car>;
export type CarCreatePayload = Omit<Car, "createdAt" | "updatedAt">;
export type CarUpdatePayload = Partial<CarCreatePayload>;

export const listCars = (options: CarQueryOptions) => listDocuments(CarCollection, options);
export const getCarById = (carId: string) => getDocument(CarCollection, carId);
export const createCar = (payload: CarCreatePayload) => createDocument(CarCollection, payload);
export const updateCar = (carId: string, updates: CarUpdatePayload) =>
  updateDocument(CarCollection, carId, updates);
export const deleteCar = (carId: string) => deleteDocument(CarCollection, carId);
