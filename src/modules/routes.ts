import { Router } from "express";
import { authRouter } from "./auth/routes.js";
import { vendorRouter } from "./vendor/routes.js";
import { produceRouter } from "./produce/routes.js";
import { rentalRouter } from "./rental/routes.js";
import { orderRouter } from "./order/routes.js";
import { communityRouter } from "./community/routes.js";
import { trackingRouter } from "./tracking/routes.js";
import { adminRouter } from "./admin/routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/vendors", vendorRouter);
apiRouter.use("/produce", produceRouter);
apiRouter.use("/rental-spaces", rentalRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/community-posts", communityRouter);
apiRouter.use("/plants", trackingRouter);
apiRouter.use("/admin", adminRouter);
