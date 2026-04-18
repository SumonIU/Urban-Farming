import { AppError } from "../../utils/appError.js";
import { bookingSchema, rentalSpaceSchema } from "./validator.js";
import { rentalQuery } from "./query.js";
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
            rentalQuery.listRentalSpaces(where, skip, limit),
            rentalQuery.countRentalSpaces(where),
        ]);
        return { items, total };
    }
    static async createRentalSpace(body) {
        const validatedData = rentalSpaceSchema.parse(body);
        const vendor = await rentalQuery.findVendorById(validatedData.vendorId);
        if (!vendor) {
            throw new AppError(404, "Vendor not found");
        }
        return rentalQuery.createRentalSpace({
            ...validatedData,
            availability: "AVAILABLE",
        });
    }
    static async bookRentalSpace(spaceId, userId, body) {
        const validatedData = bookingSchema.parse(body);
        const space = await rentalQuery.findRentalSpaceById(spaceId);
        if (!space) {
            throw new AppError(404, "Rental space not found");
        }
        if (space.availability !== "AVAILABLE") {
            throw new AppError(400, "Rental space is not available");
        }
        const booking = await rentalQuery.createBooking({
            userId,
            rentalSpaceId: spaceId,
            startDate: new Date(validatedData.startDate),
            endDate: new Date(validatedData.endDate),
            status: "PENDING",
        });
        await rentalQuery.updateRentalSpaceAvailability(spaceId, "RESERVED");
        return booking;
    }
}
