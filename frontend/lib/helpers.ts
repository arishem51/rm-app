import {
  BaseResponseUserDTO,
  HttpResponse,
  ReceiptResponseDTO,
  UserDTO,
} from "@/types/Api";
import { UserRole } from "./constants";

export const checkRole = (user?: UserDTO) => {
  return {
    isAdmin: user?.role === UserRole.ADMIN,
    isOwner: user?.role === UserRole.OWNER,
    isStaff: user?.role === UserRole.STAFF,
  };
};

export const createHttpResponseError = (error: unknown) => {
  return new Error(
    (error as HttpResponse<unknown, BaseResponseUserDTO>).error.message
  );
};

export function generateReceiptCode(receipt: ReceiptResponseDTO) {
  const createdAt = new Date(receipt.createdAt ?? new Date());
  const year = createdAt.getFullYear();
  const month = String(createdAt.getMonth() + 1).padStart(2, "0");
  const day = String(createdAt.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;
  const idPart = String(receipt.id).padStart(5, "0");
  const prefix = "REC";
  return `${prefix}${datePart}${idPart}`;
}
