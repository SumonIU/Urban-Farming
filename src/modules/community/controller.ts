import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../middleware/response.js";
import { getPagination } from "../../utils/paginate.js";
import { CommunityService } from "./service.js";

export const listCommunityPosts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(
    req.query as Record<string, unknown>,
  );

  const { items, total } = await CommunityService.listCommunityPosts(
    skip,
    limit,
  );

  return sendSuccess(res, { items }, "Posts fetched", { page, limit, total });
});

export const createCommunityPost = asyncHandler(async (req, res) => {
  const post = await CommunityService.createPost(req.body, req.user!.id);

  res.status(201);
  return sendSuccess(res, { post }, "Post created");
});
