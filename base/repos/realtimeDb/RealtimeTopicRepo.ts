import { axiosClient } from "../../clients/AxiosClient";

export interface ITopic {
  name: string;
}

export async function repoRtTopicGet(
  keyword: string,
  abortSignal?: AbortSignal,
) {
  return axiosClient.get(`/api/topic/all?keyword=${keyword}`, {
    signal: abortSignal,
  });
}
