import { Router } from "express";
import { createOrder, listOrders } from "./controller.js";
import { authenticate, customerOrAdmin } from "../../middleware/auth.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import { orderSchema, paginationSchema } from "./validator.js";
export const orderRouter = Router();
orderRouter.get("/", authenticate, validateQuery(paginationSchema), listOrders);
orderRouter.post("/", authenticate, customerOrAdmin, validateBody(orderSchema), createOrder);
