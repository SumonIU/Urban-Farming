import { z } from "zod";

export const adminUserQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  role: z.enum(["ADMIN", "VENDOR", "CUSTOMER"]).optional(),
  status: z.enum(["ACTIVE", "PENDING", "SUSPENDED"]).optional(),
});

export const userStatusUpdateSchema = z.object({
  status: z.enum(["ACTIVE", "PENDING", "SUSPENDED"]),
});
