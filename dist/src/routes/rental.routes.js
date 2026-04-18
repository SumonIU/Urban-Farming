import { Router } from "express";
import { bookRentalSpace, createRentalSpace, listRentalSpaces, } from "../modules/rental/controller.js";
import { authenticate, customerOrAdmin, vendorOrAdmin, } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { bookingSchema, paginationSchema, rentalSpaceSchema, } from "../modules/rental/validator.js";
export const rentalRouter = Router();
rentalRouter.get("/", validateQuery(paginationSchema), listRentalSpaces);
rentalRouter.post("/", authenticate, vendorOrAdmin, validateBody(rentalSpaceSchema), createRentalSpace);
rentalRouter.post("/:id/book", authenticate, customerOrAdmin, validateBody(bookingSchema), bookRentalSpace);
