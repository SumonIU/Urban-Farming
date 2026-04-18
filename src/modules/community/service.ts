import type { z } from "zod";
import { AppError } from "../../utils/appError.js";
import { communityQuery } from "./query.js";
import { postSchema } from "./validator.js";

export class CommunityService {
	static async listCommunityPosts(skip: number, limit: number) {
		const [items, total] = await Promise.all([
			communityQuery.listPosts(skip, limit),
			communityQuery.countPosts(),
		]);

		return { items, total };
	}

	static async createPost(body: z.infer<typeof postSchema>, userId: string) {
		const validatedData = postSchema.parse(body);

		if (!validatedData.postContent || validatedData.postContent.trim().length === 0) {
			throw new AppError(400, "Post content is required");
		}

		return communityQuery.createPost({
			userId,
			postContent: validatedData.postContent,
			postDate: new Date(),
			status: "PUBLISHED",
		});
	}
}
