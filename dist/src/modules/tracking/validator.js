import { z } from "zod";
export const paginationSchema = z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
});
export const plantSchema = z.object({
    vendorId: z.string().optional(),
    plantName: z.string().min(2),
    species: z.string().min(2),
    expectedHarvest: z.string().datetime().optional(),
});
export const plantUpdateSchema = z.object({
    note: z.string().min(3),
    healthStatus: z.enum(["GOOD", "WATCH", "CRITICAL"]).default("GOOD"),
    growthStage: z.string().min(2).optional(),
});
