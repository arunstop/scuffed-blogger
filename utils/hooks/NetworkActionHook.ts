import { useState } from "react";
import { MainNetworkResponse } from "./../data/Main";

// deciding the type wether on the generic type is empty or not
type LoadingProps<T> = T extends undefined
  ? boolean
  : { value: boolean; data?: T };

export function useNetworkAction<T1, T2 = undefined>(initLoading:LoadingProps<T2>) {
  // loading state
  const [loading, setLoading] = useState<LoadingProps<T2>>(initLoading);
  // loaded states
  const [netResp, setNetResp] = useState<MainNetworkResponse<T1>>();

  return { loading, setLoading, netResp, setNetResp };
}
