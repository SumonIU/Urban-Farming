import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../middleware/response.js";
import { getPagination } from "../../utils/paginate.js";
import { ProduceService } from "./service.js";

export const listProduce = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(
    req.query as Record<string, unknown>,
  );

  const { items, total } = await ProduceService.listProduce(
    req.query as Record<string, unknown>,
    skip,
    limit,
  );

  return sendSuccess(res, { items }, "Produce fetched", { page, limit, total });
});

export const createProduce = asyncHandler(async (req, res) => {
  const produce = await ProduceService.createProduce(req.body);

  res.status(201);
  return sendSuccess(res, { produce }, "Produce created");
});

export const getProduce = asyncHandler(async (req, res) => {
  const produce = await ProduceService.getProduce(req.params.id as string);
  return sendSuccess(res, { produce }, "Produce fetched");
});

export const updateProduce = asyncHandler(async (req, res) => {
  const produce = await ProduceService.updateProduce(
    req.params.id as string,
    req.body,
  );
  return sendSuccess(res, { produce }, "Produce updated");
});

export const deleteProduce = asyncHandler(async (req, res) => {
  await ProduceService.deleteProduce(req.params.id as string);
  return sendSuccess(res, null, "Produce deleted");
});
