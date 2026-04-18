import type { z } from "zod";
import { UserRole } from "../../constants/roles.js";
import { AppError } from "../../utils/appError.js";
import { bookingSchema, rentalSpaceSchema } from "./validator.js";
import { rentalQuery } from "./query.js";

export class RentalService {
  static async listRentalSpaces(
    query: Record<string, unknown>,
    skip: number,
    limit: number,
  ) {
    const where = {
      ...(query.location
        ? {
            location: {
              contains: String(query.location),
              mode: "insensitive" as const,
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

  static async createRentalSpace(
    body: z.infer<typeof rentalSpaceSchema>,
    requester: { id: string; role: string },
  ) {
    const validatedData = rentalSpaceSchema.parse(body);

    let vendorId = validatedData.vendorId;
    if (requester.role === UserRole.VENDOR) {
      const ownVendor = await rentalQuery.findVendorByUserId(requester.id);
      if (!ownVendor) {
        throw new AppError(403, "Vendor profile not found for user");
      }
      vendorId = ownVendor.id;
    }

    if (requester.role === UserRole.ADMIN && !vendorId) {
      throw new AppError(400, "vendorId is required for admin actions");
    }

    if (!vendorId) {
      throw new AppError(403, "Vendor access required");
    }

    const vendor = await rentalQuery.findVendorById(vendorId as string);
    if (!vendor) {
      throw new AppError(404, "Vendor not found");
    }

    return rentalQuery.createRentalSpace({
      ...validatedData,
      vendorId: vendorId as string,
      availability: "AVAILABLE",
    });
  }

  static async bookRentalSpace(
    spaceId: string,
    userId: string,
    body: z.infer<typeof bookingSchema>,
  ) {
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
