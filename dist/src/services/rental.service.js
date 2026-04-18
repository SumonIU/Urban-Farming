import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
import { rentalSpaceSchema, bookingSchema } from "../validators/schemas.js";
export class RentalService {
    static async listRentalSpaces(query, skip, limit) {
        const where = {
            ...(query.location
                ? {
                    location: {
                        contains: String(query.location),
                        mode: "insensitive",
                    },
                }
                : {}),
            ...(query.status ? { availability: String(query.status) } : {}),
        };
        const [items, total] = await Promise.all([
            prisma.rentalSpace.findMany({
                where,
                skip,
                take: limit,
                include: {
                    vendor: { include: { user: { select: { id: true, name: true } } } },
                },
            }),
            prisma.rentalSpace.count({ where }),
        ]);
        return { items, total };
    }
    static async createRentalSpace(body) {
        // Validate input
        const validatedData = rentalSpaceSchema.parse(body);
        // Verify vendor exists
        const vendor = await prisma.vendorProfile.findUnique({
            where: { id: validatedData.vendorId },
        });
        if (!vendor) {
            throw new AppError(404, "Vendor not found");
        }
        const space = await prisma.rentalSpace.create({
            data: {
                ...validatedData,
                availability: "AVAILABLE",
            },
        });
        return space;
    }
    static async bookRentalSpace(spaceId, userId, body) {
        // Validate input
        const validatedData = bookingSchema.parse(body);
        // Verify space exists
        const space = await prisma.rentalSpace.findUnique({
            where: { id: spaceId },
        });
        if (!space) {
            throw new AppError(404, "Rental space not found");
        }
        // Check availability
        if (space.availability !== "AVAILABLE") {
            throw new AppError(400, "Rental space is not available");
        }
        // Create booking
        const booking = await prisma.rentalBooking.create({
            data: {
                userId,
                rentalSpaceId: spaceId,
                startDate: new Date(validatedData.startDate),
                endDate: new Date(validatedData.endDate),
                status: "PENDING",
            },
        });
        // Update space availability
        await prisma.rentalSpace.update({
            where: { id: spaceId },
            data: { availability: "RESERVED" },
        });
        return booking;
    }
}
