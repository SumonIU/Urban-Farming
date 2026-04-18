import type { z } from "zod";
import { UserRole } from "../../constants/roles.js";
import { AppError } from "../../utils/appError.js";
import { produceQuery } from "./query.js";
import { produceSchema } from "./validator.js";

export class ProduceService {
  static async listProduce(
    query: Record<string, unknown>,
    skip: number,
    limit: number,
  ) {
    const where = {
      ...(query.category ? { category: String(query.category) } : {}),
      ...(query.vendorId ? { vendorId: String(query.vendorId) } : {}),
    };

    const [items, total] = await Promise.all([
      produceQuery.listProduce(where, skip, limit),
      produceQuery.countProduce(where),
    ]);

    return { items, total };
  }

  static async createProduce(
    body: z.infer<typeof produceSchema>,
    requester: { id: string; role: string },
  ) {
    const validatedData = produceSchema.parse(body);

    let vendorId = validatedData.vendorId;
    if (requester.role === UserRole.VENDOR) {
      const ownVendor = await produceQuery.findVendorByUserId(requester.id);
      if (!ownVendor) {
        throw new AppError(403, "Vendor profile not found for user");
      }
      vendorId = ownVendor.id;
    }

    if (requester.role === UserRole.ADMIN) {
      if (!vendorId) {
        throw new AppError(400, "vendorId is required for admin actions");
      }
    }

    if (!vendorId) {
      throw new AppError(403, "Vendor access required");
    }

    const vendor = await produceQuery.findVendorById(vendorId);
    if (!vendor) {
      throw new AppError(404, "Vendor not found");
    }

    return produceQuery.createProduce({
      ...validatedData,
      vendorId,
    });
  }

  static async getProduce(id: string) {
    const produce = await produceQuery.findProduceByIdWithVendor(id);
    if (!produce) {
      throw new AppError(404, "Produce not found");
    }
    return produce;
  }

  static async updateProduce(
    id: string,
    body: Partial<z.infer<typeof produceSchema>>,
    requester: { id: string; role: string },
  ) {
    const existing = await produceQuery.findProduceById(id);
    if (!existing) {
      throw new AppError(404, "Produce not found");
    }

    if (requester.role !== UserRole.ADMIN) {
      const ownVendor = await produceQuery.findVendorByUserId(requester.id);
      if (!ownVendor || ownVendor.id !== existing.vendorId) {
        throw new AppError(403, "You can only update your own produce");
      }
    }

    const { vendorId: _vendorId, ...safeBody } = body;

    return produceQuery.updateProduce(id, safeBody);
  }

  static async deleteProduce(
    id: string,
    requester: { id: string; role: string },
  ) {
    const existing = await produceQuery.findProduceById(id);
    if (!existing) {
      throw new AppError(404, "Produce not found");
    }

    if (requester.role !== UserRole.ADMIN) {
      const ownVendor = await produceQuery.findVendorByUserId(requester.id);
      if (!ownVendor || ownVendor.id !== existing.vendorId) {
        throw new AppError(403, "You can only delete your own produce");
      }
    }

    await produceQuery.deleteProduce(id);
  }
}
