import { UserDTO } from "@/types/Api";
import { UserRole } from "./constants";

export const checkRole = (user?: UserDTO) => {
  return {
    isAdmin: user?.role === UserRole.ADMIN,
    isOwner: user?.role === UserRole.OWNER,
    isStaff: user?.role === UserRole.STAFF,
  };
};
