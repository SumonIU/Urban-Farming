import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../middleware/response.js";
import { AppError } from "../../utils/appError.js";
import { AuthService } from "./service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body);

  res.status(201);
  return sendSuccess(res, result, "User registered");
});

export const login = asyncHandler(async (req, res) => {
  const result = await AuthService.login(req.body);

  return sendSuccess(res, result, "Login successful");
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Authentication required");
  }

  const user = await AuthService.getCurrentUser(req.user.id);

  return sendSuccess(res, { user }, "Current user fetched");
});
