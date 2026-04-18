import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import { UserRole } from "../constants/roles.js";
export const authenticate = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return next(new AppError(401, "Authentication token is required"));
    }
    try {
        const token = header.slice(7);
        req.user = jwt.verify(token, env.JWT_SECRET);
        return next();
    }
    catch {
        return next(new AppError(401, "Invalid or expired token"));
    }
};
export const authorize = (...roles) => {
    return (req, _res, next) => {
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
