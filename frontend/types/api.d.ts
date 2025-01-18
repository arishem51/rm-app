type UserResponse = {
  id: string;
  name: string;
  username: string;
  phoneNumber: string;
  role: string;
};

type AuthResponse = {
  user: UserResponse;
  token: string;
};

type BaseResponse<T> = {
  message: string;
  data: T;
};
