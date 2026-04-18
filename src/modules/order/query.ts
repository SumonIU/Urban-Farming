import { prisma } from "../../config/prisma.js";

export const orderQuery = {
  listOrders(where: Record<string, unknown>, skip: number, limit: number) {
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
  countOrders(where: Record<string, unknown>) {
    return prisma.order.count({ where });
  },
  findProduceById(id: string) {
    return prisma.produce.findUnique({ where: { id } });
  },
  createOrder(data: {
    userId: string;
    produceId: string;
    vendorId: string;
    quantity: number;
    status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
    orderDate: Date;
  }) {
    return prisma.order.create({ data });
  },
  findOrderById(id: string) {
    return prisma.order.findUnique({ where: { id } });
  },
};
