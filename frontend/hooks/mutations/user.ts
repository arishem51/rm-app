import { apiClient } from "@/lib/utils";
import {
  CreateUserRequest,
  SignInRequest,
  SignUpRequest,
  UpdateUserRequest,
} from "@/types/Api";
import { useMutation } from "@tanstack/react-query";
import useAppQuery from "../use-app-query";
import { ApiQuery } from "@/services/query";
import { createHttpResponseError } from "@/lib/helpers";

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
        throw createHttpResponseError(error);
      }
    },
  });

export const useSignUp = () =>
  useMutation({
    mutationFn: async (props: SignUpRequest) => {
      try {
        const response = await apiClient.signUp(props);
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });

export const useCreateUser = () =>
  useMutation({
    mutationFn: async (props: CreateUserRequest) => {
      try {
        const response = await apiClient.createUser(props);
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });

export const useMe = () => {
  const query = useAppQuery(ApiQuery.users.getMe());
  return { ...query, data: query.data?.data };
};
