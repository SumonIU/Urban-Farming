import { prisma } from "../../config/prisma.js";

export const vendorQuery = {
  findVendorById(id: string) {
    return prisma.vendorProfile.findUnique({ where: { id } });
  },
  findVendorWithUser(id: string) {
    return prisma.vendorProfile.findUnique({
      where: { id },
      include: { user: true },
    });
  },
  listVendorsDetailed() {
    return prisma.vendorProfile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        sustainabilityCerts: true,
      },
    });
  },
  approveVendorAndActivateUser(vendorId: string) {
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
  createCertification(input: {
    vendorId: string;
    certifyingAgency: string;
    certificationDate: Date;
    documentUrl?: string;
  }) {
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
  findCertificationById(id: string) {
    return prisma.sustainabilityCert.findUnique({ where: { id } });
  },
  updateCertificationStatus(id: string, status: "VERIFIED" | "REJECTED") {
    return prisma.sustainabilityCert.update({
      where: { id },
      data: { status },
    });
  },
  updateVendorCertificationStatus(
    vendorId: string,
    status: "PENDING" | "VERIFIED" | "REJECTED",
  ) {
    return prisma.vendorProfile.update({
      where: { id: vendorId },
      data: { certificationStatus: status },
    });
  },
};
