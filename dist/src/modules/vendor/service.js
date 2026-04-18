import { AppError } from "../../utils/appError.js";
import { UserRole } from "../../constants/roles.js";
import { vendorQuery } from "./query.js";
import { certSchema } from "./validator.js";
export class VendorService {
    static async listVendors(userRole) {
        if (userRole === UserRole.ADMIN) {
            return vendorQuery.listVendorsDetailed();
        }
        return vendorQuery.listVendorsBasic();
    }
    static async approveVendor(vendorId) {
        const vendor = await vendorQuery.findVendorWithUser(vendorId);
        if (!vendor) {
            throw new AppError(404, "Vendor not found");
        }
        return vendorQuery.approveVendorAndActivateUser(vendorId);
    }
    static async createCertification(vendorId, body, requester) {
        const validated = certSchema.parse(body);
        let targetVendorId = vendorId;
        if (requester.role === UserRole.VENDOR) {
            const ownVendor = await vendorQuery.findVendorByUserId(requester.id);
            if (!ownVendor) {
                throw new AppError(403, "Vendor profile not found for user");
            }
            if (targetVendorId !== ownVendor.id) {
                throw new AppError(403, "You can only submit certifications for yourself");
            }
        }
        const vendor = await vendorQuery.findVendorById(targetVendorId);
        if (!vendor) {
            throw new AppError(404, "Vendor not found");
        }
        return vendorQuery.createCertification({
            vendorId: targetVendorId,
            certifyingAgency: validated.certifyingAgency,
            certificationDate: new Date(validated.certificationDate),
            documentUrl: validated.documentUrl,
        });
    }
    static async reviewCertification(certId, status) {
        const cert = await vendorQuery.findCertificationById(certId);
        if (!cert) {
            throw new AppError(404, "Certification not found");
        }
        const updatedCert = await vendorQuery.updateCertificationStatus(certId, status);
        if (status === "VERIFIED") {
            await vendorQuery.updateVendorCertificationStatus(cert.vendorId, "VERIFIED");
        }
        return updatedCert;
    }
}
