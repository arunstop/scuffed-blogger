import { useState } from "react";
import { MainNetworkResponse } from "./../data/Main";

// deciding the type wether on the generic type is empty or not
type LoadingProps<T> = T extends undefined
  ? boolean
  : { value: boolean; data?: T };

export function useNetworkAction<T1, T2 = undefined>(
  initLoading: LoadingProps<T2>,
) {
  // loading state
  const [loading, setLoading] = useState<LoadingProps<T2>>(initLoading);
  // loaded states
  const [netResp, setNetResp] = useState<MainNetworkResponse<T1>>();

  if (typeof loading === "boolean")
    return {
      onAction: loading || netResp,
      // not Loading
      isLoading: loading,
      // has Loaded
      // if loading type is boolean, check the loading state itself & netResp.data
      // if loading type is NOT boolean, check the loading data and netREsp data
      hasLoaded: !!netResp?.data,
      isError: netResp?.status === "error",
      isSuccess: netResp?.status === "success",
      // check if it is loading
      stopLoading: () => setLoading(false as LoadingProps<T2>),
      clearResp: () => {
        setLoading(false as LoadingProps<T2>);
      },
      loading,
      setLoading,
      netResp,
      setNetResp,
    };

  return {
    onAction: loading || netResp,
    // not Loading
    // check if user has attempted to do network action
    isLoading: loading.value,
    isError: !!loading.data && netResp?.status === "error",
    isSuccess: netResp?.status === "success",
    hasLoaded: !!loading.data && !!netResp?.data,
    loading,
    // stop loading
    stopLoading: () => {
      setLoading((prev) => {
        if (typeof loading === "boolean") return prev;
        // Only change the `value`
        // Assign the data from the previous one.
        return { ...(prev as any), value: false };
      });
      setNetResp(undefined);
    },
    clearResp: () => {
      setLoading((prev) => {
        if (typeof loading === "boolean") return prev;

        return { value: false, data: null } as any;
      });
      setNetResp(undefined);
    },
    setLoading,
    netResp,
    setNetResp,
  };
}
