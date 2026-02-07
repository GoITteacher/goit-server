import type { RequestHandler } from "express";
import createHttpError from "http-errors";

import * as carService from "../../services/public/carService.js";
import { parseListQuery, type FilterFieldDefinition } from "../../utils/parseListQuery.js";
import {
  optionalPositiveNumberField,
  optionalStringField,
  parseEnumField,
  parsePositiveNumberField,
  requireStringField,
} from "./fieldParsers.js";

const filterFields: FilterFieldDefinition[] = [
  { key: "make", type: "string" },
  { key: "model", type: "string" },
  { key: "color", type: "string" },
  { key: "fuelType", type: "string" },
  { key: "year", type: "number" },
  { key: "price", type: "number" },
];

const fuelTypeOptions = ["gasoline", "diesel", "electric", "hybrid"] as const;

const buildCarCreatePayload = (body: Record<string, unknown>) => ({
  make: requireStringField(body.make, "make"),
  model: requireStringField(body.model, "model"),
  year: parsePositiveNumberField(body.year, "year"),
  color: requireStringField(body.color, "color"),
  price: parsePositiveNumberField(body.price, "price"),
  mileage: optionalPositiveNumberField(body.mileage, "mileage") ?? 0,
  fuelType: parseEnumField(body.fuelType, "fuelType", fuelTypeOptions),
  description: optionalStringField(body.description),
});

const buildCarUpdatePayload = (body: Record<string, unknown>): carService.CarUpdatePayload => {
  const updates: carService.CarUpdatePayload = {};

  if (body.make !== undefined) {
    updates.make = requireStringField(body.make, "make");
  }
  if (body.model !== undefined) {
    updates.model = requireStringField(body.model, "model");
  }
  if (body.year !== undefined) {
    updates.year = parsePositiveNumberField(body.year, "year");
  }
  if (body.color !== undefined) {
    updates.color = requireStringField(body.color, "color");
  }
  if (body.price !== undefined) {
    updates.price = parsePositiveNumberField(body.price, "price");
  }
  if (body.mileage !== undefined) {
    updates.mileage = optionalPositiveNumberField(body.mileage, "mileage");
  }
  if (body.fuelType !== undefined) {
    updates.fuelType = parseEnumField(body.fuelType, "fuelType", fuelTypeOptions);
  }
  if (body.description !== undefined) {
    updates.description = optionalStringField(body.description);
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, "No valid fields provided for update");
  }

  return updates;
};

export const listCars: RequestHandler = async (req, res) => {
  const { pagination, filters } = parseListQuery(req.query, filterFields);
  const result = await carService.listCars({ ...pagination, filters });
  res.status(200).json(result);
};

export const getCarById: RequestHandler = async (req, res) => {
  const car = await carService.getCarById(req.params.carId);

  if (!car) {
    throw createHttpError(404, "Car not found");
  }

  res.status(200).json({ item: car });
};

export const createCar: RequestHandler = async (req, res) => {
  const payload = buildCarCreatePayload(req.body);
  const car = await carService.createCar(payload);
  res.status(201).json({ item: car });
};

export const updateCar: RequestHandler = async (req, res) => {
  const updates = buildCarUpdatePayload(req.body);
  const car = await carService.updateCar(req.params.carId, updates);

  if (!car) {
    throw createHttpError(404, "Car not found");
  }

  res.status(200).json({ item: car });
};

export const deleteCar: RequestHandler = async (req, res) => {
  const car = await carService.deleteCar(req.params.carId);

  if (!car) {
    throw createHttpError(404, "Car not found");
  }

  res.status(204).end();
};
