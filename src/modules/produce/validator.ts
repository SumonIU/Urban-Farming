import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  category: z.string().optional(),
  vendorId: z.string().optional(),
});

export const produceSchema = z.object({
  vendorId: z.string(),
  name: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number().positive(),
  category: z.string().min(2),
  availableQuantity: z.coerce.number().int().min(0),
});
