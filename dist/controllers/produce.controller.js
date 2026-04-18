import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../middleware/response.js";
import { AppError } from "../utils/appError.js";
import { getPagination } from "../utils/paginate.js";
export const listProduce = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const where = {
        ...(req.query.category ? { category: String(req.query.category) } : {}),
        ...(req.query.vendorId ? { vendorId: String(req.query.vendorId) } : {}),
    };
    const [items, total] = await Promise.all([
        prisma.produce.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                vendor: { include: { user: { select: { id: true, name: true } } } },
            },
        }),
        prisma.produce.count({ where }),
    ]);
    return sendSuccess(res, { items }, "Produce fetched", { page, limit, total });
});
export const createProduce = asyncHandler(async (req, res) => {
    const produce = await prisma.produce.create({ data: req.body });
    return sendSuccess(res.status(201), { produce }, "Produce created");
});
export const getProduce = asyncHandler(async (req, res) => {
    const produce = await prisma.produce.findUnique({
        where: { id: req.params.id },
        include: { vendor: true },
    });
    if (!produce)
        throw new AppError(404, "Produce not found");
    return sendSuccess(res, { produce }, "Produce fetched");
});
export const updateProduce = asyncHandler(async (req, res) => {
    const produce = await prisma.produce.update({
        where: { id: req.params.id },
        data: req.body,
    });
    return sendSuccess(res, { produce }, "Produce updated");
});
export const deleteProduce = asyncHandler(async (req, res) => {
    await prisma.produce.delete({ where: { id: req.params.id } });
    return sendSuccess(res, null, "Produce deleted");
});
