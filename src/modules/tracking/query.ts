import { prisma } from "../../config/prisma.js";

export const trackingQuery = {
  listPlants(where: Record<string, unknown>, skip: number, limit: number) {
    return prisma.plant.findMany({
      where,
      skip,
      take: limit,
      include: {
        updates: { orderBy: { createdAt: "desc" } },
        vendor: true,
      },
    });
  },
  countPlants(where: Record<string, unknown>) {
    return prisma.plant.count({ where });
  },
  createPlant(data: {
    userId: string;
    plantName: string;
    species: string;
    plantedAt: Date;
    expectedHarvest?: Date;
    healthStatus: "GOOD" | "WATCH" | "CRITICAL";
    growthStage: string;
    vendorId?: string;
  }) {
    return prisma.plant.create({ data });
  },
  createPlantUpdate(data: {
    plantId: string;
    note: string;
    healthStatus: "GOOD" | "WATCH" | "CRITICAL";
    createdAt: Date;
  }) {
    return prisma.plantUpdate.create({ data });
  },
  updatePlantHealth(id: string, healthStatus: "GOOD" | "WATCH" | "CRITICAL") {
    return prisma.plant.update({ where: { id }, data: { healthStatus } });
  },
  findPlantById(id: string) {
    return prisma.plant.findUnique({ where: { id } });
  },
};
