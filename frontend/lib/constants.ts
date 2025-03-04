import { UserDTO } from "@/types/Api";

export const UserRole = {
  ADMIN: "ADMIN",
  OWNER: "OWNER",
  STAFF: "STAFF",
} as const;

export const AppRoutes = {
  auth: {
    signIn: {
      url: "/auth/signin",
      role: "ALL",
    },
    signUp: {
      url: "/auth/signup",
      role: "ALL",
    },
    forgotPassword: {
      url: "/auth/forgot-password",
      role: "ALL",
    },
    resetPassword: {
      url: "/auth/reset-password",
      role: "ALL",
    },
  },
  home: {
    url: "/",
    role: "ALL",
  },
  dashboard: {
    home: {
      url: "/dashboard",
      role: "ALL",
    },
    users: {
      url: "/dashboard/users",
      role: "ALL",
    },
    shops: {
      url: "/dashboard/shops",
      role: UserRole.ADMIN,
    },
    categories: {
      url: "/dashboard/categories",
      role: UserRole.ADMIN,
    },
    products: {
      index: {
        url: "/dashboard/products",
        role: "ALL",
      },
      detail: {
        url: "/dashboard/products/[id]",
        role: UserRole.OWNER,
      },
      create: {
        url: "/dashboard/products/create",
        role: UserRole.OWNER,
      },
    },
    warehouses: {
      facilities: {
        url: "/dashboard/warehouses/facilities",
        role: UserRole.OWNER,
      },
      inventories: {
        index: {
          url: "/dashboard/warehouses/inventories",
          role: "ALL",
        },
        detail: {
          url: "/dashboard/warehouses/inventories/[id]",
          role: UserRole.OWNER,
        },
        create: {
          url: "/dashboard/warehouses/inventories/create",
          role: UserRole.OWNER,
        },
      },
    },
    suppliers: {
      url: "/dashboard/suppliers",
      role: UserRole.ADMIN,
    },
    setting: {
      profile: {
        url: "/dashboard/setting/profile",
        role: "ALL",
      },
      shop: {
        url: "/dashboard/setting/shop",
        role: "ALL",
      },
    },
  },
} as const;

export const UserStatus: Record<UserDTO["status"], UserDTO["status"]> = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const ToastTitle = {
  success: "Success.",
  error: "Failed.",
  somethingWentWrong: "Something went wrong!",
} as const;
