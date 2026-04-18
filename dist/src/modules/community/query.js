import { prisma } from "../../config/prisma.js";
export const communityQuery = {
    listPosts(skip, limit) {
        return prisma.communityPost.findMany({
            skip,
            take: limit,
            orderBy: { postDate: "desc" },
            include: {
                user: { select: { id: true, name: true } },
            },
        });
    },
    countPosts() {
        return prisma.communityPost.count();
    },
    createPost(data) {
        return prisma.communityPost.create({ data });
    },
    findPostById(id) {
        return prisma.communityPost.findUnique({ where: { id } });
    },
};
