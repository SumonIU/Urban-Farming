import { AppError } from "../../utils/appError.js";
import { adminQuery } from "./query.js";

type ListUsersInput = {
	page: number;
	limit: number;
	role?: "ADMIN" | "VENDOR" | "CUSTOMER";
	status?: "ACTIVE" | "PENDING" | "SUSPENDED";
};

export class AdminService {
	static async listUsers(input: ListUsersInput) {
		const skip = (input.page - 1) * input.limit;
		const where = {
			...(input.role ? { role: input.role } : {}),
			...(input.status ? { status: input.status } : {}),
		};

		const [items, total] = await Promise.all([
			adminQuery.listUsers(where, skip, input.limit),
			adminQuery.countUsers(where),
		]);

		return { items, total };
	}

	static async updateUserStatus(
		userId: string,
		status: "ACTIVE" | "PENDING" | "SUSPENDED",
	) {
		const user = await adminQuery.findUserById(userId);
		if (!user) {
			throw new AppError(404, "User not found");
		}

		return adminQuery.updateUserStatus(userId, status);
	}

	static async activitySummary() {
		const [
			users,
			vendors,
			approvedVendors,
			pendingCerts,
			produce,
			rentalSpaces,
			orders,
			communityPosts,
			plants,
		] = await Promise.all([
			adminQuery.countAllUsers(),
			adminQuery.countVendors(),
			adminQuery.countApprovedVendors(),
			adminQuery.countPendingCerts(),
			adminQuery.countProduce(),
			adminQuery.countRentalSpaces(),
			adminQuery.countOrders(),
			adminQuery.countCommunityPosts(),
			adminQuery.countPlants(),
		]);

		return {
			users,
			vendors,
			approvedVendors,
			pendingCerts,
			produce,
			rentalSpaces,
			orders,
			communityPosts,
			plants,
		};
	}
}
