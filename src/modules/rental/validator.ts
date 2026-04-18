import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  location: z.string().optional(),
  status: z.string().optional(),
});

export const rentalSpaceSchema = z.object({
  vendorId: z.string().optional(),
  location: z.string().min(2),
  size: z.string().min(1),
  price: z.coerce.number().positive(),
  availability: z.enum(["AVAILABLE", "RESERVED", "UNAVAILABLE"]).optional(),
});

export const bookingSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});
