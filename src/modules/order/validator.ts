import { z } from "zod";

export const paginationSchema = z.object({
	page: z.coerce.number().optional(),
	limit: z.coerce.number().optional(),
});

export const orderSchema = z.object({
	produceId: z.string(),
	quantity: z.coerce.number().int().positive().default(1),
});
