import { prisma } from "../../config/prisma.js";

export const authQuery = {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  findUserForLogin(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { vendorProfile: true },
    });
  },
  findUserWithProfileById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { vendorProfile: true },
    });
  },
  createUserWithRoleProfile(input: {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "VENDOR" | "CUSTOMER";
    status: "ACTIVE" | "PENDING";
  }) {
    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role,
        status: input.status,
        vendorProfile:
          input.role === "VENDOR"
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
