import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../middleware/response.js";
import { AppError } from "../utils/appError.js";
import { getPagination } from "../utils/paginate.js";
export const listRentalSpaces = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const where = req.query.location
        ? {
            location: {
                contains: String(req.query.location),
                mode: "insensitive",
            },
        }
        : {};
    const [items, total] = await Promise.all([
        prisma.rentalSpace.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { vendor: true },
        }),
        prisma.rentalSpace.count({ where }),
    ]);
    return sendSuccess(res, { items }, "Rental spaces fetched", {
        page,
        limit,
        total,
    });
});
export const createRentalSpace = asyncHandler(async (req, res) => {
    const rentalSpace = await prisma.rentalSpace.create({ data: req.body });
    return sendSuccess(res.status(201), { rentalSpace }, "Rental space created");
});
export const bookRentalSpace = asyncHandler(async (req, res) => {
    const rentalSpace = await prisma.rentalSpace.findUnique({
        where: { id: req.params.id },
    });
    if (!rentalSpace)
        throw new AppError(404, "Rental space not found");
    const booking = await prisma.rentalBooking.create({
        data: {
            userId: req.user.id,
            rentalSpaceId: rentalSpace.id,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate),
        },
    });
    await prisma.rentalSpace.update({
        where: { id: rentalSpace.id },
        data: { availability: "RESERVED" },
    });
    return sendSuccess(res.status(201), { booking }, "Rental space booked");
});
