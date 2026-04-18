import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../middleware/response.js";
import { getPagination } from "../utils/paginate.js";
export const listCommunityPosts = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const [items, total] = await Promise.all([
        prisma.communityPost.findMany({
            skip,
            take: limit,
            orderBy: { postDate: "desc" },
            include: { user: { select: { id: true, name: true } } },
        }),
        prisma.communityPost.count(),
    ]);
    return sendSuccess(res, { items }, "Posts fetched", { page, limit, total });
});
export const createCommunityPost = asyncHandler(async (req, res) => {
    const post = await prisma.communityPost.create({
        data: {
            userId: req.user.id,
            postContent: req.body.postContent,
        },
    });
    return sendSuccess(res.status(201), { post }, "Post created");
});
