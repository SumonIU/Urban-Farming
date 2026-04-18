import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
export class VendorService {
    static async listVendors() {
        const vendors = await prisma.vendorProfile.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                sustainabilityCerts: true,
            },
        });
        return vendors;
    }
    static async approveVendor(vendorId) {
        // Verify vendor exists
        const vendor = await prisma.vendorProfile.findUnique({
            where: { id: vendorId },
            include: { user: true },
        });
        if (!vendor) {
            throw new AppError(404, "Vendor not found");
        }
        // Update vendor and user
        const updatedVendor = await prisma.vendorProfile.update({
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
        return updatedVendor;
    }
    static async createCertification(vendorId, body) {
        // Verify vendor exists
        const vendor = await prisma.vendorProfile.findUnique({
            where: { id: vendorId },
        });
        if (!vendor) {
            throw new AppError(404, "Vendor not found");
        }
        const cert = await prisma.sustainabilityCert.create({
            data: {
                vendorId,
                certifyingAgency: body.certifyingAgency,
                documentUrl: body.documentUrl,
                certificationDate: new Date(body.certificationDate),
                status: "PENDING",
            },
        });
        return cert;
    }
    static async reviewCertification(certId, status) {
        // Verify cert exists
        const cert = await prisma.sustainabilityCert.findUnique({
            where: { id: certId },
        });
        if (!cert) {
            throw new AppError(404, "Certification not found");
        }
        // Update cert status
        const updatedCert = await prisma.sustainabilityCert.update({
            where: { id: certId },
            data: { status },
        });
        // If verified, update vendor certification status
        if (status === "VERIFIED") {
            await prisma.vendorProfile.update({
                where: { id: cert.vendorId },
                data: { certificationStatus: "VERIFIED" },
            });
        }
        return updatedCert;
    }
}
