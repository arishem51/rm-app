import { atom } from "jotai";
import { User } from "@/types/Api";

export const userAtom = atom<{
  user?: User;
  showToastErrorSignIn: boolean;
  token?: string;
}>({
  token: "",
  user: undefined,
  showToastErrorSignIn: false,
});
