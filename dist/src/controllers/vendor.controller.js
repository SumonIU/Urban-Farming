import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../middleware/response.js";
import { VendorService } from "../services/vendor.service.js";
export const listVendors = asyncHandler(async (req, res) => {
    const vendors = await VendorService.listVendors();
    return sendSuccess(res, { vendors }, "Vendors fetched");
});
export const approveVendor = asyncHandler(async (req, res) => {
    const vendor = await VendorService.approveVendor(req.params.id);
    return sendSuccess(res, { vendor }, "Vendor approved");
});
export const createCertification = asyncHandler(async (req, res) => {
    const cert = await VendorService.createCertification(req.params.vendorId, req.body);
    res.status(201);
    return sendSuccess(res, { cert }, "Certification submitted");
});
export const reviewCertification = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const cert = await VendorService.reviewCertification(req.params.id, status);
    return sendSuccess(res, { cert }, "Certification updated");
});
