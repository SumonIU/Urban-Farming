import { AppError } from "../../utils/appError.js";
import { vendorQuery } from "./query.js";
import { certSchema } from "./validator.js";
export class VendorService {
    static async listVendors() {
        return vendorQuery.listVendorsDetailed();
    }
    static async approveVendor(vendorId) {
        const vendor = await vendorQuery.findVendorWithUser(vendorId);
        if (!vendor) {
            throw new AppError(404, "Vendor not found");
        }
        return vendorQuery.approveVendorAndActivateUser(vendorId);
    }
    static async createCertification(vendorId, body) {
        const validated = certSchema.parse(body);
        const vendor = await vendorQuery.findVendorById(vendorId);
        if (!vendor) {
            throw new AppError(404, "Vendor not found");
        }
        return vendorQuery.createCertification({
            vendorId,
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
