import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../middleware/response.js";
import { getPagination } from "../../utils/paginate.js";
import { OrderService } from "./service.js";
export const listOrders = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const { items, total } = await OrderService.listOrders(req.user.id, req.user.role, skip, limit);
    return sendSuccess(res, { items }, "Orders fetched", { page, limit, total });
});
export const createOrder = asyncHandler(async (req, res) => {
    const order = await OrderService.createOrder(req.body, req.user.id);
    res.status(201);
    return sendSuccess(res, { order }, "Order created");
});
