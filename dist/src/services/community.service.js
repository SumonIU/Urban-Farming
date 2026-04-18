import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
export class CommunityService {
    static async listCommunityPosts(skip, limit) {
        const [items, total] = await Promise.all([
            prisma.communityPost.findMany({
                skip,
                take: limit,
                orderBy: { postDate: "desc" },
                include: {
                    user: { select: { id: true, name: true } },
                },
            }),
            prisma.communityPost.count(),
        ]);
        return { items, total };
    }
    static async createPost(body, userId) {
        // Validate input
        if (!body.postContent || body.postContent.trim().length === 0) {
            throw new AppError(400, "Post content is required");
        }
        const post = await prisma.communityPost.create({
            data: {
                userId,
                postContent: body.postContent,
                postDate: new Date(),
                status: "PUBLISHED",
            },
        });
        return post;
    }
}
