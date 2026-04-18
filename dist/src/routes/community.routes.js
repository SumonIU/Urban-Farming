import { Router } from "express";
import { createCommunityPost, listCommunityPosts, } from "../modules/community/controller.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { paginationSchema, postSchema } from "../modules/community/validator.js";
export const communityRouter = Router();
communityRouter.get("/", validateQuery(paginationSchema), listCommunityPosts);
communityRouter.post("/", authenticate, validateBody(postSchema), createCommunityPost);
