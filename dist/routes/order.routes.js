import { Router } from "express";
import { createOrder, listOrders } from "../controllers/order.controller.js";
import { authenticate, customerOrAdmin } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { orderSchema, paginationSchema } from "../validators/schemas.js";
export const orderRouter = Router();
orderRouter.get("/", authenticate, validateQuery(paginationSchema), listOrders);
orderRouter.post("/", authenticate, customerOrAdmin, validateBody(orderSchema), createOrder);
