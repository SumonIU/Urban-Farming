import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../middleware/response.js";
import { getPagination } from "../../utils/paginate.js";
import { TrackingService } from "./service.js";
let socketInstance = null;
export const bindSocket = (socket) => {
    socketInstance = socket;
};
export const listPlants = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const { items, total } = await TrackingService.listPlants(req.user.id, req.user.role, skip, limit);
    return sendSuccess(res, { items }, "Plants fetched", { page, limit, total });
});
export const createPlant = asyncHandler(async (req, res) => {
    const plant = await TrackingService.createPlant(req.body, req.user.id);
    res.status(201);
    return sendSuccess(res, { plant }, "Plant tracked");
});
export const addPlantUpdate = asyncHandler(async (req, res) => {
    const update = await TrackingService.addPlantUpdate(req.params.id, req.body);
    socketInstance?.emit("plant:update", {
        plantId: req.params.id,
        update,
    });
    res.status(201);
    return sendSuccess(res, { update }, "Plant update added");
});
