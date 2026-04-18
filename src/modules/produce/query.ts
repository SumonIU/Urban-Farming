import { prisma } from "../../config/prisma.js";

export const produceQuery = {
  findProduceById(id: string) {
    return prisma.produce.findUnique({ where: { id } });
  },
  findProduceByIdWithVendor(id: string) {
    return prisma.produce.findUnique({
      where: { id },
      include: { vendor: true },
    });
  },
  findVendorById(id: string) {
    return prisma.vendorProfile.findUnique({ where: { id } });
  },
  listProduce(where: Record<string, unknown>, skip: number, limit: number) {
    return prisma.produce.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        vendor: { include: { user: { select: { id: true, name: true } } } },
      },
    });
  },
  countProduce(where: Record<string, unknown>) {
    return prisma.produce.count({ where });
  },
  createProduce(data: {
    vendorId: string;
    name: string;
    description: string;
    price: number;
    category: string;
    availableQuantity: number;
  }) {
    return prisma.produce.create({ data });
  },
  updateProduce(
    id: string,
    data: Partial<{
      vendorId: string;
      name: string;
      description: string;
      price: number;
      category: string;
      availableQuantity: number;
    }>,
  ) {
    return prisma.produce.update({ where: { id }, data });
  },
  deleteProduce(id: string) {
    return prisma.produce.delete({ where: { id } });
  },
};
