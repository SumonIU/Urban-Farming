import { prisma } from "../../config/prisma.js";
export const trackingQuery = {
    listPlants(where, skip, limit) {
        return prisma.plant.findMany({
            where,
            skip,
            take: limit,
            include: {
                updates: { orderBy: { createdAt: "desc" } },
                vendor: {
                    select: {
                        id: true,
                        farmName: true,
                        farmLocation: true,
                        certificationStatus: true,
                        isApproved: true,
                    },
                },
            },
        });
    },
    countPlants(where) {
        return prisma.plant.count({ where });
    },
    createPlant(data) {
        return prisma.plant.create({ data });
    },
    createPlantUpdate(data) {
        return prisma.plantUpdate.create({ data });
    },
    updatePlantHealth(id, healthStatus) {
        return prisma.plant.update({ where: { id }, data: { healthStatus } });
    },
    findPlantById(id) {
        return prisma.plant.findUnique({ where: { id } });
    },
};
