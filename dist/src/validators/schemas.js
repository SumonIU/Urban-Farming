import { z } from "zod";
export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["ADMIN", "VENDOR", "CUSTOMER"]).default("CUSTOMER"),
});
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
export const paginationSchema = z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    location: z.string().optional(),
    category: z.string().optional(),
    vendorId: z.string().optional(),
    status: z.string().optional(),
});
export const produceSchema = z.object({
    vendorId: z.string(),
    name: z.string().min(2),
    description: z.string().min(5),
    price: z.coerce.number().positive(),
    category: z.string().min(2),
    availableQuantity: z.coerce.number().int().min(0),
});
export const rentalSpaceSchema = z.object({
    vendorId: z.string(),
    location: z.string().min(2),
    size: z.string().min(1),
    price: z.coerce.number().positive(),
    availability: z.enum(["AVAILABLE", "RESERVED", "UNAVAILABLE"]).optional(),
});
export const bookingSchema = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
});
export const orderSchema = z.object({
    produceId: z.string(),
    quantity: z.coerce.number().int().positive().default(1),
});
export const postSchema = z.object({
    postContent: z.string().min(3),
});
export const certSchema = z.object({
    certifyingAgency: z.string().min(2),
    certificationDate: z.string().datetime(),
    documentUrl: z.string().url().optional(),
});
export const certReviewSchema = z.object({
    status: z.enum(["VERIFIED", "REJECTED"]),
});
export const adminUserQuerySchema = z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    role: z.enum(["ADMIN", "VENDOR", "CUSTOMER"]).optional(),
    status: z.enum(["ACTIVE", "PENDING", "SUSPENDED"]).optional(),
});
export const userStatusUpdateSchema = z.object({
    status: z.enum(["ACTIVE", "PENDING", "SUSPENDED"]),
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
