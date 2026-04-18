import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../middleware/response.js";
import { AdminService } from "../services/admin.service.js";
export const listUsers = asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit ?? 20), 1), 100);
    const { items, total } = await AdminService.listUsers({
        page,
        limit,
        role: req.query.role,
        status: req.query.status,
    });
    return sendSuccess(res, { items }, "Users fetched", { page, limit, total });
});
export const updateUserStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const user = await AdminService.updateUserStatus(req.params.id, status);
    return sendSuccess(res, { user }, "User status updated");
});
export const getActivitySummary = asyncHandler(async (_req, res) => {
    const summary = await AdminService.activitySummary();
    return sendSuccess(res, { summary }, "Activity summary fetched");
});
