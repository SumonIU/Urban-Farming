import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../middleware/response.js";
import { AppError } from "../utils/appError.js";
let socketInstance = null;
export const bindSocket = (socket) => {
    socketInstance = socket;
};
export const listPlants = asyncHandler(async (req, res) => {
    const plants = await prisma.plant.findMany({
        where: req.user?.role === "ADMIN" ? {} : { userId: req.user.id },
        include: { updates: { orderBy: { createdAt: "desc" } }, vendor: true },
        orderBy: { createdAt: "desc" },
    });
    return sendSuccess(res, { plants }, "Plants fetched");
});
export const createPlant = asyncHandler(async (req, res) => {
    const plant = await prisma.plant.create({
        data: {
            userId: req.user.id,
            vendorId: req.body.vendorId ?? null,
            plantName: req.body.plantName,
            species: req.body.species,
            expectedHarvest: req.body.expectedHarvest
                ? new Date(req.body.expectedHarvest)
                : undefined,
        },
    });
    return sendSuccess(res.status(201), { plant }, "Plant tracked");
});
export const addPlantUpdate = asyncHandler(async (req, res) => {
    const plant = await prisma.plant.findUnique({ where: { id: req.params.id } });
    if (!plant)
        throw new AppError(404, "Plant not found");
    const update = await prisma.plantUpdate.create({
        data: {
            plantId: plant.id,
            note: req.body.note,
            healthStatus: req.body.healthStatus,
        },
    });
    const nextPlant = await prisma.plant.update({
        where: { id: plant.id },
        data: {
            healthStatus: req.body.healthStatus,
            growthStage: req.body.growthStage ?? plant.growthStage,
        },
    });
    socketInstance?.emit("plant:update", {
        plantId: plant.id,
        update,
        plant: nextPlant,
    });
    return sendSuccess(res.status(201), { update, plant: nextPlant }, "Plant update added");
});
