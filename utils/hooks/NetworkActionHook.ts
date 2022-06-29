import { MainNetworkResponse } from "./../data/Main";
import { useState } from "react";

export function useNetworkAction<T>() {
  const [loading, setLoading] = useState(false);
  const [netResp, setNetResp] = useState<MainNetworkResponse<T>>();

  return { loading, setLoading, netResp, setNetResp };
}
