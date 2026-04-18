import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import { registerSchema, loginSchema } from "../validators/schemas.js";
const signToken = (payload) => {
    return jwt.sign({
        id: payload.id,
        email: payload.email,
        role: payload.role,
        status: payload.status,
    }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
};
export class AuthService {
    static async register(body) {
        // Validate input
        const validatedData = registerSchema.parse(body);
        // Check if email exists
        const existing = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        if (existing) {
            throw new AppError(409, "Email is already registered");
        }
        // Hash password
        const password = await bcrypt.hash(validatedData.password, 12);
        const status = validatedData.role === "VENDOR" ? "PENDING" : "ACTIVE";
        // Create user with optional vendor profile
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password,
                role: validatedData.role,
                status,
                vendorProfile: validatedData.role === "VENDOR"
                    ? {
                        create: {
                            farmName: `${validatedData.name} Farm`,
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
        // Generate token
        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        return { user, token };
    }
    static async login(body) {
        // Validate input
        const validatedData = loginSchema.parse(body);
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
            include: { vendorProfile: true },
        });
        if (!user) {
            throw new AppError(401, "Invalid email or password");
        }
        // Verify password
        const validPassword = await bcrypt.compare(validatedData.password, user.password);
        if (!validPassword) {
            throw new AppError(401, "Invalid email or password");
        }
        // Generate token
        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    static async getCurrentUser(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { vendorProfile: true },
        });
        if (!user) {
            throw new AppError(404, "User not found");
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
