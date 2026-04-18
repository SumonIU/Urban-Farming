import { z } from "zod";
export const certSchema = z.object({
    certifyingAgency: z.string().min(2),
    certificationDate: z.string().datetime(),
    documentUrl: z.string().url().optional(),
});
export const certReviewSchema = z.object({
    status: z.enum(["VERIFIED", "REJECTED"]),
});
