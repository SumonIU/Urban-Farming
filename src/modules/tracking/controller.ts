import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../middleware/response.js";
import { getPagination } from "../../utils/paginate.js";
import { TrackingService } from "./service.js";

let socketInstance: { emit: (event: string, payload: unknown) => void } | null =
  null;

export const bindSocket = (socket: {
  emit: (event: string, payload: unknown) => void;
}) => {
  socketInstance = socket;
};

export const listPlants = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(
    req.query as Record<string, unknown>,
  );

  const { items, total } = await TrackingService.listPlants(
    req.user!.id,
    req.user!.role,
    skip,
    limit,
  );

  return sendSuccess(res, { items }, "Plants fetched", { page, limit, total });
});

export const createPlant = asyncHandler(async (req, res) => {
  const plant = await TrackingService.createPlant(req.body, req.user!.id);

  res.status(201);
  return sendSuccess(res, { plant }, "Plant tracked");
});

export const addPlantUpdate = asyncHandler(async (req, res) => {
  const update = await TrackingService.addPlantUpdate(
    req.params.id as string,
    req.body,
    {
      id: req.user!.id,
      role: req.user!.role,
    },
  );

  socketInstance?.emit("plant:update", {
    plantId: req.params.id,
    update,
  });

  res.status(201);
  return sendSuccess(res, { update }, "Plant update added");
});
