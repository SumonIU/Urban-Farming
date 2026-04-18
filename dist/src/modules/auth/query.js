import { prisma } from "../../config/prisma.js";
export const authQuery = {
    findUserByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    },
    findUserById(id) {
        return prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, role: true, status: true },
        });
    },
    findUserForLogin(email) {
        return prisma.user.findUnique({
            where: { email },
            include: { vendorProfile: true },
        });
    },
    findUserWithProfileById(id) {
        return prisma.user.findUnique({
            where: { id },
            include: { vendorProfile: true },
        });
    },
    createUserWithRoleProfile(input) {
        return prisma.user.create({
            data: {
                name: input.name,
                email: input.email,
                password: input.password,
                role: input.role,
                status: input.status,
                vendorProfile: input.role === "VENDOR"
                    ? {
                        create: {
                            farmName: `${input.name} Farm`,
                            farmLocation: "Pending location",
                        },
                    }
                    : undefined,
            },
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
};
