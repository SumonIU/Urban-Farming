import { prisma } from "../../config/prisma.js";

export const communityQuery = {
  listPosts(skip: number, limit: number) {
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
  createPost(data: {
    userId: string;
    postContent: string;
    postDate: Date;
    status: "PUBLISHED" | "FLAGGED" | "ARCHIVED";
  }) {
    return prisma.communityPost.create({ data });
  },
  findPostById(id: string) {
    return prisma.communityPost.findUnique({ where: { id } });
  },
};
