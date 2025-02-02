import { apiClient } from "@/lib/utils";
import {
  BaseResponseUser,
  HttpResponse,
  SignInRequest,
  SignUpRequest,
  UpdateUserRequest,
} from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

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
