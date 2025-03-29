/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ZoneRequestDTO {
  name?: string;
  description?: string;
  /** @format int64 */
  warehouseId: number;
}

export interface BaseResponseZoneDTO {
  data?: ZoneDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface ZoneDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  description?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format int64 */
  warehouseId?: number;
  warehouseName?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface WarehouseUpdateDTO {
  name?: string;
  address?: string;
  description?: string;
  status?: string;
}

export interface BaseResponseWarehouse {
  data?: Warehouse;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface Warehouse {
  /** @format int64 */
  id?: number;
  name?: string;
  description?: string;
  address?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateUserRequest {
  name?: string;
  /**
   * @minLength 6
   * @maxLength 2147483647
   */
  password?: string;
  /** @pattern ^\d{10,12}$ */
  phoneNumber?: string;
  role?: string;
  status?: string;
  email?: string;
}

export interface BaseResponseUserDTO {
  data?: UserDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface UserDTO {
  /** @format int64 */
  id: number;
  username: string;
  name: string;
  phoneNumber: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt?: string;
  role: string;
  status: string;
  /** @format int64 */
  shopId?: number;
  shopName?: string;
  email: string;
}

export interface UpdateShopDTO {
  name?: string;
  address?: string;
  bankAccount?: string;
  bankName?: string;
  postalCode?: string;
  socialMedia?: string;
  website?: string;
}

export interface BaseResponseShopDTO {
  data?: ShopDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface ShopDTO {
  id: number;
  name: string;
  address: string;
  createdBy?: UserDTO;
  createdAt: string;
  updatedAt?: string;
  bankAccount?: string;
  bankName?: string;
  postalCode?: string;
  socialMedia?: string;
  website?: string;
  users?: UserDTO[];
}

export interface ProductRequestDTO {
  name: string;
  description?: string;
  /** @format int64 */
  categoryId?: number;
  /** @format int64 */
  supplierId?: number;
  /** @format int64 */
  shopId: number;
  imageUrls?: string[];
}

export interface BaseResponseResponseProductDTO {
  data?: ResponseProductDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface Category {
  /** @format int64 */
  id?: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface Partner {
  /** @format int64 */
  id?: number;
  name?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  description?: string;
  canHaveDebt?: boolean;
  shop?: Shop;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface ResponseProductDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  description?: string;
  category?: Category;
  supplier?: Partner;
  /** @format int64 */
  shopId?: number;
  shopName?: string;
  price?: number;
  imageUrls?: string[];
}

export interface Shop {
  /** @format int64 */
  id?: number;
  name?: string;
  address?: string;
  createBy?: User;
  /** @uniqueItems true */
  users?: User[];
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface User {
  /** @format int64 */
  id: number;
  username: string;
  email?: string;
  name: string;
  phoneNumber: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  role: "OWNER" | "STAFF" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
}

export interface PartnerUpdateDTO {
  name?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  description?: string;
  canHaveDebt?: boolean;
}

export interface BaseResponsePartner {
  data?: Partner;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface InventoryUpdateDTO {
  /** @format int64 */
  productId?: number;
  /** @format int64 */
  zoneId?: number;
  /** @format int32 */
  quantity?: number;
}

export interface BaseResponseInventoryResponseDTO {
  data?: InventoryResponseDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface InventoryResponseDTO {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  productId?: number;
  /** @format int64 */
  zoneId?: number;
  zoneName?: string;
  /** @format int64 */
  warehouseId?: number;
  productName?: string;
  createdBy?: UserDTO;
  createdAt?: string;
  updatedAt?: string;
  price?: string;
  warehouseName?: string;
  /** @format int32 */
  quantity?: number;
}

export interface UpdateDebtNoteDTO {
  /** @format int64 */
  partnerId?: number;
  /** @format double */
  amount?: number;
  /** @format date */
  dueDate?: string;
  status?: "PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";
  description?: string;
  attachments?: string[];
  notes?: string;
}

export interface BaseResponseDebtNoteResponseDTO {
  data?: DebtNoteResponseDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface DebtNoteResponseDTO {
  id: number;
  partnerId: number;
  totalAmount: number;
  createdAt: string;
  status: 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE';
  source: string;
  description: string;
  orderId: number | undefined;
}

export interface DebtDetailResponseDTO {
  id: number;
  orderId: number;
  orderAmount: number;
  dueDate: string;
  createdAt: string;
  paidAmount: number;
  description: string;
  status: 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE';
  notes: string;
  debtNoteId: number;
}


export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
  imageUrl?: string;
  status?: string;
}

export interface BaseResponseCategory {
  data?: Category;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface WarehouseCreateDTO {
  name?: string;
  address?: string;
  description?: string;
  /** @format int64 */
  shopId: number;
}

export interface CreateUserRequest {
  /**
   * @minLength 3
   * @maxLength 20
   */
  username: string;
  /**
   * @minLength 6
   * @maxLength 2147483647
   */
  password: string;
  /** @pattern ^[0-9]{10,12}$ */
  phoneNumber: string;
  name: string;
}

export interface ReceiptCreateDTO {
  items?: ReceiptRequestItemDTO[];
}

export interface ReceiptRequestItemDTO {
  /** @format int64 */
  productId?: number;
  /**
   * @format int32
   * @min 1
   */
  quantity?: number;
  /** @min 0 */
  price?: number;
  /** @format int64 */
  zoneId?: number;
}

export interface BaseResponseReceiptResponseDTO {
  data?: ReceiptResponseDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface ReceiptItemResponseDTO {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  receiptId?: number;
  /** @format int64 */
  productId?: number;
  productName?: string;
  /** @format double */
  productPrice?: number;
  /** @format int32 */
  quantity?: number;
  /** @format int64 */
  zoneId?: number;
  zoneName?: string;
}

export interface ReceiptResponseDTO {
  /** @format int64 */
  id?: number;
  createdBy?: UserDTO;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  status?: "SUCCESS" | "FAILED" | "PENDING";
  receiptItems?: ReceiptItemResponseDTO[];
}

export interface PartnerCreateDTO {
  name: string;
  contactName: string;
  /** @pattern ^(\+?\d{1,3})?\d{10}$ */
  phone: string;
  email?: string;
  address?: string;
  website?: string;
  description?: string;
  canHaveDebt?: boolean;
}

export interface CreateOrderDTO {
  /** @format int64 */
  partnerId?: number;
  partnerName: string;
  /** @pattern ^[0-9]{10,12}$ */
  partnerPhone?: string;
  amount?: number;
  orderItems?: OrderItemDTO[];
}

export interface OrderItemDTO {
  /** @format int64 */
  inventoryId?: number;
  /** @format int64 */
  zoneId?: number;
  /** @format int64 */
  productId?: number;
  productPrice?: number;
  productName?: string;
  /** @format int32 */
  quantity?: number;
}

export interface BaseResponseOrderResponseDTO {
  data?: OrderResponseDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface OrderResponseDTO {
  /** @format int64 */
  id?: number;
  partnerName?: string;
  partnerPhone?: string;
  userName?: string;
  /** @format int64 */
  shopId?: number;
  totalAmount?: number;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface CreateDebtNoteDTO {
  /** @format int64 */
  partnerId?: number;
  /** @format double */
  amount?: number;
  /** @format date */
  dueDate?: string;
  source?: string;
  /** @format int64 */
  orderId?: number;
  description?: string;
  attachments?: string[];
  notes?: string;
}

export interface CreateDebtPaymentDTO {
  /** @format double */
  amount?: number;
  /** @format date */
  paymentDate?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  notes?: string;
}


export interface CreateCategoryDTO {
  name?: string;
  description?: string;
  imageUrl?: string;
}

export interface SignUpRequest {
  /**
   * @minLength 3
   * @maxLength 20
   */
  username: string;
  /**
   * @minLength 6
   * @maxLength 2147483647
   */
  password: string;
  /** @pattern ^[0-9]{10,12}$ */
  phoneNumber: string;
  name: string;
  email: string;
}

export interface SignInRequest {
  /**
   * @minLength 3
   * @maxLength 20
   */
  username: string;
  /**
   * @minLength 6
   * @maxLength 2147483647
   */
  password: string;
  reCaptchaToken: string;
}

export interface BaseResponseSignInResponse {
  data?: SignInResponse;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface SignInResponse {
  token?: string;
  user?: UserDTO;
}

export interface ResetPasswordRequest {
  /**
   * @minLength 6
   * @maxLength 2147483647
   */
  password: string;
  token: string;
}

export interface BaseResponseVoid {
  data?: object;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface ForgotPasswordRequest {
  email: string;
  reCaptchaToken: string;
}

export interface BaseResponseListZoneDTO {
  data?: ZoneDTO[];
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface BaseResponsePaginateResponseWarehouseDTO {
  data?: PaginateResponseWarehouseDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface PaginateResponseWarehouseDTO {
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  data?: WarehouseDTO[];
}

export interface WarehouseDTO {
  name?: string;
  description?: string;
  address?: string;
  /** @format int64 */
  shopId?: number;
  /** @format int64 */
  id?: number;
  shopName?: string;
  status: string;
  /** @format date-time */
  createdAt?: string;
  /** @format int32 */
  numberOfZone?: number;
}

export interface BaseResponseWarehouseDTO {
  data?: WarehouseDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface BaseResponseListWarehouseDTO {
  data?: WarehouseDTO[];
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface BaseResponsePaginateResponseUserDTO {
  data?: PaginateResponseUserDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface PaginateResponseUserDTO {
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  data?: UserDTO[];
}

export interface BaseResponseListRevenueByMonthResponse {
  data?: RevenueByMonthResponse[];
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface RevenueByMonthResponse {
  month?: string;
  totalRevenue?: number;
}

export interface BaseResponseListRecentOrder {
  data?: RecentOrder[];
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface RecentOrder {
  userName?: string;
  totalAmount?: number;
}

export interface BaseResponseStatisticsOverviewResponse {
  data?: StatisticsOverviewResponse;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface StatisticsOverviewResponse {
  /** @format int32 */
  totalStaff?: number;
  /** @format int32 */
  totalProduct?: number;
  /** @format int32 */
  totalRevenue?: number;
  /** @format int32 */
  totalDebt?: number;
}

export interface BaseResponsePaginateResponseShopDTO {
  data?: PaginateResponseShopDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface PaginateResponseShopDTO {
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  data?: ShopDTO[];
}

export interface BaseResponsePaginateResponseReceiptResponseDTO {
  data?: PaginateResponseReceiptResponseDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface PaginateResponseReceiptResponseDTO {
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  data?: ReceiptResponseDTO[];
}

export interface BaseResponsePaginateResponseResponseProductDTO {
  data?: PaginateResponseResponseProductDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface PaginateResponseResponseProductDTO {
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  data?: ResponseProductDTO[];
}

export interface BaseResponseListResponseProductDTO {
  data?: ResponseProductDTO[];
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface BaseResponsePaymentHistoryDetailDTO {
  data?: PaymentHistoryDetailDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface PaymentHistoryDetailDTO {
  /** @format int64 */
  id?: number;
  partnerName?: string;
  partnerPhone?: string;
  orderAmount?: number;
  discount?: number;
  shippingFee?: number;
  totalAmount?: number;
  orderItems?: OrderItemDTO[];
  /** @format date-time */
  createdAt?: string;
  debt?: boolean;
}

export interface BaseResponseListPaymentHistoryResponseDTO {
  data?: PaymentHistoryResponseDTO[];
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface PaymentHistoryResponseDTO {
  /** @format int64 */
  id?: number;
  partnerName?: string;
  partnerPhone?: string;
  orderAmount?: number;
  discount?: number;
  shippingFee?: number;
  totalAmount?: number;
  /** @format date-time */
  createdAt?: string;
  debt?: boolean;
}

export interface BaseResponsePaginateResponsePartnerRepsponseDTO {
  data?: PaginateResponsePartnerRepsponseDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface PaginateResponsePartnerRepsponseDTO {
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  data?: PartnerRepsponseDTO[];
}

export interface PartnerRepsponseDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  canHaveDept?: boolean;
  website?: string;
  description?: string;
  /** @format int64 */
  shopId?: number;
  shopName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseResponseListPartner {
  data?: Partner[];
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface BaseResponseListOrderResponseDTO {
  data?: OrderResponseDTO[];
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface BaseResponsePageOrder {
  data?: PageOrder;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface Order {
  /** @format int64 */
  id?: number;
  partner?: Partner;
  createdBy?: User;
  shop?: Shop;
  amount?: number;
  orderItems?: OrderItem[];
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface OrderItem {
  /** @format int64 */
  id?: number;
  order?: Order;
  /** @format int64 */
  productId?: number;
  productName?: string;
  productPrice?: number;
  /** @format int64 */
  zoneId?: number;
  zoneName?: string;
  /** @format int32 */
  quantity?: number;
}

export interface PageOrder {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  /** @format int32 */
  size?: number;
  content?: Order[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  first?: boolean;
  last?: boolean;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  empty?: boolean;
}

export interface PageableObject {
  /** @format int64 */
  offset?: number;
  sort?: SortObject;
  paged?: boolean;
  unpaged?: boolean;
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  pageNumber?: number;
}

export interface SortObject {
  empty?: boolean;
  sorted?: boolean;
  unsorted?: boolean;
}

export interface BaseResponsePaginateResponseInventoryResponseDTO {
  data?: PaginateResponseInventoryResponseDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface PaginateResponseInventoryResponseDTO {
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  data?: InventoryResponseDTO[];
}

export interface BaseResponseListInventoryResponseDTO {
  data?: InventoryResponseDTO[];
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface BaseResponseListDebtNoteResponseDTO {
  data?: DebtNoteResponseDTO[];
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}


export interface BaseResponseDebtStatisticsDTO {
  data?: DebtStatisticsDTO;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface DebtStatisticsDTO {
  /** @format double */
  totalOutstanding?: number;
  /** @format double */
  overdueAmount?: number;
  /** @format double */
  upcomingPayments?: number;
}

export interface BaseResponseListCategory {
  data?: Category[];
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface BaseResponsePaginateResponseCategory {
  data?: PaginateResponseCategory;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface PaginateResponseCategory {
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  data?: Category[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:8080";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title API Documentation
 * @version 1.0
 * @baseUrl http://localhost:8080
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Update a zone by its ID.
     *
     * @tags Zone Management
     * @name UpdateZone
     * @summary Update a zone
     * @request PUT:/api/zones/{id}
     * @secure
     */
    updateZone: (id: number, data: ZoneRequestDTO, params: RequestParams = {}) =>
      this.request<BaseResponseZoneDTO, any>({
        path: `/api/zones/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Update the details of an existing warehouse by ID
     *
     * @tags Warehouse Management
     * @name UpdateWarehouse
     * @summary Update a warehouse by ID
     * @request PUT:/api/warehouses/{warehouseId}
     * @secure
     */
    updateWarehouse: (warehouseId: number, data: WarehouseUpdateDTO, params: RequestParams = {}) =>
      this.request<BaseResponseWarehouse, any>({
        path: `/api/warehouses/${warehouseId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Update a user by their name.
     *
     * @tags User Management
     * @name UpdateUser
     * @summary Update a user
     * @request PUT:/api/users/{id}
     * @secure
     */
    updateUser: (id: number, data: UpdateUserRequest, params: RequestParams = {}) =>
      this.request<BaseResponseUserDTO, any>({
        path: `/api/users/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Fetch shop details by shop id. Accessible only if the current user is an admin, staff or owner of the shop.
     *
     * @tags Shop Management
     * @name GetShopById
     * @summary Get shop by id
     * @request GET:/api/shops/{id}
     * @secure
     */
    getShopById: (id: number, params: RequestParams = {}) =>
      this.request<BaseResponseShopDTO, any>({
        path: `/api/shops/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Update a shop by its ID.
     *
     * @tags Shop Management
     * @name UpdateShop
     * @summary Update a shop
     * @request PUT:/api/shops/{id}
     * @secure
     */
    updateShop: (id: number, data: UpdateShopDTO, params: RequestParams = {}) =>
      this.request<BaseResponseShopDTO, any>({
        path: `/api/shops/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Fetch a product by ID.
     *
     * @tags Product Management
     * @name GetProduct
     * @summary Get a product
     * @request GET:/api/products/{id}
     * @secure
     */
    getProduct: (id: number, params: RequestParams = {}) =>
      this.request<BaseResponseResponseProductDTO, any>({
        path: `/api/products/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Update an existing product by ID.
     *
     * @tags Product Management
     * @name UpdateProduct
     * @summary Update a product
     * @request PUT:/api/products/{id}
     * @secure
     */
    updateProduct: (id: number, data: ProductRequestDTO, params: RequestParams = {}) =>
      this.request<BaseResponseResponseProductDTO, any>({
        path: `/api/products/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Partner Management
     * @name GetPartnerById
     * @request GET:/api/partners/{id}
     * @secure
     */
    getPartnerById: (id: number, params: RequestParams = {}) =>
      this.request<BaseResponsePartner, any>({
        path: `/api/partners/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Partner Management
     * @name UpdatePartner
     * @request PUT:/api/partners/{id}
     * @secure
     */
    updatePartner: (id: number, data: PartnerUpdateDTO, params: RequestParams = {}) =>
      this.request<BaseResponsePartner, any>({
        path: `/api/partners/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Update a inventory by its ID.
     *
     * @tags Inventories Management
     * @name GetInventoryById
     * @summary Get a inventory
     * @request GET:/api/inventories/{id}
     * @secure
     */
    getInventoryById: (id: number, params: RequestParams = {}) =>
      this.request<BaseResponseInventoryResponseDTO, any>({
        path: `/api/inventories/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Update a inventory by its ID.
     *
     * @tags Inventories Management
     * @name UpdateInventory
     * @summary Update a inventory
     * @request PUT:/api/inventories/{id}
     * @secure
     */
    updateInventory: (id: number, data: InventoryUpdateDTO, params: RequestParams = {}) =>
      this.request<BaseResponseInventoryResponseDTO, any>({
        path: `/api/inventories/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags debt-controller
     * @name GetDebtNoteById
     * @request GET:/api/debts/{id}
     * @secure
     */
    getDebtNoteById: (id: number, params: RequestParams = {}) =>
      this.request<BaseResponseDebtNoteResponseDTO, any>({
        path: `/api/debts/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags debt-controller
     * @name UpdateDebtNote
     * @request PUT:/api/debts/{id}
     * @secure
     */
    updateDebtNote: (id: number, data: UpdateDebtNoteDTO, params: RequestParams = {}) =>
      this.request<BaseResponseDebtNoteResponseDTO, any>({
        path: `/api/debts/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags debt-controller
     * @name DeleteDebtNote
     * @request DELETE:/api/debts/{id}
     * @secure
     */
    deleteDebtNote: (id: number, params: RequestParams = {}) =>
      this.request<BaseResponseVoid, any>({
        path: `/api/debts/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Update an existing category by ID.
     *
     * @tags Category Management
     * @name UpdateCategory
     * @summary Update a category
     * @request PUT:/api/categories/{id}
     * @secure
     */
    updateCategory: (id: number, data: UpdateCategoryDTO, params: RequestParams = {}) =>
      this.request<BaseResponseCategory, any>({
        path: `/api/categories/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Fetch a list of all registered zones.
     *
     * @tags Zone Management
     * @name GetAllZonesOfUser
     * @summary Get all zones
     * @request GET:/api/zones
     * @secure
     */
    getAllZonesOfUser: (params: RequestParams = {}) =>
      this.request<BaseResponseListZoneDTO, any>({
        path: `/api/zones`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Create a zone by owner or staff of the shop.
     *
     * @tags Zone Management
     * @name CreateZone
     * @summary Create a zone
     * @request POST:/api/zones
     * @secure
     */
    createZone: (data: ZoneRequestDTO, params: RequestParams = {}) =>
      this.request<BaseResponseZoneDTO, any>({
        path: `/api/zones`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Create a new warehouse under the specified shop
     *
     * @tags Warehouse Management
     * @name CreateWarehouse
     * @summary Create a new warehouse for a shop
     * @request POST:/api/warehouses/{shopId}
     * @secure
     */
    createWarehouse: (shopId: number, data: WarehouseCreateDTO, params: RequestParams = {}) =>
      this.request<BaseResponseWarehouse, any>({
        path: `/api/warehouses/${shopId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Fetch a list of all registered users.
     *
     * @tags User Management
     * @name GetUsers
     * @summary Get all users
     * @request GET:/api/users
     * @secure
     */
    getUsers: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        /** @default "" */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponsePaginateResponseUserDTO, any>({
        path: `/api/users`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Create a user by owner or admin.
     *
     * @tags User Management
     * @name CreateUser
     * @summary Create a user
     * @request POST:/api/users
     * @secure
     */
    createUser: (data: CreateUserRequest, params: RequestParams = {}) =>
      this.request<BaseResponseUserDTO, any>({
        path: `/api/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Fetch a list of all registered receipts.
     *
     * @tags Receipt Controller
     * @name GetReceipts
     * @summary Get all receipts
     * @request GET:/api/receipts
     * @secure
     */
    getReceipts: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        /** @default "" */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponsePaginateResponseReceiptResponseDTO, any>({
        path: `/api/receipts`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Create a receipt by owner or staff of the shop.
     *
     * @tags Receipt Controller
     * @name CreateReceipt
     * @summary Create a receipt
     * @request POST:/api/receipts
     * @secure
     */
    createReceipt: (data: ReceiptCreateDTO, params: RequestParams = {}) =>
      this.request<BaseResponseReceiptResponseDTO, any>({
        path: `/api/receipts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Fetch a list of page registered products.
     *
     * @tags Product Management
     * @name GetProducts
     * @summary Get page products
     * @request GET:/api/products
     * @secure
     */
    getProducts: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        /** @default "" */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponsePaginateResponseResponseProductDTO, any>({
        path: `/api/products`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Create a new product
     *
     * @tags Product Management
     * @name CreateProduct
     * @summary Create a product
     * @request POST:/api/products
     * @secure
     */
    createProduct: (data: ProductRequestDTO, params: RequestParams = {}) =>
      this.request<BaseResponseResponseProductDTO, any>({
        path: `/api/products`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Partner Management
     * @name GetPartners
     * @request GET:/api/partners
     * @secure
     */
    getPartners: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        /** @default "" */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponsePaginateResponsePartnerRepsponseDTO, any>({
        path: `/api/partners`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Partner Management
     * @name CreatePartner
     * @request POST:/api/partners
     * @secure
     */
    createPartner: (data: PartnerCreateDTO, params: RequestParams = {}) =>
      this.request<BaseResponsePartner, any>({
        path: `/api/partners`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Create a new order.
     *
     * @tags Order Management
     * @name CreateOrder
     * @summary Create an order
     * @request POST:/api/orders
     * @secure
     */
    createOrder: (data: CreateOrderDTO, params: RequestParams = {}) =>
      this.request<BaseResponseOrderResponseDTO, any>({
        path: `/api/orders`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags debt-controller
     * @name GetDebtNotes
     * @request GET:/api/debts
     * @secure
     */
    getDebtNotes: (
      query?: {
        status?: "PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";
        /** @format int64 */
        partnerId?: number;
        /** @format date */
        fromDate?: string;
        /** @format date */
        toDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseListDebtNoteResponseDTO, any>({
        path: `/api/debts`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags debt-controller
     * @name CreateDebtNote
     * @request POST:/api/debts
     * @secure
     */
    createDebtNote: (data: CreateDebtNoteDTO, params: RequestParams = {}) =>
      this.request<BaseResponseDebtNoteResponseDTO, any>({
        path: `/api/debts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),



    /**
     * No description
     *
     * @tags debt-controller
     * @name CreateDebtPayment
     * @request POST:/api/debts/{id}/payments
     * @secure
     */


    /**
     * @description Create a new category under a specific shop.
     *
     * @tags Category Management
     * @name CreateCategory
     * @summary Create a category
     * @request POST:/api/categories
     * @secure
     */
    createCategory: (data: CreateCategoryDTO, params: RequestParams = {}) =>
      this.request<BaseResponseCategory, any>({
        path: `/api/categories`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Sign up a new user with a username and password.
     *
     * @tags Authentication
     * @name SignUp
     * @summary Sign up a new user
     * @request POST:/api/auth/sign-up
     * @secure
     */
    signUp: (data: SignUpRequest, params: RequestParams = {}) =>
      this.request<BaseResponseUserDTO, any>({
        path: `/api/auth/sign-up`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Perform authentication on a user to sign in!.
     *
     * @tags Authentication
     * @name SignIn
     * @summary Sign in a user
     * @request POST:/api/auth/sign-in
     * @secure
     */
    signIn: (data: SignInRequest, params: RequestParams = {}) =>
      this.request<BaseResponseSignInResponse, any>({
        path: `/api/auth/sign-in`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name ResetPassword
     * @request POST:/api/auth/reset-password
     * @secure
     */
    resetPassword: (data: ResetPasswordRequest, params: RequestParams = {}) =>
      this.request<BaseResponseVoid, any>({
        path: `/api/auth/reset-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Validate email and send a code to reset password.
     *
     * @tags Authentication
     * @name ForgotPassword
     * @summary Forgot password
     * @request POST:/api/auth/forgot-password
     * @secure
     */
    forgotPassword: (data: ForgotPasswordRequest, params: RequestParams = {}) =>
      this.request<BaseResponseVoid, any>({
        path: `/api/auth/forgot-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Fetch a list of zones in a warehouse of a shop.
     *
     * @tags Zone Management
     * @name GetZonesByWarehouseId
     * @summary Get zones in warehouse
     * @request GET:/api/zones/{warehouseId}
     * @secure
     */
    getZonesByWarehouseId: (warehouseId: number, params: RequestParams = {}) =>
      this.request<BaseResponseListZoneDTO, any>({
        path: `/api/zones/${warehouseId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Get paginate warehouses of a shop
     *
     * @tags Warehouse Management
     * @name GetWarehouses
     * @summary Get paginate warehouses of a shop
     * @request GET:/api/warehouses
     * @secure
     */
    getWarehouses: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        /** @default "" */
        search?: string;
        /** @default "" */
        address?: string;
        /** @default "" */
        zone?: string;
        /** @default "" */
        startDate?: string;
        /** @default "" */
        endDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponsePaginateResponseWarehouseDTO, any>({
        path: `/api/warehouses`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Get details warehouse of a shop
     *
     * @tags Warehouse Management
     * @name GetWarehouseDetail
     * @summary Get details warehouse of a shop
     * @request GET:/api/warehouses/{id}
     * @secure
     */
    getWarehouseDetail: (id: number, params: RequestParams = {}) =>
      this.request<BaseResponseWarehouseDTO, any>({
        path: `/api/warehouses/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Get all warehouses of a shop
     *
     * @tags Warehouse Management
     * @name GetAllWarehouses
     * @summary Get all warehouses of a shop
     * @request GET:/api/warehouses/all
     * @secure
     */
    getAllWarehouses: (
      query: {
        /** @format int64 */
        shopId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseListWarehouseDTO, any>({
        path: `/api/warehouses/all`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Get current user by client token.
     *
     * @tags User Management
     * @name GetMe
     * @summary Current user
     * @request GET:/api/users/me
     * @secure
     */
    getMe: (params: RequestParams = {}) =>
      this.request<BaseResponseUserDTO, any>({
        path: `/api/users/me`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch overview statistics by revenue/month of the current user.
     *
     * @tags Statistics Controller
     * @name GetRevenueByMonth
     * @summary Get revenue by month statistics
     * @request GET:/api/statistics/revenue-by-month
     * @secure
     */
    getRevenueByMonth: (params: RequestParams = {}) =>
      this.request<BaseResponseListRevenueByMonthResponse, any>({
        path: `/api/statistics/revenue-by-month`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch recent orders of the current user.
     *
     * @tags Statistics Controller
     * @name GetRecentOrders
     * @summary Get recent order
     * @request GET:/api/statistics/recent-orders
     * @secure
     */
    getRecentOrders: (params: RequestParams = {}) =>
      this.request<BaseResponseListRecentOrder, any>({
        path: `/api/statistics/recent-orders`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch overview statistics of the current user.
     *
     * @tags Statistics Controller
     * @name GetOverviewStatistics
     * @summary Get overview statistics
     * @request GET:/api/statistics/overview
     * @secure
     */
    getOverviewStatistics: (params: RequestParams = {}) =>
      this.request<BaseResponseStatisticsOverviewResponse, any>({
        path: `/api/statistics/overview`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch a list of all registered shops.
     *
     * @tags Shop Management
     * @name GetShops
     * @summary Get all shops
     * @request GET:/api/shops
     * @secure
     */
    getShops: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        /** @default "" */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponsePaginateResponseShopDTO, any>({
        path: `/api/shops`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch a registered receipt.
     *
     * @tags Receipt Controller
     * @name GetReceipt
     * @summary Get a receipt
     * @request GET:/api/receipts/{id}
     * @secure
     */
    getReceipt: (id: number, params: RequestParams = {}) =>
      this.request<BaseResponseReceiptResponseDTO, any>({
        path: `/api/receipts/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch a list of page registered products of a shop.
     *
     * @tags Product Management
     * @name GetAllProducts
     * @summary Get all products
     * @request GET:/api/products/all
     * @secure
     */
    getAllProducts: (params: RequestParams = {}) =>
      this.request<BaseResponseListResponseProductDTO, any>({
        path: `/api/products/all`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags payment-history-controller
     * @name GetPaymentById
     * @request GET:/api/payment-histories/{id}
     * @secure
     */
    getPaymentById: (id: number, params: RequestParams = {}) =>
      this.request<BaseResponsePaymentHistoryDetailDTO, any>({
        path: `/api/payment-histories/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags payment-history-controller
     * @name GetAllPayment
     * @request GET:/api/payment-histories/all
     * @secure
     */
    getAllPayment: (params: RequestParams = {}) =>
      this.request<BaseResponseListPaymentHistoryResponseDTO, any>({
        path: `/api/payment-histories/all`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch all Partners.
     *
     * @tags Partner Management
     * @name GetAllPartners
     * @summary Get all Partners
     * @request GET:/api/partners/all
     * @secure
     */
    getAllPartners: (params: RequestParams = {}) =>
      this.request<BaseResponseListPartner, any>({
        path: `/api/partners/all`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch an order by ID.
     *
     * @tags Order Management
     * @name GetOrderById
     * @summary Get order by ID
     * @request GET:/api/orders/{id}
     * @secure
     */
    getOrderById: (id: number, params: RequestParams = {}) =>
      this.request<BaseResponseOrderResponseDTO, any>({
        path: `/api/orders/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch all orders.
     *
     * @tags Order Management
     * @name GetAllOrders
     * @summary Get all orders
     * @request GET:/api/orders/all
     * @secure
     */
    getAllOrders: (params: RequestParams = {}) =>
      this.request<BaseResponseListOrderResponseDTO, any>({
        path: `/api/orders/all`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch a list of orders.
     *
     * @tags Order Management
     * @name GetOrders
     * @summary Get paginate orders
     * @request GET:/api/orders/
     * @secure
     */
    getOrders: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponsePageOrder, any>({
        path: `/api/orders/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch a list of the registered inventories.
     *
     * @tags Inventories Management
     * @name GetInventory
     * @summary Get the inventories
     * @request GET:/api/inventories
     * @secure
     */
    getInventory: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        /** @default "" */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponsePaginateResponseInventoryResponseDTO, any>({
        path: `/api/inventories`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch a list of all registered inventories.
     *
     * @tags Inventories Management
     * @name GetAllInventory
     * @summary Get all inventories
     * @request GET:/api/inventories/all
     * @secure
     */
    getAllInventory: (params: RequestParams = {}) =>
      this.request<BaseResponseListInventoryResponseDTO, any>({
        path: `/api/inventories/all`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags debt-controller
     * @name GetDebtStatistics
     * @request GET:/api/debts/statistics
     * @secure
     */
    getDebtStatistics: (params: RequestParams = {}) =>
      this.request<BaseResponseDebtStatisticsDTO, any>({
        path: `/api/debts/statistics`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch all categories.
     *
     * @tags Category Management
     * @name GetAllCategories
     * @summary Get all categories
     * @request GET:/api/categories/all
     * @secure
     */
    getAllCategories: (params: RequestParams = {}) =>
      this.request<BaseResponseListCategory, any>({
        path: `/api/categories/all`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch a list of categories.
     *
     * @tags Category Management
     * @name GetCategories
     * @summary Get paginate categories
     * @request GET:/api/categories/
     * @secure
     */
    getCategories: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        /** @default "" */
        search?: string;
        createdAt?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponsePaginateResponseCategory, any>({
        path: `/api/categories/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
}
