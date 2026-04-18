import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
export class AdminService {
    static async listUsers(input) {
        const skip = (input.page - 1) * input.limit;
        const where = {
            ...(input.role ? { role: input.role } : {}),
            ...(input.status ? { status: input.status } : {}),
        };
        const [items, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: input.limit,
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
            }),
            prisma.user.count({ where }),
        ]);
        return { items, total };
    }
    static async updateUserStatus(userId, status) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new AppError(404, "User not found");
        }
        const updatedUser = await prisma.user.update({
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
        return updatedUser;
    }
    static async activitySummary() {
        const [users, vendors, approvedVendors, pendingCerts, produce, rentalSpaces, orders, communityPosts, plants,] = await Promise.all([
            prisma.user.count(),
            prisma.vendorProfile.count(),
            prisma.vendorProfile.count({ where: { isApproved: true } }),
            prisma.sustainabilityCert.count({ where: { status: "PENDING" } }),
            prisma.produce.count(),
            prisma.rentalSpace.count(),
            prisma.order.count(),
            prisma.communityPost.count(),
            prisma.plant.count(),
        ]);
        return {
            users,
            vendors,
            approvedVendors,
            pendingCerts,
            produce,
            rentalSpaces,
            orders,
            communityPosts,
            plants,
        };
    }
}
