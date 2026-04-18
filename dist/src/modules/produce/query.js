import { prisma } from "../../config/prisma.js";
export const produceQuery = {
    findProduceById(id) {
        return prisma.produce.findUnique({ where: { id } });
    },
    findProduceByIdWithVendor(id) {
        return prisma.produce.findUnique({
            where: { id },
            include: {
                vendor: {
                    select: {
                        id: true,
                        farmName: true,
                        farmLocation: true,
                        certificationStatus: true,
                        isApproved: true,
                        user: { select: { id: true, name: true } },
                    },
                },
            },
        });
    },
    findVendorByUserId(userId) {
        return prisma.vendorProfile.findUnique({ where: { userId } });
    },
    findVendorById(id) {
        return prisma.vendorProfile.findUnique({ where: { id } });
    },
    listProduce(where, skip, limit) {
        return prisma.produce.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                vendor: { include: { user: { select: { id: true, name: true } } } },
            },
        });
    },
    countProduce(where) {
        return prisma.produce.count({ where });
    },
    createProduce(data) {
        return prisma.produce.create({ data });
    },
    updateProduce(id, data) {
        return prisma.produce.update({ where: { id }, data });
    },
    deleteProduce(id) {
        return prisma.produce.delete({ where: { id } });
    },
};
