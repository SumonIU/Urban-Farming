import { Router } from "express";
import { login, me, register } from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { authRateLimit } from "../../middleware/rateLimit.js";
import { validateBody } from "../../middleware/validate.js";
import { loginSchema, registerSchema } from "./validator.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  authRateLimit,
  validateBody(registerSchema),
  register,
);
authRouter.post("/login", authRateLimit, validateBody(loginSchema), login);
authRouter.get("/me", authenticate, me);
