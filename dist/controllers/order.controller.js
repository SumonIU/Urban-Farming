import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../middleware/response.js";
import { AppError } from "../utils/appError.js";
import { getPagination } from "../utils/paginate.js";
export const listOrders = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const where = req.user?.role === "ADMIN" ? {} : { userId: req.user.id };
    const [items, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { orderDate: "desc" },
            include: { produce: true, vendor: true },
        }),
        prisma.order.count({ where }),
    ]);
    return sendSuccess(res, { items }, "Orders fetched", { page, limit, total });
});
export const createOrder = asyncHandler(async (req, res) => {
    const produce = await prisma.produce.findUnique({
        where: { id: req.body.produceId },
    });
    if (!produce)
        throw new AppError(404, "Produce not found");
    const order = await prisma.order.create({
        data: {
            userId: req.user.id,
            produceId: req.body.produceId,
            vendorId: req.body.vendorId,
            quantity: req.body.quantity,
            status: "PENDING",
        },
    });
    return sendSuccess(res.status(201), { order }, "Order created");
});
