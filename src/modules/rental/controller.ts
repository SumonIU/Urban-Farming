import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../middleware/response.js";
import { getPagination } from "../../utils/paginate.js";
import { RentalService } from "./service.js";

export const listRentalSpaces = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(
    req.query as Record<string, unknown>,
  );

  const { items, total } = await RentalService.listRentalSpaces(
    req.query as Record<string, unknown>,
    skip,
    limit,
  );

  return sendSuccess(res, { items }, "Rental spaces fetched", {
    page,
    limit,
    total,
  });
});

export const createRentalSpace = asyncHandler(async (req, res) => {
  const rentalSpace = await RentalService.createRentalSpace(req.body);

  res.status(201);
  return sendSuccess(res, { rentalSpace }, "Rental space created");
});

export const bookRentalSpace = asyncHandler(async (req, res) => {
  const booking = await RentalService.bookRentalSpace(
    req.params.id as string,
    req.user!.id,
    req.body,
  );

  res.status(201);
  return sendSuccess(res, { booking }, "Rental space booked");
});
