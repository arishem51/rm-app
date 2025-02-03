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
  name: string;
  /** @pattern ^[0-9]{10,12}$ */
  phoneNumber: string;
  role: string;
  status: string;
}

export interface BaseResponseUser {
  data?: User;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface User {
  /** @format int64 */
  id: number;
  username: string;
  name: string;
  phoneNumber: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  role: "OWNER" | "STAFF" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
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
  role: string;
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
  user?: User;
}

export interface BaseResponsePaginateResponseUser {
  data?: PaginateResponseUser;
  message?: string;
  errorCode?:
    | "AUTH_MISSING"
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ACCESS_DENIED"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR";
}

export interface PaginateResponseUser {
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  data?: User[];
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
     * @description Update a user by their name.
     *
     * @tags User Management
     * @name UpdateUser
     * @summary Update a user
     * @request PUT:/api/users/{id}
     * @secure
     */
    updateUser: (id: number, data: UpdateUserRequest, params: RequestParams = {}) =>
      this.request<BaseResponseUser, any>({
        path: `/api/users/${id}`,
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
      params: RequestParams = {},
    ) =>
      this.request<BaseResponsePaginateResponseUser, any>({
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
      this.request<BaseResponseUser, any>({
        path: `/api/users/`,
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
      this.request<BaseResponseUser, any>({
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
     * @description Get current user by client token.
     *
     * @tags User Management
     * @name GetMe
     * @summary Current user
     * @request GET:/api/users/me
     * @secure
     */
    getMe: (params: RequestParams = {}) =>
      this.request<BaseResponseUser, any>({
        path: `/api/users/me`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
}
