import type { z } from "zod";
import { UserRole } from "../../constants/roles.js";
import { AppError } from "../../utils/appError.js";
import { trackingQuery } from "./query.js";
import { plantSchema, plantUpdateSchema } from "./validator.js";

export class TrackingService {
  static async listPlants(
    userId: string,
    userRole: string,
    skip: number,
    limit: number,
  ) {
    const where =
      userRole === "ADMIN"
        ? {}
        : {
            userId,
          };

    const [items, total] = await Promise.all([
      trackingQuery.listPlants(where, skip, limit),
      trackingQuery.countPlants(where),
    ]);

    return { items, total };
  }

  static async createPlant(body: z.infer<typeof plantSchema>, userId: string) {
    const validatedData = plantSchema.parse(body);

    return trackingQuery.createPlant({
      userId,
      plantName: validatedData.plantName,
      species: validatedData.species,
      plantedAt: new Date(),
      expectedHarvest: validatedData.expectedHarvest
        ? new Date(validatedData.expectedHarvest)
        : undefined,
      healthStatus: "GOOD",
      growthStage: "SEEDLING",
      vendorId: validatedData.vendorId,
    });
  }

  static async addPlantUpdate(
    plantId: string,
    body: z.infer<typeof plantUpdateSchema>,
    requester: { id: string; role: string },
  ) {
    const validatedData = plantUpdateSchema.parse(body);

    const plant = await trackingQuery.findPlantById(plantId);
    if (!plant) {
      throw new AppError(404, "Plant not found");
    }

    if (requester.role !== UserRole.ADMIN && plant.userId !== requester.id) {
      throw new AppError(403, "You can only update your own plants");
    }

    const update = await trackingQuery.createPlantUpdate({
      plantId,
      note: validatedData.note,
      healthStatus: validatedData.healthStatus,
      createdAt: new Date(),
    });

    if (validatedData.healthStatus) {
      await trackingQuery.updatePlantHealth(
        plantId,
        validatedData.healthStatus,
      );
    }

    return update;
  }
}
