import { prisma } from "../../config/prisma.js";
export const orderQuery = {
    listOrders(where, skip, limit) {
        return prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { orderDate: "desc" },
            include: {
                produce: true,
                user: { select: { id: true, name: true } },
            },
        });
    },
    countOrders(where) {
        return prisma.order.count({ where });
    },
    findProduceById(id) {
        return prisma.produce.findUnique({ where: { id } });
    },
    createOrder(data) {
        return prisma.order.create({ data });
    },
    findOrderById(id) {
        return prisma.order.findUnique({ where: { id } });
    },
};
