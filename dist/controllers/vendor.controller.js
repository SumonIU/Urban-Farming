import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../middleware/response.js";
export const listVendors = asyncHandler(async (req, res) => {
    const vendors = await prisma.vendorProfile.findMany({
        include: {
            user: {
                select: { id: true, name: true, email: true, status: true, role: true },
            },
            sustainabilityCerts: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return sendSuccess(res, { vendors }, "Vendors fetched");
});
export const approveVendor = asyncHandler(async (req, res) => {
    const vendor = await prisma.vendorProfile.update({
        where: { id: req.params.id },
        data: { isApproved: true, certificationStatus: "VERIFIED" },
    });
    await prisma.user.update({
        where: { id: vendor.userId },
        data: { status: "ACTIVE" },
    });
    return sendSuccess(res, { vendor }, "Vendor approved");
});
export const createCertification = asyncHandler(async (req, res) => {
    const vendor = await prisma.vendorProfile.findUnique({
        where: { id: req.params.vendorId },
    });
    if (!vendor) {
        throw new AppError(404, "Vendor not found");
    }
    const cert = await prisma.sustainabilityCert.create({
        data: {
            vendorId: vendor.id,
            certifyingAgency: req.body.certifyingAgency,
            certificationDate: new Date(req.body.certificationDate),
            documentUrl: req.body.documentUrl,
            status: "PENDING",
        },
    });
    return sendSuccess(res.status(201), { cert }, "Certification submitted");
});
export const reviewCertification = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const cert = await prisma.sustainabilityCert.update({
        where: { id: req.params.id },
        data: { status },
    });
    await prisma.vendorProfile.update({
        where: { id: cert.vendorId },
        data: { certificationStatus: status },
    });
    return sendSuccess(res, { cert }, "Certification updated");
});
