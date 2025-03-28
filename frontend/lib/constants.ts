export const UserRole = {
  ADMIN: "ADMIN",
  OWNER: "OWNER",
  STAFF: "STAFF",
} as const;

const AllRoles = Object.values(UserRole);

export const AppRoutes = {
  auth: {
    signIn: {
      url: "/auth/signin",
      accessRoles: AllRoles,
    },
    signUp: {
      url: "/auth/signup",
      accessRoles: AllRoles,
    },
    forgotPassword: {
      url: "/auth/forgot-password",
      accessRoles: AllRoles,
    },
    resetPassword: {
      url: "/auth/reset-password",
      accessRoles: AllRoles,
    },
  },
  home: {
    url: "/",
    accessRoles: AllRoles,
  },
  dashboard: {
    home: {
      url: "/dashboard",
      accessRoles: AllRoles,
    },
    users: {
      url: "/dashboard/users",
      accessRoles: AllRoles,
    },
    receipts: {
      index: {
        url: "/dashboard/receipts",
        accessRoles: [UserRole.OWNER, UserRole.STAFF],
      },
      create: {
        url: "/dashboard/receipts/create",
        accessRoles: [UserRole.OWNER, UserRole.STAFF],
      },
      detail: {
        url: "/dashboard/receipts/[id]",
        accessRoles: [UserRole.OWNER, UserRole.STAFF],
      },
    },
    orders: {
      index: {
        url: "/dashboard/orders",
        accessRoles: [UserRole.OWNER, UserRole.STAFF],
      },
      create: {
        url: "/dashboard/orders/create",
        accessRoles: [UserRole.OWNER, UserRole.STAFF],
      },
    },
    invoices: {
      index: {
        url: "/dashboard/invoice",
        accessRoles: AllRoles,
      },
      detail: {
        url: "/dashboard/invoice/[id]",
        accessRoles: AllRoles,
      },
    },
    shops: {
      url: "/dashboard/shops",
      accessRoles: [UserRole.ADMIN],
    },
    categories: {
      url: "/dashboard/categories",
      accessRoles: [UserRole.ADMIN],
    },
    products: {
      index: {
        url: "/dashboard/products",
        accessRoles: [UserRole.OWNER],
      },
      detail: {
        url: "/dashboard/products/[id]",
        accessRoles: [UserRole.OWNER],
      },
      create: {
        url: "/dashboard/products/create",
        accessRoles: [UserRole.OWNER],
      },
    },
    debts: {
      index: {
        url: "/dashboard/debts",
        accessRoles: [UserRole.OWNER],
      },
      detail: {
        url: "/dashboard/debts/[id]",
        accessRoles: [UserRole.OWNER],
      },
      create: {
        url: "/dashboard/debts/create",
        accessRoles: [UserRole.OWNER],
      },
    },
    warehouses: {
      facilities: {
        index: {
          url: "/dashboard/warehouses/facilities",
          accessRoles: [UserRole.OWNER],
        },
        detail: {
          url: "/dashboard/warehouses/facilities/[id]",
          accessRoles: [UserRole.OWNER],
        },
      },
      inventories: {
        index: {
          url: "/dashboard/warehouses/inventories",
          accessRoles: [UserRole.OWNER],
        },
        detail: {
          url: "/dashboard/warehouses/inventories/[id]",
          accessRoles: [UserRole.OWNER],
        },
        create: {
          url: "/dashboard/warehouses/inventories/create",
          accessRoles: [UserRole.OWNER],
        },
      },
    },
    partners: {
      url: "/dashboard/partners",
      accessRoles: [UserRole.ADMIN, UserRole.OWNER,UserRole.STAFF],
    },
    setting: {
      profile: {
        url: "/dashboard/setting/profile",
        accessRoles: AllRoles,
      },
      shop: {
        url: "/dashboard/setting/shop",
        accessRoles: AllRoles,
      },
    },
  },
} as const;

type ActionStatusType = "ACTIVE" | "INACTIVE";

export const ActionStatus: Record<ActionStatusType, ActionStatusType> = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const ToastTitle = {
  success: "Thành công",
  error: "Thất bại",
  somethingWentWrong: "Đã có lỗi xảy ra",
} as const;

export const appearanceNone = `
        appearance-none
        [moz-appearance:textfield]
        [&::-webkit-inner-spin-button]:appearance-none
        [&::-webkit-outer-spin-button]:appearance-none
`;
