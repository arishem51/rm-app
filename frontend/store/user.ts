import { atom } from "jotai";
export const userAtom = atom<{
  user?: UserResponse;
  showToastErrorSignIn: boolean;
}>({
  user: undefined,
  showToastErrorSignIn: false,
});
