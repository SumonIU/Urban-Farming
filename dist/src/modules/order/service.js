import { AppError } from "../../utils/appError.js";
import { orderQuery } from "./query.js";
import { orderSchema } from "./validator.js";
export class OrderService {
    static async listOrders(userId, userRole, skip, limit) {
        const where = userRole === "ADMIN"
            ? {}
            : {
                userId,
            };
        const [items, total] = await Promise.all([
            orderQuery.listOrders(where, skip, limit),
            orderQuery.countOrders(where),
        ]);
        return { items, total };
    }
    static async createOrder(body, userId) {
        const validatedData = orderSchema.parse(body);
        const produce = await orderQuery.findProduceById(validatedData.produceId);
        if (!produce) {
            throw new AppError(404, "Produce not found");
        }
        if (produce.availableQuantity < validatedData.quantity) {
            throw new AppError(400, "Insufficient quantity available");
        }
        return orderQuery.createOrder({
            userId,
            produceId: validatedData.produceId,
            vendorId: produce.vendorId,
            quantity: validatedData.quantity,
            status: "PENDING",
            orderDate: new Date(),
        });
    }
}
