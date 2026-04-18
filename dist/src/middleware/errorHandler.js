import { ZodError } from "zod";
import { AppError } from "../utils/appError.js";
export const notFoundHandler = (req, _res, next) => {
    next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            data: null,
            meta: null,
            error: err.flatten(),
        });
    }
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            data: null,
            meta: null,
            error: err.details ?? null,
        });
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
        meta: null,
        error: null,
    });
};
