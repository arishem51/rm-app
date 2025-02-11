import { apiClient } from "@/lib/utils";
import {
  BaseResponseUser,
  CreateUserRequest,
  HttpResponse,
  SignInRequest,
  SignUpRequest,
  UpdateUserRequest,
} from "@/types/Api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateUser = () =>
  useMutation({
    mutationFn: async ({ id, ...rest }: UpdateUserRequest & { id: number }) => {
      return apiClient.updateUser(id, rest);
    },
  });

export const useSignIn = () =>
  useMutation({
    mutationFn: async (props: SignInRequest) => {
      try {
        const response = await apiClient.signIn(props);
        return response;
      } catch (error) {
        throw new Error(
          (error as HttpResponse<unknown, BaseResponseUser>).error.message
        );
      }
    },
  });

export const useSignUp = () =>
  useMutation({
    mutationFn: async (props: SignUpRequest) => {
      const response = await apiClient.signUp(props);
      return response;
    },
  });

export const useCreateUser = () =>
  useMutation({
    mutationFn: async (props: CreateUserRequest) => {
      try {
        const response = await apiClient.createUser(props);
        return response;
      } catch (error) {
        throw new Error(
          (error as HttpResponse<unknown, BaseResponseUser>).error.message
        );
      }
    },
  });

export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await apiClient.getMe();
      console.log("API Response:", response);
      return response.data.data;
    },
  });
};
