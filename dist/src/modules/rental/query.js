import { prisma } from "../../config/prisma.js";
export const rentalQuery = {
    findRentalSpaceById(id) {
        return prisma.rentalSpace.findUnique({ where: { id } });
    },
    findVendorByUserId(userId) {
        return prisma.vendorProfile.findUnique({ where: { userId } });
    },
    findVendorById(id) {
        return prisma.vendorProfile.findUnique({ where: { id } });
    },
    listRentalSpaces(where, skip, limit) {
        return prisma.rentalSpace.findMany({
            where,
            skip,
            take: limit,
            include: {
                vendor: { include: { user: { select: { id: true, name: true } } } },
            },
        });
    },
    countRentalSpaces(where) {
        return prisma.rentalSpace.count({ where });
    },
    createRentalSpace(data) {
        return prisma.rentalSpace.create({ data });
    },
    createBooking(data) {
        return prisma.rentalBooking.create({ data });
    },
    updateRentalSpaceAvailability(id, availability) {
        return prisma.rentalSpace.update({ where: { id }, data: { availability } });
    },
};
