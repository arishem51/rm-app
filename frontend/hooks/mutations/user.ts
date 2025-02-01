import { UserStatus } from "@/lib/constants";
import { apiClient } from "@/lib/utils";
import { UpdateUserRequest } from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

export const useUpdateUser = () => {
  return useMutation({
    onMutate: async ({ id, ...rest }: UpdateUserRequest & { id: number }) => {
      try {
        await apiClient.updateUser(id, {
          ...rest,
          status: UserStatus.INACTIVE,
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
};
