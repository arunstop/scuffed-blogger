import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useSyncExternalStore
} from "react";
import { UserDisplay } from "../../../base/data/contexts/ContextUserDisplay";
import { autoRetry } from "../../helpers/MainHelpers";
import { fbUserDisplayGet } from "../../services/UserService";

export function createUDContext() {
  function usePubSubTemplate(init: UserDisplay): {
    get: () => UserDisplay;
    set: (callback: (state: UserDisplay) => Partial<UserDisplay>) => void;
    subscribe: (callback: () => void) => () => void;
  } {
    const store = useRef(init);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback(
      (callback: (state: UserDisplay) => Partial<UserDisplay>) => {
        const value = callback(store.current);
        store.current = { ...store.current, ...value };
        subscribers.current.forEach((callback) => callback());
      },
      [],
    );

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof usePubSubTemplate>;
  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  function Provider({
    children,
    initialState,
  }: {
    children: React.ReactNode;
    initialState?: UserDisplay;
  }) {
    const value = usePubSubTemplate(initialState ?? { displays: [] });
    return (
      <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    );
  }

  function useGetters<SelectorOutput>(
    selector: (store: UserDisplay) => SelectorOutput,
  ): SelectorOutput {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error("Store not found");
    }

    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector({ displays: [] }),
    );

    return state;
  }

  function useSetters() {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error("Store not found");
    }
    return {
      async addUserDisplay(userId: string) {
        console.log(store.get().displays);
        if (store.get().displays.find((e) => e.id === userId)) return;
        const displayFromDb = await autoRetry(
          async () => await fbUserDisplayGet({ data: { userId: userId } }),
        );
        if (!displayFromDb) return;
        store.set((state) => {
          return {
            ...state,
            displays: [...state.displays, displayFromDb],
          };
        });
      },
    };
  }

  return {
    Provider,
    useGetters,
    useSetters,
  };
}

export const {
  Provider: UserDisplayProvider,
  useGetters: useUserDisplayStates,
  useSetters: useUserDisplayActions,
} = createUDContext();
