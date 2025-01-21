import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { User } from "@/types/Api";
import { globalStore } from ".";

type UserAtomType = {
  user?: User;
  showToastErrorSignIn: boolean;
  token?: string;
};

const localUserAtom = atom<UserAtomType>({
  user: undefined,
  showToastErrorSignIn: false,
  token: undefined,
});

globalStore.sub(localUserAtom, () => {
  if (process.env.NODE_ENV === "development") {
    console.log("localUserAtom updated");
  }
});

export const userAtom = atom(
  (get) => get(localUserAtom),
  (get, set, update: Partial<UserAtomType>) => {
    set(localUserAtom, { ...get(localUserAtom), ...update });
    globalStore.set(localUserAtom, { ...get(localUserAtom), ...update });
  }
);

export const useUserAtom = () => useAtom(userAtom);
export const useSetUserAtom = () => useSetAtom(userAtom);
export const useUserAtomValue = () => useAtomValue(userAtom);
