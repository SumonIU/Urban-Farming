import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
import { produceSchema } from "../validators/schemas.js";
export class ProduceService {
    static async listProduce(query, skip, limit) {
        const where = {
            ...(query.category ? { category: String(query.category) } : {}),
            ...(query.vendorId ? { vendorId: String(query.vendorId) } : {}),
        };
        const [items, total] = await Promise.all([
            prisma.produce.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    vendor: { include: { user: { select: { id: true, name: true } } } },
                },
            }),
            prisma.produce.count({ where }),
        ]);
        return { items, total };
    }
    static async createProduce(body) {
        // Validate input
        const validatedData = produceSchema.parse(body);
        // Verify vendor exists
        const vendor = await prisma.vendorProfile.findUnique({
            where: { id: validatedData.vendorId },
        });
        if (!vendor) {
            throw new AppError(404, "Vendor not found");
        }
        const produce = await prisma.produce.create({
            data: validatedData,
        });
        return produce;
    }
    static async getProduce(id) {
        const produce = await prisma.produce.findUnique({
            where: { id },
            include: { vendor: true },
        });
        if (!produce) {
            throw new AppError(404, "Produce not found");
        }
        return produce;
    }
    static async updateProduce(id, body) {
        // Verify produce exists
        const existing = await prisma.produce.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError(404, "Produce not found");
        }
        const produce = await prisma.produce.update({
            where: { id },
            data: body,
        });
        return produce;
    }
    static async deleteProduce(id) {
        // Verify produce exists
        const existing = await prisma.produce.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError(404, "Produce not found");
        }
        await prisma.produce.delete({ where: { id } });
    }
}
