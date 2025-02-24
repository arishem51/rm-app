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
  email: string;
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

export interface UpdateSupplierDTO {
  name?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  taxCode?: string;
  address?: string;
  website?: string;
  description?: string;
}

export interface BaseResponseSupplier {
  data?: Supplier;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface Supplier {
  /** @format int64 */
  id?: number;
  name?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  /** @pattern \d{10}|\d{13} */
  taxCode: string;
  address?: string;
  website?: string;
  description?: string;
}

export interface UpdateShopDTO {
  name?: string;
  address?: string;
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
  /** @format int64 */
  id?: number;
  name?: string;
  address?: string;
  users?: UserDTO[];
  createdBy?: UserDTO;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface RequestProductDTO {
  name: string;
  description?: string;
  /** @format int64 */
  categoryId?: number;
  /** @format int64 */
  supplierId?: number;
  /** @format int64 */
  shopId: number;
  /** @min 0 */
  salePrice?: number;
  /** @min 0 */
  wholesalePrice?: number;
  unit?: string;
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
}

export interface ResponseProductDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  description?: string;
  category?: Category;
  supplier?: Supplier;
  /** @format int64 */
  shopId?: number;
  shopName?: string;
  salePrice?: number;
  wholesalePrice?: number;
  unit?: "KG" | "BAG";
  imageUrls?: string[];
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
  imageUrl?: string;
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
  email: string;
  role: string;
}

export interface SupplierCreateDTO {
  name: string;
  contactName: string;
  /** @pattern ^(\+?\d{1,3})?\d{10}$ */
  phone: string;
  email: string;
  /** @pattern \d{10}|\d{13} */
  taxCode: string;
  address: string;
  website?: string;
  description?: string;
}

export interface CreateShopDTO {
  name?: string;
  address?: string;
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

export interface BaseResponsePaginateResponseSupplier {
  data?: PaginateResponseSupplier;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface PaginateResponseSupplier {
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  data?: Supplier[];
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

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
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
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

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
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams
  ): RequestParams {
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

  protected createAbortSignal = (
    cancelToken: CancelToken
  ): AbortSignal | undefined => {
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

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      }
    ).then(async (response) => {
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
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Update a user by their name.
     *
     * @tags User Management
     * @name UpdateUser
     * @summary Update a user
     * @request PUT:/api/users/{id}
     * @secure
     */
    updateUser: (
      id: number,
      data: UpdateUserRequest,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseUserDTO, any>({
        path: `/api/users/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Supplier Management
     * @name GetSupplierById
     * @request GET:/api/suppliers/{id}
     * @secure
     */
    getSupplierById: (id: number, params: RequestParams = {}) =>
      this.request<BaseResponseSupplier, any>({
        path: `/api/suppliers/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Supplier Management
     * @name UpdateSupplier
     * @request PUT:/api/suppliers/{id}
     * @secure
     */
    updateSupplier: (
      id: number,
      data: UpdateSupplierDTO,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseSupplier, any>({
        path: `/api/suppliers/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Supplier Management
     * @name DeleteSupplier
     * @request DELETE:/api/suppliers/{id}
     * @secure
     */
    deleteSupplier: (id: number, params: RequestParams = {}) =>
      this.request<BaseResponseVoid, any>({
        path: `/api/suppliers/${id}`,
        method: "DELETE",
        secure: true,
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
    updateProduct: (
      id: number,
      data: RequestProductDTO,
      params: RequestParams = {}
    ) =>
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
     * @tags Category Management
     * @name UpdateCategory
     * @request PUT:/api/categories/{id}
     * @secure
     */
    updateCategory: (
      id: number,
      data: UpdateCategoryDTO,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseCategory, any>({
        path: `/api/categories/${id}`,
        method: "PUT",
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
     * @request GET:/api/users/
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
      params: RequestParams = {}
    ) =>
      this.request<BaseResponsePaginateResponseUserDTO, any>({
        path: `/api/users/`,
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
     * @request POST:/api/users/
     * @secure
     */
    createUser: (data: CreateUserRequest, params: RequestParams = {}) =>
      this.request<BaseResponseUserDTO, any>({
        path: `/api/users/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Supplier Management
     * @name GetSuppliers
     * @request GET:/api/suppliers
     * @secure
     */
    getSuppliers: (
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
      params: RequestParams = {}
    ) =>
      this.request<BaseResponsePaginateResponseSupplier, any>({
        path: `/api/suppliers`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Supplier Management
     * @name CreateSupplier
     * @request POST:/api/suppliers
     * @secure
     */
    createSupplier: (data: SupplierCreateDTO, params: RequestParams = {}) =>
      this.request<BaseResponseSupplier, any>({
        path: `/api/suppliers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Create a shop by owner or admin.
     *
     * @tags Shop Management
     * @name CreateShop
     * @summary Create a shop
     * @request POST:/api/shops
     * @secure
     */
    createShop: (data: CreateShopDTO, params: RequestParams = {}) =>
      this.request<BaseResponseShopDTO, any>({
        path: `/api/shops`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Create a new product.
     *
     * @tags Product Management
     * @name CreateProduct
     * @summary Create a product
     * @request POST:/api/products
     * @secure
     */
    createProduct: (data: RequestProductDTO, params: RequestParams = {}) =>
      this.request<BaseResponseResponseProductDTO, any>({
        path: `/api/products`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

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
     * @description Fetch a list of all registered shops.
     *
     * @tags Shop Management
     * @name GetShops
     * @summary Get all shops
     * @request GET:/api/shops/
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
      params: RequestParams = {}
    ) =>
      this.request<BaseResponsePaginateResponseShopDTO, any>({
        path: `/api/shops/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch a list of page registered products.
     *
     * @tags Product Management
     * @name GetProducts
     * @summary Get page products
     * @request GET:/api/products/
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
      params: RequestParams = {}
    ) =>
      this.request<BaseResponsePaginateResponseResponseProductDTO, any>({
        path: `/api/products/`,
        method: "GET",
        query: query,
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
      },
      params: RequestParams = {}
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
