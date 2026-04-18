import { Router } from "express";
import { addPlantUpdate, createPlant, listPlants, } from "../modules/tracking/controller.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { paginationSchema, plantSchema, plantUpdateSchema, } from "../modules/tracking/validator.js";
export const trackingRouter = Router();
trackingRouter.get("/", authenticate, validateQuery(paginationSchema), listPlants);
trackingRouter.post("/", authenticate, validateBody(plantSchema), createPlant);
trackingRouter.post("/:id/updates", authenticate, validateBody(plantUpdateSchema), addPlantUpdate);
