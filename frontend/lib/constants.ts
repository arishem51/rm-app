import { UserDTO } from "@/types/Api";

export const AppPathURL = {
  auth: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  home: "/",
  dashboard: {
    home: "/dashboard",
    users: "/dashboard/users",
    shops: "/dashboard/shops",
  },
} as const;

export const UserStatus: Record<UserDTO["status"], UserDTO["status"]> = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const UserRole = {
  ADMIN: "ADMIN",
  OWNER: "OWNER",
  STAFF: "STAFF",
};

export const ToastTitle = {
  success: "Success.",
  error: "Failed.",
  somethingWentWrong: "Something went wrong!",
} as const;
