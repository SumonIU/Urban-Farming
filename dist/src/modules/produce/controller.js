import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../middleware/response.js";
import { getPagination } from "../../utils/paginate.js";
import { ProduceService } from "./service.js";
export const listProduce = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const { items, total } = await ProduceService.listProduce(req.query, skip, limit);
    return sendSuccess(res, { items }, "Produce fetched", { page, limit, total });
});
export const createProduce = asyncHandler(async (req, res) => {
    const produce = await ProduceService.createProduce(req.body, {
        id: req.user.id,
        role: req.user.role,
    });
    res.status(201);
    return sendSuccess(res, { produce }, "Produce created");
});
export const getProduce = asyncHandler(async (req, res) => {
    const produce = await ProduceService.getProduce(req.params.id);
    return sendSuccess(res, { produce }, "Produce fetched");
});
export const updateProduce = asyncHandler(async (req, res) => {
    const produce = await ProduceService.updateProduce(req.params.id, req.body, {
        id: req.user.id,
        role: req.user.role,
    });
    return sendSuccess(res, { produce }, "Produce updated");
});
export const deleteProduce = asyncHandler(async (req, res) => {
    await ProduceService.deleteProduce(req.params.id, {
        id: req.user.id,
        role: req.user.role,
    });
    return sendSuccess(res, null, "Produce deleted");
});
