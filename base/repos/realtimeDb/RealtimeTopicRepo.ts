import { AxiosResponse } from "axios";
import { axiosClient } from "../../clients/AxiosClient";
import { MainNetworkResponse } from "../../data/Main";
export interface ITopic {
  name: string;
}

export async function repoRtTopicGet(
  keyword: string,
  abortSignal?: AbortSignal,
): Promise<AxiosResponse<MainNetworkResponse>> {
  return axiosClient.get(`/api/topic/all?keyword=${keyword}`, {
    signal: abortSignal,
  });
}
