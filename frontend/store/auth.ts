import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { globalStore } from ".";

type AuthAtomType = {
  showToastErrorSignIn: boolean;
  token?: string;
};

const localAuthAtom = atom<AuthAtomType>({
  showToastErrorSignIn: false,
  token: undefined,
});

export const authAtom = atom(
  (get) => get(localAuthAtom),
  (get, set, update: Partial<AuthAtomType>) => {
    set(localAuthAtom, { ...get(localAuthAtom), ...update });
    globalStore.set(localAuthAtom, { ...get(localAuthAtom), ...update });
  }
);

export const useAuthAtom = () => useAtom(authAtom, { store: globalStore });
export const useSetAuthAtom = () =>
  useSetAtom(authAtom, { store: globalStore });
export const useAuthAtomValue = () =>
  useAtomValue(authAtom, { store: globalStore });
