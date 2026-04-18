import { prisma } from "../../config/prisma.js";

export const adminQuery = {
  listUsers(where: Record<string, unknown>, skip: number, limit: number) {
    return prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        vendorProfile: {
          select: {
            id: true,
            farmName: true,
            farmLocation: true,
            certificationStatus: true,
            isApproved: true,
          },
        },
      },
    });
  },
  countUsers(where: Record<string, unknown>) {
    return prisma.user.count({ where });
  },
  findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  updateUserStatus(
    userId: string,
    status: "ACTIVE" | "PENDING" | "SUSPENDED",
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  },
  countAllUsers() {
    return prisma.user.count();
  },
  countVendors() {
    return prisma.vendorProfile.count();
  },
  countApprovedVendors() {
    return prisma.vendorProfile.count({ where: { isApproved: true } });
  },
  countPendingCerts() {
    return prisma.sustainabilityCert.count({ where: { status: "PENDING" } });
  },
  countProduce() {
    return prisma.produce.count();
  },
  countRentalSpaces() {
    return prisma.rentalSpace.count();
  },
  countOrders() {
    return prisma.order.count();
  },
  countCommunityPosts() {
    return prisma.communityPost.count();
  },
  countPlants() {
    return prisma.plant.count();
  },
};
