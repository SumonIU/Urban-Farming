import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const authRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: Math.min(env.RATE_LIMIT_MAX, 20),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
    data: null,
    meta: null,
    error: null,
  },
});

export const sensitiveRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: Math.min(env.RATE_LIMIT_MAX, 50),
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
