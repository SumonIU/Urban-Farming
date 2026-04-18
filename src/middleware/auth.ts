import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import { UserRole } from "../constants/roles.js";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Authentication token is required"));
  }

  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, env.JWT_SECRET) as Express.UserPayload;
    return next();
  } catch {
    return next(new AppError(401, "Invalid or expired token"));
  }
};

export const authorize = (...roles: Array<Express.UserPayload["role"]>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "Insufficient permissions"));
    }

    return next();
  };
};

export const adminOnly = authorize(UserRole.ADMIN);
export const vendorOrAdmin = authorize(UserRole.ADMIN, UserRole.VENDOR);
export const customerOrAdmin = authorize(UserRole.ADMIN, UserRole.CUSTOMER);
