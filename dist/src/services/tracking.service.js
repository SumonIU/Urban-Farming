import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
export class TrackingService {
    static async listPlants(userId, userRole, skip, limit) {
        const where = userRole === "ADMIN"
            ? {}
            : {
                userId,
            };
        const [items, total] = await Promise.all([
            prisma.plant.findMany({
                where,
                skip,
                take: limit,
                include: {
                    plantUpdates: { orderBy: { createdAt: "desc" } },
                    vendor: true,
                },
            }),
            prisma.plant.count({ where }),
        ]);
        return { items, total };
    }
    static async createPlant(body, userId) {
        const plant = await prisma.plant.create({
            data: {
                userId,
                plantName: body.plantName,
                species: body.species,
                plantedAt: body.plantedAt || new Date(),
                expectedHarvest: body.expectedHarvest,
                healthStatus: "GOOD",
                growthStage: "SEEDLING",
                vendorId: body.vendorId,
            },
        });
        return plant;
    }
    static async addPlantUpdate(plantId, body) {
        // Verify plant exists
        const plant = await prisma.plant.findUnique({
            where: { id: plantId },
        });
        if (!plant) {
            throw new AppError(404, "Plant not found");
        }
        // Create update
        const update = await prisma.plantUpdate.create({
            data: {
                plantId,
                note: body.note,
                healthStatus: body.healthStatus || "GOOD",
                createdAt: new Date(),
            },
        });
        // Update plant health status
        if (body.healthStatus) {
            await prisma.plant.update({
                where: { id: plantId },
                data: { healthStatus: body.healthStatus },
            });
        }
        return update;
    }
}
