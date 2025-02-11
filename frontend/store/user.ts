import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { UserDTO } from "@/types/Api";
import { globalStore } from ".";

type UserAtomType = {
  user?: UserDTO;
  showToastErrorSignIn: boolean;
  token?: string;
};

const localUserAtom = atom<UserAtomType>({
  user: undefined,
  showToastErrorSignIn: false,
  token: undefined,
});

export const userAtom = atom(
  (get) => get(localUserAtom),
  (get, set, update: Partial<UserAtomType>) => {
    set(localUserAtom, { ...get(localUserAtom), ...update });
    globalStore.set(localUserAtom, { ...get(localUserAtom), ...update });
  }
);

export const useUserAtom = () => useAtom(userAtom, { store: globalStore });
export const useSetUserAtom = () =>
  useSetAtom(userAtom, { store: globalStore });
export const useUserAtomValue = () =>
  useAtomValue(userAtom, { store: globalStore });
