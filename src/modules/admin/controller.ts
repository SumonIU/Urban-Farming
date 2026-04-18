import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../middleware/response.js";
import { AdminService } from "./service.js";

export const listUsers = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit ?? 20), 1), 100);

  const { items, total } = await AdminService.listUsers({
    page,
    limit,
    role: req.query.role as "ADMIN" | "VENDOR" | "CUSTOMER" | undefined,
    status: req.query.status as "ACTIVE" | "PENDING" | "SUSPENDED" | undefined,
  });

  return sendSuccess(res, { items }, "Users fetched", { page, limit, total });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body as {
    status: "ACTIVE" | "PENDING" | "SUSPENDED";
  };

  const user = await AdminService.updateUserStatus(
    req.params.id as string,
    status,
  );

  return sendSuccess(res, { user }, "User status updated");
});

export const getActivitySummary = asyncHandler(async (_req, res) => {
  const summary = await AdminService.activitySummary();

  return sendSuccess(res, { summary }, "Activity summary fetched");
});
