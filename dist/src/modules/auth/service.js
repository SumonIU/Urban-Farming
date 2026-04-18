import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/appError.js";
import { authQuery } from "./query.js";
import { loginSchema, registerSchema } from "./validator.js";
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
        const validatedData = registerSchema.parse(body);
        const existing = await authQuery.findUserByEmail(validatedData.email);
        if (existing) {
            throw new AppError(409, "Email is already registered");
        }
        const password = await bcrypt.hash(validatedData.password, 12);
        const status = validatedData.role === "VENDOR" ? "PENDING" : "ACTIVE";
        const user = await authQuery.createUserWithRoleProfile({
            ...validatedData,
            password,
            status,
        });
        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        return { user, token };
    }
    static async login(body) {
        const validatedData = loginSchema.parse(body);
        const user = await authQuery.findUserForLogin(validatedData.email);
        if (!user) {
            throw new AppError(401, "Invalid email or password");
        }
        const validPassword = await bcrypt.compare(validatedData.password, user.password);
        if (!validPassword) {
            throw new AppError(401, "Invalid email or password");
        }
        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        const { password: _p, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    static async getCurrentUser(userId) {
        const user = await authQuery.findUserWithProfileById(userId);
        if (!user) {
            throw new AppError(404, "User not found");
        }
        const { password: _p, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
