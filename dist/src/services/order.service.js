import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
import { orderSchema } from "../validators/schemas.js";
export class OrderService {
    static async listOrders(userId, userRole, skip, limit) {
        const where = userRole === "ADMIN"
            ? {}
            : {
                userId,
            };
        const [items, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { orderDate: "desc" },
                include: {
                    produce: true,
                    user: { select: { id: true, name: true } },
                },
            }),
            prisma.order.count({ where }),
        ]);
        return { items, total };
    }
    static async createOrder(body, userId) {
        // Validate input
        const validatedData = orderSchema.parse(body);
        // Verify produce exists
        const produce = await prisma.produce.findUnique({
            where: { id: validatedData.produceId },
        });
        if (!produce) {
            throw new AppError(404, "Produce not found");
        }
        // Check quantity
        if (produce.availableQuantity < validatedData.quantity) {
            throw new AppError(400, "Insufficient quantity available");
        }
        // Create order
        const order = await prisma.order.create({
            data: {
                userId,
                produceId: validatedData.produceId,
                vendorId: produce.vendorId,
                quantity: validatedData.quantity,
                status: "PENDING",
                orderDate: new Date(),
            },
        });
        return order;
    }
}
