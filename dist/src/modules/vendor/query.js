import { prisma } from "../../config/prisma.js";
export const vendorQuery = {
    findVendorById(id) {
        return prisma.vendorProfile.findUnique({ where: { id } });
    },
    findVendorByUserId(userId) {
        return prisma.vendorProfile.findUnique({ where: { userId } });
    },
    findVendorWithUser(id) {
        return prisma.vendorProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        status: true,
                    },
                },
            },
        });
    },
    listVendorsDetailed() {
        return prisma.vendorProfile.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                sustainabilityCerts: {
                    select: {
                        id: true,
                        certifyingAgency: true,
                        certificationDate: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    },
    listVendorsBasic() {
        return prisma.vendorProfile.findMany({
            include: {
                user: { select: { id: true, name: true } },
            },
        });
    },
    approveVendorAndActivateUser(vendorId) {
        return prisma.vendorProfile.update({
            where: { id: vendorId },
            data: {
                isApproved: true,
                certificationStatus: "VERIFIED",
                user: {
                    update: {
                        status: "ACTIVE",
                    },
                },
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    },
    createCertification(input) {
        return prisma.sustainabilityCert.create({
            data: {
                vendorId: input.vendorId,
                certifyingAgency: input.certifyingAgency,
                certificationDate: input.certificationDate,
                documentUrl: input.documentUrl,
                status: "PENDING",
            },
        });
    },
    findCertificationById(id) {
        return prisma.sustainabilityCert.findUnique({ where: { id } });
    },
    updateCertificationStatus(id, status) {
        return prisma.sustainabilityCert.update({
            where: { id },
            data: { status },
        });
    },
    updateVendorCertificationStatus(vendorId, status) {
        return prisma.vendorProfile.update({
            where: { id: vendorId },
            data: { certificationStatus: status },
        });
    },
};
