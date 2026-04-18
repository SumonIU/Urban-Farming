import type { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  meta?: Record<string, unknown>,
) => {
  return res.json({
    success: true,
    message,
    data,
    meta: meta ?? null,
    error: null,
  });
};
