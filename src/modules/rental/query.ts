import { prisma } from "../../config/prisma.js";

export const rentalQuery = {
  findRentalSpaceById(id: string) {
    return prisma.rentalSpace.findUnique({ where: { id } });
  },
  findVendorById(id: string) {
    return prisma.vendorProfile.findUnique({ where: { id } });
  },
  listRentalSpaces(where: Record<string, unknown>, skip: number, limit: number) {
    return prisma.rentalSpace.findMany({
      where,
      skip,
      take: limit,
      include: {
        vendor: { include: { user: { select: { id: true, name: true } } } },
      },
    });
  },
  countRentalSpaces(where: Record<string, unknown>) {
    return prisma.rentalSpace.count({ where });
  },
  createRentalSpace(data: {
    vendorId: string;
    location: string;
    size: string;
    price: number;
    availability: "AVAILABLE" | "RESERVED" | "UNAVAILABLE";
  }) {
    return prisma.rentalSpace.create({ data });
  },
  createBooking(data: {
    userId: string;
    rentalSpaceId: string;
    startDate: Date;
    endDate: Date;
    status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  }) {
    return prisma.rentalBooking.create({ data });
  },
  updateRentalSpaceAvailability(
    id: string,
    availability: "AVAILABLE" | "RESERVED" | "UNAVAILABLE",
  ) {
    return prisma.rentalSpace.update({ where: { id }, data: { availability } });
  },
};
