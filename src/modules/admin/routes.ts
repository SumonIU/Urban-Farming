import { Router } from "express";
import {
  getActivitySummary,
  listUsers,
  updateUserStatus,
} from "./controller.js";
import { authenticate, adminOnly } from "../../middleware/auth.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import {
  adminUserQuerySchema,
  userStatusUpdateSchema,
} from "./validator.js";

export const adminRouter = Router();

adminRouter.get(
  "/users",
  authenticate,
  adminOnly,
  validateQuery(adminUserQuerySchema),
  listUsers,
);
adminRouter.patch(
  "/users/:id/status",
  authenticate,
  adminOnly,
  validateBody(userStatusUpdateSchema),
  updateUserStatus,
);
adminRouter.get(
  "/activity/summary",
  authenticate,
  adminOnly,
  getActivitySummary,
);
