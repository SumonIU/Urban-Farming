import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../middleware/response.js";
import { registerSchema, loginSchema } from "../validators/schemas.js";
const signToken = (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};
export const register = asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({
        where: { email: body.email },
    });
    if (existing) {
        throw new AppError(409, "Email is already registered");
    }
    const password = await bcrypt.hash(body.password, 12);
    const status = body.role === "VENDOR" ? "PENDING" : "ACTIVE";
    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password,
            role: body.role,
            status,
            vendorProfile: body.role === "VENDOR"
                ? {
                    create: {
                        farmName: `${body.name} Farm`,
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
    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
    });
    return sendSuccess(res.status(201), { user, token }, "User registered");
});
export const login = asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
        where: { email: body.email },
        include: { vendorProfile: true },
    });
    if (!user) {
        throw new AppError(401, "Invalid email or password");
    }
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) {
        throw new AppError(401, "Invalid email or password");
    }
    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
    });
    return sendSuccess(res, {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            vendorProfile: user.vendorProfile,
        },
        token,
    }, "Login successful");
});
export const me = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new AppError(401, "Authentication required");
    }
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { vendorProfile: true },
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }
    return sendSuccess(res, { user }, "Current user fetched");
});
