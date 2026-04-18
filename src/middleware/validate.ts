import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

export const validateBody = <T>(schema: ZodSchema<T>): RequestHandler => {
  return (req, _res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
};

export const validateQuery = <T>(schema: ZodSchema<T>): RequestHandler => {
  return (req, _res, next) => {
    const parsed = schema.parse(req.query) as Record<string, unknown>;

    // Express 5 may expose req.query via a getter; mutate existing object
    // instead of reassigning the property to avoid runtime TypeError.
    const target = req.query as Record<string, unknown>;
    for (const key of Object.keys(target)) {
      delete target[key];
    }
    Object.assign(target, parsed);

    next();
  };
};
