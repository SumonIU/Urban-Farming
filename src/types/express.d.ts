import type { UserRoleValue } from "../constants/roles.js";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      role: UserRoleValue;
      status: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
