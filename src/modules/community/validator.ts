import { z } from "zod";

export const paginationSchema = z.object({
	page: z.coerce.number().optional(),
	limit: z.coerce.number().optional(),
});

export const postSchema = z.object({
	postContent: z.string().min(3),
});
