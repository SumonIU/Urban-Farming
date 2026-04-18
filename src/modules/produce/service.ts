import type { z } from "zod";
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

  static async createProduce(body: z.infer<typeof produceSchema>) {
    const validatedData = produceSchema.parse(body);

    const vendor = await produceQuery.findVendorById(validatedData.vendorId);
    if (!vendor) {
      throw new AppError(404, "Vendor not found");
    }

    return produceQuery.createProduce(validatedData);
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
  ) {
    const existing = await produceQuery.findProduceById(id);
    if (!existing) {
      throw new AppError(404, "Produce not found");
    }

    return produceQuery.updateProduce(id, body);
  }

  static async deleteProduce(id: string) {
    const existing = await produceQuery.findProduceById(id);
    if (!existing) {
      throw new AppError(404, "Produce not found");
    }

    await produceQuery.deleteProduce(id);
  }
}
