import { apiClient } from "@/lib/utils";
import { UpdateUserRequest } from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

export const useUpdateUser = () =>
  useMutation({
    mutationFn: async ({ id, ...rest }: UpdateUserRequest & { id: number }) => {
      return apiClient.updateUser(id, rest);
    },
  });
